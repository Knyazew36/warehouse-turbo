import { AxiosResponse } from 'axios'
import { $api, PaginationResponse } from '@/shared/api' // ваш axios instance
import { apiDomain } from '@/shared/api/model/constants' // ваш базовый url
import { BaseResponse } from '@/shared/api'
import { Receipt, StatisticsOperation, StatisticsResponse } from '../model/receipt.type'
import { useQuery } from '@tanstack/react-query'

export interface CreateReceiptDto {
  receipts: {
    productId: number
    quantity: number
  }[]
}

export const receiptCreate = async (dto: CreateReceiptDto): Promise<Receipt> => {
  try {
    const response: AxiosResponse<BaseResponse<Receipt>> = await $api.post(
      `${apiDomain}/receipts`,
      dto
    )
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка создания поступления'
    throw new Error(message)
  }
}

export const useStatistics = ({
  start,
  end,
  page,
  limit
}: {
  start?: string
  end?: string
  page?: number
  limit?: number
}) => {
  return useQuery<PaginationResponse<StatisticsOperation>['data']>({
    queryKey: ['statistics', start, end],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (start) params.append('start', start)
      if (end) params.append('end', end)
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      const queryString = params.toString() ? `?${params.toString()}` : ''
      const response: AxiosResponse<PaginationResponse<StatisticsOperation>> = await $api.get(
        `${apiDomain}/receipts/statistics${queryString}`
      )

      return response.data.data
    }
  })
}
