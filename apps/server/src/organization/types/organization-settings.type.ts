import { Role } from '@prisma/client';

export interface OrganizationSettings {
  notifications: {
    notificationTime: string;
    notificationRoles: Role[];
  };
}
