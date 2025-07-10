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

  role: Role
  data: User
  createdAt: Date
  updatedAt: Date
  active: boolean
}

export interface UpdateUserDto {
  role?: Role
  data?: Partial<User>
}
