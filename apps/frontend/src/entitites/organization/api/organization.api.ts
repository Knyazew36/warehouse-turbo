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

const ORGANIZATION_KEYS = {
  all: ['organizations'] as const,
  lists: () => [...ORGANIZATION_KEYS.all, 'list'] as const,
  list: (filters: string) => [...ORGANIZATION_KEYS.lists(), { filters }] as const,
  details: () => [...ORGANIZATION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ORGANIZATION_KEYS.details(), id] as const,
  my: () => [...ORGANIZATION_KEYS.all, 'my'] as const,
  users: (id: number) => [...ORGANIZATION_KEYS.all, 'users', id] as const
}

// Получить все организации
export const useOrganizations = () => {
  return useQuery<IOrganization[]>({
    queryKey: ORGANIZATION_KEYS.lists(),
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/organizations`)
      return res.data.data
    }
  })
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

// Получить организацию по ID
export const useOrganization = (id: number) => {
  return useQuery<IOrganization>({
    queryKey: ORGANIZATION_KEYS.detail(id),
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/organizations/${id}`)
      return res.data.data
    },
    enabled: !!id
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
      const res = await $api.patch(`${apiDomain}/organizations/${id}`, data)
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
      await $api.delete(`${apiDomain}/organizations/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.my() })
    }
  })
}

// Добавить пользователя в организацию
export const useAddUserToOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: number; data: IAddUserToOrganization }) => {
      const res = await $api.post(`${apiDomain}/organizations/${organizationId}/users`, data)
      return res.data.data
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.users(organizationId) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(organizationId) })
    }
  })
}

// Удалить пользователя из организации
export const useRemoveUserFromOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, userId }: { organizationId: number; userId: number }) => {
      await $api.delete(`${apiDomain}/organizations/${organizationId}/users/${userId}`)
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.users(organizationId) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(organizationId) })
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
      const res = await $api.patch(`${apiDomain}/organizations/${organizationId}/users/${userId}/role`, {
        role,
        isOwner
      })
      return res.data.data
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.users(organizationId) })
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEYS.detail(organizationId) })
    }
  })
}
