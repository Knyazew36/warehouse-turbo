import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { AllowedPhone } from './allowed-phone.type'
import { BaseResponse } from '@/shared/api/model/type'
import { apiDomain } from '@/shared/api/model/constants'
import { AxiosResponse } from 'axios'
import { $api } from '@/shared/api'

// Добавить телефон в список разрешенных для организации
export const addPhoneToOrganization = async ({
  phone,
  comment
}: {
  phone: string
  comment?: string
}): Promise<AllowedPhone> => {
  try {
    const response: AxiosResponse<BaseResponse<AllowedPhone>> = await $api.post(`${apiDomain}/allowed-phones/add`, {
      phone,
      comment
    })
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка добавления телефона'
    throw new Error(message)
  }
}

export const useAllowedPhonesForOrganization = () => {
  return useQuery({
    queryKey: ['allowed-phones'],
    queryFn: async () => {
      const res: AxiosResponse<BaseResponse<AllowedPhone[]>> = await $api.post(`${apiDomain}/allowed-phones/list`)
      return res.data.data
    }
  })
}

export const useDeleteAllowedPhone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await $api.post(`${apiDomain}/allowed-phones/delete/${id}`)
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['allowed-phones'] })

      // Snapshot the previous value
      const previousAllowedPhones = queryClient.getQueryData<AllowedPhone[]>(['allowed-phones'])

      // Optimistically update to the new value
      if (previousAllowedPhones) {
        queryClient.setQueryData<AllowedPhone[]>(['allowed-phones'], old => {
          return old ? old.filter(allowedPhone => allowedPhone.id !== id) : old
        })
      }

      // Return a context object with the snapshotted value
      return { previousAllowedPhones }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAllowedPhones) {
        queryClient.setQueryData(['allowed-phones'], context.previousAllowedPhones)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['allowed-phones'] })
    },
    onSuccess: () => {
      hapticFeedback.notificationOccurred('success')
    }
  })
}
