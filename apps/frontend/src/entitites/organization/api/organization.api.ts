import { AxiosResponse } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiDomain } from '@/shared/api/model/constants'
import $api from '@/shared/api/model/request'
import {
  IOrganization,
  IUserOrganization,
  ICreateOrganization,
  IUpdateOrganization,
  IAddUserToOrganization,
  Role
} from '../model/organization.type'
import { Consumption } from '@/entitites/shift/model/shift.type'
import { BaseResponse } from '@/shared/api'

const ORGANIZATION_KEYS = {
  all: ['organizations'] as const,
  lists: () => [...ORGANIZATION_KEYS.all, 'list'] as const,
  list: (filters: string) => [...ORGANIZATION_KEYS.lists(), { filters }] as const,
  details: () => [...ORGANIZATION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ORGANIZATION_KEYS.details(), id] as const,
  my: () => [...ORGANIZATION_KEYS.all, 'my'] as const,
  users: (id: number) => [...ORGANIZATION_KEYS.all, 'users', id] as const
}

// Получить мои организации
export const useMyOrganizations = () => {
  return useQuery<IUserOrganization[]>({
    queryKey: ORGANIZATION_KEYS.my(),
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/organizations/my`)
      return res.data.data
    }
  })
}

// Получить пользователей организации
export const useOrganizationUsers = (id: number) => {
  return useQuery<IUserOrganization[]>({
    queryKey: ORGANIZATION_KEYS.users(id),
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/organizations/${id}/users`)
      return res.data.data
    },
    enabled: !!id
  })
}

// Создать организацию
export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ICreateOrganization) => {
      const res = await $api.post(`${apiDomain}/organizations`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
    }
  })
}

// Обновить организацию
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IUpdateOrganization }) => {
      const res = await $api.post(`${apiDomain}/organizations/${id}/update`, data)
      return res.data.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
    }
  })
}

// Удалить организацию
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await $api.post(`${apiDomain}/organizations/delete/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.lists() })
      // queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
      // Инвалидируем кэш для доступных организаций
      queryClient.invalidateQueries({ queryKey: [...ORGANIZATION_KEYS.my(), 'available'] })
    }
  })
}

// Добавить пользователя в организацию
export const useAddUserToOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      organizationId,
      data
    }: {
      organizationId: number
      data: IAddUserToOrganization
    }) => {
      const res = await $api.post(`${apiDomain}/organizations/${organizationId}/users`, data)
      return res.data.data
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.users(organizationId)
      })
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.detail(organizationId)
      })
    }
  })
}

// Удалить пользователя из организации
export const useRemoveUserFromOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, userId }: { organizationId: number; userId: number }) => {
      await $api.post(`${apiDomain}/organizations/${organizationId}/users/${userId}/remove`)
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.users(organizationId)
      })
      queryClient.invalidateQueries({
        queryKey: ['employees']
      })
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.detail(organizationId)
      })
      // Инвалидируем кэш для доступных организаций
      queryClient.invalidateQueries({ queryKey: [...ORGANIZATION_KEYS.my(), 'available'] })
    }
  })
}

// Обновить роль пользователя в организации
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      organizationId,
      userId,
      role,
      isOwner
    }: {
      organizationId: number
      userId: number
      role: Role
      isOwner?: boolean
    }) => {
      const res = await $api.patch(
        `${apiDomain}/organizations/${organizationId}/users/${userId}/role`,
        {
          role,
          isOwner
        }
      )
      return res.data.data
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.users(organizationId)
      })
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.detail(organizationId)
      })
    }
  })
}

// Получить организации, доступные пользователю (включая приглашения)
export const useAvailableOrganizations = () => {
  return useQuery<{
    data: {
      myOrganizations: IUserOrganization[]
      invitedOrganizations: IOrganization[]
    }
    user: BaseResponse<{
      myOrganizations: IUserOrganization[]
      invitedOrganizations: IOrganization[]
    }>['user']
  }>({
    queryKey: [...ORGANIZATION_KEYS.my(), 'available'],
    queryFn: async () => {
      const res: AxiosResponse<
        BaseResponse<{
          myOrganizations: IUserOrganization[]
          invitedOrganizations: IOrganization[]
        }>
      > = await $api.get(`${apiDomain}/organizations/available`)
      console.info('res', res.data.data)
      return {
        data: res.data.data,
        user: res.data.user
      }
    }
  })
}

// Присоединиться к организации через приглашение
export const useJoinOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (organizationId: number) => {
      const res = await $api.post(`${apiDomain}/organizations/${organizationId}/join`)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
      queryClient.invalidateQueries({
        queryKey: [...ORGANIZATION_KEYS.my(), 'available']
      })
    }
  })
}

// export const useRemoveUserFromOrganization = () => {
//   return useMutation({
//     mutationFn: async ({ organizationId, userId }: { organizationId: number; userId: number }) => {
//       await $api.post(`${apiDomain}/organizations/${organizationId}/users/${userId}/remove`)
//     }
//   })
// }

// export const removeUserFromOrganization = async ({
//   organizationId,
//   userId
// }: {
//   organizationId: number
//   userId: number
// }) => {
//   try {
//     const response: AxiosResponse<BaseResponse<any>> = await $api.post(
//       `${apiDomain}/organizations/${organizationId}/users/${userId}/remove`
//     )
//     return response.data.data
//   } catch (error: any) {
//     const message = error?.response?.data?.message || 'Ошибка удаления пользователя из организации'
//     throw new Error(message)
//   }
// }

export const getOrganizationById = async ({ id }: { id: number }) => {
  try {
    const response: AxiosResponse<BaseResponse<any>> = await $api.get(
      `${apiDomain}/organizations/${id}`
    )
    console.info('asdf', response.data.data)
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка удаления пользователя из организации'
    throw new Error(message)
  }
}
