import axios, { AxiosError, AxiosResponse } from 'axios'

import { ErrorEventEmitter, eventEmitter } from '@/features/error-handler'

import log from './log'
import { ErrorResponse, BaseResponse } from './type'
import { toast } from 'sonner'
// import { json } from 'stream/consumers'
import React from 'react'
import {
  hapticFeedback,
  initData,
  isTMA,
  mockTelegramEnv,
  retrieveRawInitData
} from '@telegram-apps/sdk'
import { getOrganizationIdFromStore } from '../middleware/organization.middleware'

const initDataRaw =
  import.meta.env.VITE_IS_LOCAL === 'true'
    ? 'user=%7B%22id%22%3A239676985%2C%22first_name%22%3A%22%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9%22%2C%22last_name%22%3A%22%D0%9A%D0%BD%D1%8F%D0%B7%D0%B5%D0%B2%22%2C%22username%22%3A%22Knyaz_sv%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FdVwpqY8rwKcDgyKCeVKKd95SfUDZ89Fhpw-zbGDB6Rg.svg%22%7D&chat_instance=7502372238548063129&chat_type=sender&auth_date=1754586661&signature=VV4RsFYYSNd1PuFlVBr6p6aNZLLSMR6jx4k3rHqBc7GcxoIu7zXCkLen80Zp8dTu3gR-nS77klhE_A4sjthKAw&hash=a700354363334c71f86f3e62bee88491cab97414d20ed3de0954938e0ed530a7'
    : isTMA()
      ? retrieveRawInitData()
      : ''
// const initDataRaw = isTMA() ? retrieveRawInitData() : ''
const isProduction = import.meta.env.PROD

// Создаем экземпляр Axios
const $api = axios.create({
  withCredentials: true,
  headers: {
    Authorization: `tma ${initDataRaw}`
  }
})

// Удаляем старые глобальные переменные и функции, так как теперь используем Zustand store

// Интерцептор для запросов
$api.interceptors.request.use(
  async config => {
    // Добавляем organizationId в заголовки, если он есть
    const organizationId = getOrganizationIdFromStore()
    if (organizationId) {
      config.headers['x-organization-id'] = organizationId.toString()
    }

    if (!isProduction) {
      log({
        name: config.url ?? 'undefined url',
        data: config,
        type: 'request',
        payload: config.data
      })
    }
    return config
  },
  error => {
    hapticFeedback.notificationOccurred('error')

    throw error
  }
)

// Интерцептор для ответов
$api.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<any>>) => {
    if (!isProduction) {
      log({
        name: response.config.url ?? 'undefined url',
        data: response,
        type: 'response'
      })
    }

    if (
      (response.data?.user?.id && !response.data?.user?.role) ||
      response.data?.data?.message === 'User not found in organization'
    ) {
      const errorData: ErrorEventEmitter = {
        action: 'navigation',
        href: '/'
      }
      eventEmitter.emit('request-error', errorData)
    }

    if (response.data?.user?.allowedPhone === false) {
      if (import.meta.env.DEV) return response
      const errorData: ErrorEventEmitter = {
        action: 'bottom-sheet',
        description:
          'Для продолжения работы необходимо разрешить доступ к телефону в боте приложения. Без данного разрешения вы не увидите приглашения в организации.',
        message: 'Необходимо подтверждение телефона',
        variant: 'auth'
      }
      eventEmitter.emit('request-error', errorData)
    }

    return response
  },
  (error: AxiosError<ErrorResponse>) => {
    // Обработка ошибок аутентификации
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Authentication failed'

      // Специальная обработка для ошибок Telegram аутентификации
      if (
        errorMessage.includes('InitData validation failed') ||
        errorMessage.includes('Invalid authorization header') ||
        errorMessage.includes('InitData parse failed')
      ) {
        const errorData: ErrorEventEmitter = {
          action: 'bottom-sheet',
          message: 'Ошибка аутентификации',
          description: 'Пожалуйста, перезапустите приложение и попробуйте снова',
          variant: 'error'
        }
        eventEmitter.emit('request-error', errorData)

        // Также выполняем logout
        const logoutData: ErrorEventEmitter = { action: 'logout' }
        eventEmitter.emit('request-error', logoutData)
        return
      }

      // Обычная обработка 401 ошибки
      const errorData: ErrorEventEmitter = { action: 'logout' }
      eventEmitter.emit('request-error', errorData)
    }

    handleResponseError(error)
    logErrorDetails(error)

    if (error.response?.data?.message === 'Product already exists in this organization') {
      const errorData: ErrorEventEmitter = {
        action: 'bottom-sheet',
        message: 'Товар уже существует',
        variant: 'error'
      }
      eventEmitter.emit('request-error', errorData)
      return
    }

    if (error.response?.data?.message === 'Category with this name already exists') {
      const errorData: ErrorEventEmitter = {
        action: 'bottom-sheet',
        message: 'Категория уже существует',
        variant: 'error'
      }
      eventEmitter.emit('request-error', errorData)
      return
    }
    if (error.response?.data?.message === 'Category already exists in this organization') {
      const errorData: ErrorEventEmitter = {
        action: 'bottom-sheet',
        message: 'Категория с таким названием уже существует',

        description: 'Пожалуйста, выберите другое название',
        variant: 'error'
      }
      eventEmitter.emit('request-error', errorData)
      return
    }

    // Показываем toast только для не-401 ошибок
    if (error.response?.status !== 401) {
      toast(error?.response?.data?.message || error?.message, {
        style: { backgroundColor: '#FB2C36', color: '#fff' },
        description: import.meta.env.DEV
          ? React.createElement(
              'pre',
              { className: 'mt-2 w-[320px] rounded-md bg-neutral-950 p-4' },
              React.createElement(
                'code',
                { className: 'text-white' },
                JSON.stringify(error.response?.data?.message ?? {}, null, 2)
              )
            )
          : error?.response?.data?.message || error?.message
      })
    }

    throw error
  }
)

// Логирование ошибок
function logErrorDetails(error: AxiosError) {
  log({
    name: axios.isAxiosError(error)
      ? (error.config?.url ?? 'undefined url')
      : 'Not instance of AxiosError',
    data: error,
    type: 'catch'
  })
}

// Обработка ошибок
function handleResponseError(error: AxiosError<ErrorResponse>) {
  if (error.response?.status === 403) {
    console.info('403')
    const errorData: ErrorEventEmitter = { action: 'navigation', href: '/' }
    eventEmitter.emit('request-error', errorData)
  }

  // if (error.response?.status === 401) {
  //   const errorData: ErrorEventEmitter = { action: 'logout' }
  //   eventEmitter.emit('request-error', errorData)
  // }
}

export default $api
