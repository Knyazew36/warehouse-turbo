import { Request } from 'express'
import { User, UserOrganization } from '@prisma/client'

export interface RequestWithUser extends Request {
  user?: User
}

export interface RequestWithOrganization extends RequestWithUser {
  organizationId?: number
  userOrganization?: UserOrganization
}

export interface OrganizationStats {
  id: number
  name: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  creator: {
    id: number
    telegramId: string
    data: any
  } | null
  productsCount: number
  employeesCount: number
}
