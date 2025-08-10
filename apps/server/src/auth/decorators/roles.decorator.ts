import { SetMetadata } from '@nestjs/common'
import { Role } from '@prisma/client'

export const ROLES_BLOCKED_KEY = 'blockedRoles'
export const RolesBlocked = (...roles: Role[]) => SetMetadata(ROLES_BLOCKED_KEY, roles)

// Для обратной совместимости оставляем старый декоратор
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
