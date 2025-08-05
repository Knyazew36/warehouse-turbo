import { $api, apiDomain, BaseResponse } from '@/shared/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Category,
  CreateCategoryDto,
  GetCategoryWithProducts,
  UpdateCategoryDto
} from '../model/category.type'
import { AxiosResponse } from 'axios'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { ISelectOption } from '@/shared/ui/select/model/select.type'

export const useCategoryWithProducts = (onlyActive?: boolean) => {
  return useQuery<GetCategoryWithProducts>({
    queryKey: ['category-with-products', onlyActive],
    queryFn: async () => {
      const params = onlyActive !== undefined ? { onlyActive } : undefined
      const res: AxiosResponse<BaseResponse<GetCategoryWithProducts>> = await $api.get(
        `${apiDomain}/categories/with-products`,
        { params }
      )
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}

// Отдельный хук для получения категорий в формате для селекта
export const useCategorySelectOptions = (onlyActive?: boolean) => {
  return useQuery<ISelectOption[]>({
    queryKey: ['category-select-options', onlyActive],
    queryFn: async () => {
      const params: Record<string, any> = { isSelectOptions: true }

      if (onlyActive !== undefined) {
        params.onlyActive = onlyActive
      }

      const res: AxiosResponse<BaseResponse<ISelectOption[]>> = await $api.get(
        `${apiDomain}/categories`,
        { params }
      )
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}

// Отдельный хук для получения полных данных категорий
export const useCategoryList = (onlyActive?: boolean) => {
  return useQuery<Category[]>({
    queryKey: ['category-list', onlyActive],
    queryFn: async () => {
      const params: Record<string, any> = {}

      if (onlyActive !== undefined) {
        params.onlyActive = onlyActive
      }

      const res: AxiosResponse<BaseResponse<Category[]>> = await $api.get(
        `${apiDomain}/categories`,
        { params: Object.keys(params).length > 0 ? params : undefined }
      )
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateCategoryDto) => {
      const res = await $api.post(`${apiDomain}/categories`, dto)
      return res.data.data as Category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-with-products', true] })
      hapticFeedback.notificationOccurred('success')
    },
    onError: () => {
      console.info('error')
      hapticFeedback.notificationOccurred('error')
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateCategoryDto }) => {
      const res = await $api.post(`${apiDomain}/categories/update/${id}`, dto)
      return res.data.data as Category
    },
    onSuccess: () => {
      console.log('Invalidating queries after product update...')
      queryClient.invalidateQueries({ queryKey: ['category-with-products', true] })
      queryClient.invalidateQueries({ queryKey: ['category-with-products'] })
      hapticFeedback.notificationOccurred('success')
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await $api.post(`${apiDomain}/categories/delete/${id}`)
    },
    onSuccess: () => {
      console.log('Invalidating queries after product deletion...')
      queryClient.invalidateQueries({ queryKey: ['category-with-products', true] })
      queryClient.invalidateQueries({ queryKey: ['category-with-products'] })
      hapticFeedback.notificationOccurred('success')
    }
  })
}

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response: AxiosResponse<BaseResponse<Category>> = await $api.get(
      `${apiDomain}/categories/${id}`
    )
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка авторизации'
    throw new Error(message)
  }
}
