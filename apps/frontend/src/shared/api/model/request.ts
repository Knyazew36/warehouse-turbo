import axios, { AxiosError } from 'axios'

import { ErrorEventEmitter, eventEmitter } from '@/features/error-handler'

import log from './log'
import { ErrorResponse } from './type'
import { toast } from 'sonner'
// import { json } from 'stream/consumers'
import React from 'react'
import { hapticFeedback, initData, isTMA, mockTelegramEnv, retrieveRawInitData } from '@telegram-apps/sdk'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

const initDataRaw = import.meta.env.DEV
  ? 'query_id=AAE5LkkOAAAAADkuSQ4OlMA2&user=%7B%22id%22%3A239676985%2C%22first_name%22%3A%22%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9%22%2C%22last_name%22%3A%22%D0%9A%D0%BD%D1%8F%D0%B7%D0%B5%D0%B2%22%2C%22username%22%3A%22Knyaz_sv%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FdVwpqY8rwKcDgyKCeVKKd95SfUDZ89Fhpw-zbGDB6Rg.svg%22%7D&auth_date=1752767184&signature=1A0sPL6PBEvO6iwx4Vtw2pcLcHQuNyADqM39-7ASO1LGSmDZ4hWpeD7rVUOtvLpy7OA2bDr2v-4AsKPq547kBQ&hash=9ad91e21ebae5480a7d979046aa30d9c46629dee00a65515a0b16a3cbc530c57'
  : isTMA()
    ? retrieveRawInitData()
    : ''
const isProduction = false

// Создаем экземпляр Axios
const $api = axios.create({
  withCredentials: true,
  headers: {
    Authorization: `tma ${initDataRaw}`
  }
})

// Функция для получения organizationId из store
const getOrganizationId = (): number | null => {
  // Получаем состояние store напрямую
  const state = useOrganizationStore.getState()
  return state.organizationId
}

// Интерцептор для запросов
$api.interceptors.request.use(
  async config => {
    // Добавляем organizationId в заголовки, если он есть
    const organizationId = getOrganizationId()
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
  response => {
    if (!isProduction) {
      log({
        name: response.config.url ?? 'undefined url',
        data: response,
        type: 'response'
      })
    }
    if (response?.data?.statusBD === 'loading') {
      const errorData: ErrorEventEmitter = { action: 'navigation', href: '?modal=bd-loading' }

      eventEmitter.emit('request-error', errorData)
    }
    if (response?.data?.data.statusBD === 'error') {
      const errorData: ErrorEventEmitter = { action: 'navigation', href: '?modal=bd-error' }
      eventEmitter.emit('request-error', errorData)
    }

    if (response?.data?.status === 'error') {
    }

    return response
  },
  error => {
    handleResponseError(error as AxiosError<ErrorResponse>)
    logErrorDetails(error as AxiosError)
    toast(error?.response?.data?.message || error?.message, {
      style: { backgroundColor: '#FB2C36', color: '#fff' },
      description: import.meta.env.DEV
        ? React.createElement(
            'pre',
            { className: 'mt-2 w-[320px] rounded-md bg-neutral-950 p-4' },
            React.createElement(
              'code',
              { className: 'text-white' },
              JSON.stringify(error.response?.data ?? {}, null, 2)
            )
          )
        : error?.response?.data?.message || error?.message
    })

    throw error
  }
)

// Логирование ошибок
function logErrorDetails(error: AxiosError) {
  log({
    name: axios.isAxiosError(error) ? (error.config?.url ?? 'undefined url') : 'Not instance of AxiosError',
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
