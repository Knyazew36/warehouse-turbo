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
      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({ queryKey: ['category-list'] })
      queryClient.invalidateQueries({ queryKey: ['category-with-products'] })
      queryClient.invalidateQueries({ queryKey: ['category-select-options'] })
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
      console.log('Invalidating queries after category update...')
      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({ queryKey: ['category-list'] })
      queryClient.invalidateQueries({ queryKey: ['category-with-products'] })
      queryClient.invalidateQueries({ queryKey: ['category-select-options'] })
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
    onMutate: async (id: number) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ['category-list'] })
      await queryClient.cancelQueries({ queryKey: ['category-with-products'] })
      await queryClient.cancelQueries({ queryKey: ['category-select-options'] })

      // Сохраняем предыдущие данные
      const previousCategories = queryClient.getQueryData(['category-list'])
      const previousCategoriesWithProducts = queryClient.getQueryData(['category-with-products'])
      const previousSelectOptions = queryClient.getQueryData(['category-select-options'])

      // Оптимистично удаляем категорию из всех кэшей
      queryClient.setQueryData(['category-list'], (old: Category[] | undefined) => {
        if (!old) return old
        return old.filter(category => category.id !== id)
      })

      queryClient.setQueryData(['category-list', false], (old: Category[] | undefined) => {
        if (!old) return old
        return old.filter(category => category.id !== id)
      })

      queryClient.setQueryData(['category-list', true], (old: Category[] | undefined) => {
        if (!old) return old
        return old.filter(category => category.id !== id)
      })

      queryClient.setQueryData(
        ['category-with-products'],
        (old: GetCategoryWithProducts | undefined) => {
          if (!old) return old
          return {
            ...old,
            categories: old.categoriesWithProducts.filter(category => category.id !== id)
          }
        }
      )

      queryClient.setQueryData(
        ['category-with-products', false],
        (old: GetCategoryWithProducts | undefined) => {
          if (!old) return old
          return {
            ...old,
            categories: old.categoriesWithProducts.filter(category => category.id !== id)
          }
        }
      )

      queryClient.setQueryData(
        ['category-with-products', true],
        (old: GetCategoryWithProducts | undefined) => {
          if (!old) return old
          return {
            ...old,
            categories: old.categoriesWithProducts.filter(category => category.id !== id)
          }
        }
      )

      queryClient.setQueryData(['category-select-options'], (old: ISelectOption[] | undefined) => {
        if (!old) return old
        return old.filter(option => option.value !== id.toString())
      })

      queryClient.setQueryData(
        ['category-select-options', false],
        (old: ISelectOption[] | undefined) => {
          if (!old) return old
          return old.filter(option => option.value !== id.toString())
        }
      )

      queryClient.setQueryData(
        ['category-select-options', true],
        (old: ISelectOption[] | undefined) => {
          if (!old) return old
          return old.filter(option => option.value !== id.toString())
        }
      )

      return {
        previousCategories,
        previousCategoriesWithProducts,
        previousSelectOptions
      }
    },
    onError: (err, id, context) => {
      // Восстанавливаем предыдущие данные при ошибке
      if (context?.previousCategories) {
        queryClient.setQueryData(['category-list'], context.previousCategories)
      }
      if (context?.previousCategoriesWithProducts) {
        queryClient.setQueryData(['category-with-products'], context.previousCategoriesWithProducts)
      }
      if (context?.previousSelectOptions) {
        queryClient.setQueryData(['category-select-options'], context.previousSelectOptions)
      }
      hapticFeedback.notificationOccurred('error')
    },
    onSettled: () => {
      // Инвалидируем все связанные запросы для синхронизации с сервером
      queryClient.invalidateQueries({ queryKey: ['category-list'] })
      queryClient.invalidateQueries({ queryKey: ['category-with-products'] })
      queryClient.invalidateQueries({ queryKey: ['category-select-options'] })
    },
    onSuccess: () => {
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
