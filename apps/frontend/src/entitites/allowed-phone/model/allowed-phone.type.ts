import { IUser } from '@/entitites/user/model/user.type'

export interface AllowedPhone {
  id: number
  phone: string
  comment: string
  createdAt: string
  updatedAt: string
  usedBy?: IUser
  usedById: number
}
