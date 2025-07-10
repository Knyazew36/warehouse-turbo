// src/entities/product.api.ts
import { AxiosResponse } from 'axios'
import { $api, apiDomain, BaseResponse } from '@/shared/api'
import { Product } from '../model/product.type'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hapticFeedback } from '@telegram-apps/sdk-react'

interface CreateProductDto {
  name: string
  quantity: number
  minThreshold: number
  unit?: string
  category?: string
  active?: boolean
}

type UpdateProductDto = Partial<CreateProductDto>

export const useProducts = (onlyActive?: boolean) => {
  return useQuery<Product[]>({
    queryKey: ['products', onlyActive],
    queryFn: async () => {
      const params = onlyActive !== undefined ? { onlyActive } : undefined
      const res = await $api.get(`${apiDomain}/products`, { params })
      return res.data.data
    },
    retry: 3,
    retryDelay: 5000
  })
}

export const useProductById = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await $api.get(`${apiDomain}/products/${id}`)
      return res.data.data
    },
    enabled: !!id
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateProductDto) => {
      const res = await $api.post(`${apiDomain}/products`, dto)
      return res.data.data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      hapticFeedback.notificationOccurred('success')
    },
    onError: () => {
      console.info('error')
      hapticFeedback.notificationOccurred('error')
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateProductDto }) => {
      const res = await $api.post(`${apiDomain}/products/update/${id}`, dto)
      return res.data.data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      hapticFeedback.notificationOccurred('success')
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await $api.post(`${apiDomain}/products/delete/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      hapticFeedback.notificationOccurred('success')
    }
  })
}
