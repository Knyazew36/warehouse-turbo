import { Product } from '@/entitites/product/model/product.type'
import { IUser } from '@/entitites/user/model/user.type'

export interface CreateReceiptDto {
  productId: number
  quantity: number
}

export interface Receipt {
  id: number
  createdAt: Date
  productId: number
  quantity: number
  operator: IUser | null
  operatorId: number | null
  operatorName?: string
  operatorTelegramId?: string
}

export interface StatisticsProduct {
  product: Product | null
  quantity: number
  comment?: string
}

export interface StatisticsOperation {
  type: 'income' | 'outcome'
  date: string // ISO string
  user: IUser | null
  products: StatisticsProduct[]
}

export interface StatisticsResponse {
  periodStart: string // ISO string
  periodEnd: string // ISO string
  data: StatisticsOperation[]
}
