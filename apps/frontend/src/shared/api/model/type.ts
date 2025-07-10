export interface BaseResponse<T> {
  data: T
  timestamp: string
  status: string
  error?: { message: string; error: string; statusCode: number }
  path?: string
  user?: {
    id: number
    role: string
    telegramId: string
  }
}

export interface ErrorResponse {
  error: boolean
  message?: string
  code: number
}

// export interface CommonData {
// 	add_select_options?: boolean
// }

// export interface CommonDataRes {
// 	select_options?: ISelectOption
// }
