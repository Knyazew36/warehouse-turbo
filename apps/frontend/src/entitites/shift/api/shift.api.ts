import { apiDomain } from '@/shared/api/model/constants'
import { $api, BaseResponse } from '@/shared/api'
import { AxiosResponse } from 'axios'
import { Consumption, ShiftReport } from '../model/shift.type'

// Типы данных

// API функция для создания shift report
export const shiftCreate = async (consumptions: Consumption[]): Promise<any> => {
  try {
    const response: AxiosResponse<BaseResponse<any>> = await $api.post(`${apiDomain}/shifts`, { consumptions })
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка создания сменного отчёта'
    throw new Error(message)
  }
}

export const shiftGetAll = async (): Promise<ShiftReport[]> => {
  try {
    const response: AxiosResponse<BaseResponse<ShiftReport[]>> = await $api.get(`${apiDomain}/shifts`)
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка загрузки сменных отчётов'
    throw new Error(message)
  }
}
