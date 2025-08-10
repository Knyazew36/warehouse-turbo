import { Role } from '@prisma/client'

export interface OrganizationSettings {
  notifications: {
    notificationTime: string
    notificationRoles: Role[]
    enabled: boolean // возможность отключения
    daysOfWeek: number[] // дни недели (0-6, где 0 - воскресенье)
  }
}
