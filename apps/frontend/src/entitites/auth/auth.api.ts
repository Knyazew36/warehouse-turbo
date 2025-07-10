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

export const allowedPhoneService = async ({ phone }: { phone: string }): Promise<any> => {
  try {
    const response: AxiosResponse<BaseResponse<{ phone: string }[]>> = await $api.post(
      `${apiDomain}/allowed-phones/add`,
      { phone }
    )
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка добавления телефона'
    throw new Error(message)
  }
}

export const allowedGetAllPhones = async (): Promise<AllowedPhone[]> => {
  try {
    const response: AxiosResponse<BaseResponse<AllowedPhone[]>> = await $api.post(`${apiDomain}/allowed-phones/list`)
    return response.data.data
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Ошибка добавления телефона'
    throw new Error(message)
  }
}
