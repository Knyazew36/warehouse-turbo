import { AxiosResponse } from 'axios'
import { $api } from '@/shared/api' // ваш axios instance
import { apiDomain } from '@/shared/api/model/constants' // ваш базовый url
import { BaseResponse } from '@/shared/api'
import { IUser, Role } from '@/entitites/user/model/user.type'
import { AccessRequest, RequestAccessResponse } from './model/auth.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { AllowedPhone } from '../allowed-phone/model/allowed-phone.type'

// login через Telegram initData
export const loginWithTelegram = async (initData: string): Promise<IUser> => {
  try {
    const response: AxiosResponse<BaseResponse<any>> = await $api.post(`${apiDomain}/auth/login`, { initData })
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка авторизации'
    throw new Error(message)
  }
}

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

// Получить все разрешенные телефоны для организации
export const getAllowedPhonesForOrganization = async (): Promise<AllowedPhone[]> => {
  try {
    const response: AxiosResponse<BaseResponse<AllowedPhone[]>> = await $api.post(`${apiDomain}/allowed-phones/list`)
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка получения списка телефонов'
    throw new Error(message)
  }
}

// Удалить телефон из списка разрешенных организации
export const removePhoneFromOrganization = async (phone: string): Promise<void> => {
  try {
    await $api.delete(`${apiDomain}/allowed-phones/${phone}`)
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка удаления телефона'
    throw new Error(message)
  }
}

// Проверить, разрешен ли телефон в организации
export const checkPhoneInOrganization = async (
  phone: string
): Promise<{ phone: string; isAllowed: boolean; organizationId: number }> => {
  try {
    const response: AxiosResponse<BaseResponse<{ phone: string; isAllowed: boolean; organizationId: number }>> =
      await $api.post(`${apiDomain}/allowed-phones/check`, { phone })
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка проверки телефона'
    throw new Error(message)
  }
}

// Получить все организации, где разрешен телефон
export const getOrganizationsForPhone = async (phone: string): Promise<{ phone: string; organizations: any[] }> => {
  try {
    const response: AxiosResponse<BaseResponse<{ phone: string; organizations: any[] }>> = await $api.get(
      `${apiDomain}/allowed-phones/organizations/${phone}`
    )
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка получения организаций для телефона'
    throw new Error(message)
  }
}

// Получить все разрешенные телефоны (глобально)
export const getAllAllowedPhones = async (): Promise<AllowedPhone[]> => {
  try {
    const response: AxiosResponse<BaseResponse<AllowedPhone[]>> = await $api.get(`${apiDomain}/allowed-phones/all`)
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка получения всех телефонов'
    throw new Error(message)
  }
}

// Обратная совместимость - старые функции
export const allowedPhoneService = addPhoneToOrganization
export const allowedGetAllPhones = getAllowedPhonesForOrganization
