import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IUser, Role, UpdateUserDto } from '../model/user.type'
import { apiDomain } from '@/shared/api/model/constants'
import $api from '@/shared/api/model/request'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { Product } from '@/entitites/product/model/product.type'
import { BaseResponse } from '@/shared/api'

interface GetUserDto {
  role?: Role
  onlyEmployees?: boolean
}

export const useUsers = (dto: GetUserDto) => {
  return useQuery<IUser[]>({
    queryKey: ['user', dto],
    queryFn: async () => {
      const params = dto ? { ...dto } : undefined
      const res = await $api.get(`${apiDomain}/user`, { params })
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateUserDto }) => {
      const res = await $api.post(`${apiDomain}/user/update/${id}`, dto)
      return res.data.data as IUser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'employees'] })
      hapticFeedback.notificationOccurred('success')
    },
    onError: () => {
      hapticFeedback.notificationOccurred('error')
    }
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      organizationId,
      userId,
      role
    }: {
      organizationId: number
      userId: number
      role: Role
    }) => {
      const res = await $api.post(
        `${apiDomain}/organizations/${organizationId}/users/${userId}/role`,
        { role }
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'employees'] })
      queryClient.invalidateQueries({ queryKey: ['user-role'] })
      hapticFeedback.notificationOccurred('success')
    },
    onError: () => {
      hapticFeedback.notificationOccurred('error')
    }
  })
}

export const useUserDelete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await $api.post(`${apiDomain}/user/remove/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      hapticFeedback.notificationOccurred('success')
    },
    onError: () => {
      hapticFeedback.notificationOccurred('error')
    }
  })
}

export const useUsersEmployees = () => {
  return useQuery<{ data: IUser[]; user: BaseResponse<IUser>['user'] }>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/user/employees`)
      return {
        data: res.data.data,
        user: res.data.user as BaseResponse<IUser>['user']
      }
    },
    retry: 3,
    retryDelay: 5000
  })
}
export const useUserRole = ({ id }: { id: string }) => {
  const { setRole } = useAuthStore()

  return useQuery<Role>({
    queryKey: ['user-role', id],
    queryFn: async () => {
      try {
        const res = await $api.get(`${apiDomain}/user/${id}/role`)
        const role = res.data.data?.role
        if (role) {
          setRole(role)
        }
        return role
      } catch (error) {
        console.error('Error fetching user role:', error)
        // В случае ошибки возвращаем GUEST как роль по умолчанию
        setRole(Role.GUEST)
        return Role.GUEST
      }
    },
    enabled: !!id
  })
}
