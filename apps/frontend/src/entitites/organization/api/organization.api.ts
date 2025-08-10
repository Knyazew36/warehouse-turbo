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
  INotificationSettings,
  Role,
  OrganizationStats
} from '../model/organization.type'
import { BaseResponse } from '@/shared/api'
import { USER_KEYS } from '@/entitites/user/api/user.api'

export const ORGANIZATION_KEYS = {
  all: ['organizations'] as const,
  lists: () => [...ORGANIZATION_KEYS.all, 'list'] as const,
  list: (filters: string) => [...ORGANIZATION_KEYS.lists(), { filters }] as const,
  details: () => [...ORGANIZATION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ORGANIZATION_KEYS.details(), id] as const,
  available: () => [...ORGANIZATION_KEYS.all, 'available'] as const,
  stats: () => ['stats'] as const,
  organization: (id: number) => ['organization', id] as const
}

export const useOrganizationById = (id: number) => {
  return useQuery<IOrganization>({
    queryKey: ORGANIZATION_KEYS.organization(id),
    queryFn: async () => {
      const res: AxiosResponse<BaseResponse<IOrganization>> = await $api.get(
        `${apiDomain}/organizations/${id}`
      )
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000,
    enabled: Boolean(id)
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
      // queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
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
      // queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
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
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.available() })
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
      // queryClient.invalidateQueries({
      //   queryKey: ORGANIZATION_KEYS.users(organizationId)
      // })
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
        queryKey: USER_KEYS.employees()
      })
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.detail(organizationId)
      })
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
      // queryClient.invalidateQueries({
      //   queryKey: ORGANIZATION_KEYS.users(organizationId)
      // })
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
    queryKey: ORGANIZATION_KEYS.available(),
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
      // queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_KEYS.available()
      })
    }
  })
}

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

// Обновить настройки уведомлений организации
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation<
    any,
    Error,
    { id: number; data: INotificationSettings },
    { previousOrganization?: IOrganization; previousOrganizations?: any }
  >({
    mutationFn: async ({ id, data }: { id: number; data: INotificationSettings }) => {
      const res = await $api.post(`${apiDomain}/organizations/${id}/notification-settings`, data)
      return res.data.data
    },
    onMutate: async ({ id, data }) => {
      // Отменяем исходящие запросы, чтобы они не перезаписали наш оптимистичный update
      await queryClient.cancelQueries({ queryKey: ORGANIZATION_KEYS.detail(id) })

      // Сохраняем предыдущее значение для возможного отката
      const previousOrganization = queryClient.getQueryData<IOrganization>(
        ORGANIZATION_KEYS.detail(id)
      )

      // Оптимистично обновляем данные организации
      if (previousOrganization) {
        queryClient.setQueryData<IOrganization>(ORGANIZATION_KEYS.detail(id), {
          ...previousOrganization,
          settings: {
            ...previousOrganization.settings,
            notifications: data
          }
        })
      }

      // Возвращаем контекст с предыдущими значениями для возможного отката
      return { previousOrganization }
    },
    onError: (err, variables, context) => {
      // В случае ошибки откатываем изменения
      if (context?.previousOrganization && variables) {
        queryClient.setQueryData(
          ORGANIZATION_KEYS.detail(variables.id),
          context.previousOrganization
        )
      }
    },
    onSettled: (_, variables) => {
      // В любом случае инвалидируем кэш для получения актуальных данных
      if (variables && 'id' in variables) {
        queryClient.invalidateQueries({
          queryKey: ORGANIZATION_KEYS.detail(variables.id as number)
        })
      }
    }
  })
}

export const useOrganizationStats = () => {
  return useQuery<OrganizationStats[]>({
    queryKey: ORGANIZATION_KEYS.stats(),
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/organizations/stats`)
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}
