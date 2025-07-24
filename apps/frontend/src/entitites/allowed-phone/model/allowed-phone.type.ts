import { IUser } from '@/entitites/user/model/user.type'

export interface AllowedPhone {
  id: number
  phone: string
  comment?: string
  createdAt: string
  updatedAt: string
  addedToOrganizationAt?: string // когда телефон был добавлен в конкретную организацию
}

export interface AllowedPhoneOrganization {
  id: number
  allowedPhoneId: number
  organizationId: number
  createdAt: string
  allowedPhone: AllowedPhone
  organization: {
    id: number
    name: string
    description?: string
  }
}

export interface OrganizationForPhone {
  id: number
  name: string
  description?: string
  addedAt: string
}
