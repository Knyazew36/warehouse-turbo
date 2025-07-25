import { User } from '@telegram-apps/sdk-react'

export enum Role {
  IT = 'IT',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  GUEST = 'GUEST',
  BLOCKED = 'BLOCKED'
}
export interface IUser {
  id: number
  telegramId: string

  data: User
  createdAt: Date
  updatedAt: Date
  active: boolean
  role?: Role
}

export interface UpdateUserDto {
  data?: Partial<User>
}
