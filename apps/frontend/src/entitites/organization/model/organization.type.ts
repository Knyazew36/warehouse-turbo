export enum Role {
  IT = 'IT',
  OWNER = 'OWNER',
  GUEST = 'GUEST',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  BLOCKED = 'BLOCKED'
}

export interface IOrganization {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  active: boolean
  organizationId: number
}

export interface IUserOrganization {
  id: number
  userId: number
  organizationId: number
  role: Role
  isOwner: boolean
  createdAt: string
  updatedAt: string
  organization: IOrganization
  user?: {
    id: number
    telegramId: string
    data: any
    role: Role
    active: boolean
  }
}

export interface ICreateOrganization {
  name: string
  description?: string
}

export interface IUpdateOrganization {
  name?: string
  description?: string
}

export interface IAddUserToOrganization {
  userId: number
  role: Role
  isOwner?: boolean
}
