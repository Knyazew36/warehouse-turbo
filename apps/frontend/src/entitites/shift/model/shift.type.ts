import { IUser } from '@/entitites/user/model/user.type'

export interface ShiftReport {
  id: number
  userId: number
  consumptions: Consumption[]
  createdAt: string
  updatedAt: string
  User: IUser
}

export interface Consumption {
  productId: number
  consumed: number
}
