export interface BaseResponse<T> {
  data: T
  timestamp: string
  status: string
  error?: { message: string; error: string; statusCode: number }
  path?: string
  user?: {
    id: number
    telegramId: string
    allowedPhone: boolean
    role: string | null
  }
}

export interface ErrorResponse {
  error: boolean
  message?: string
  code: number
}
