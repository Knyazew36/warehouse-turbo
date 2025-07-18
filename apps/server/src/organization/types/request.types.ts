import { Request } from 'express';
import { User, UserOrganization } from '@prisma/client';

export interface RequestWithUser extends Request {
  user?: User;
}

export interface RequestWithOrganization extends RequestWithUser {
  organizationId?: number;
  userOrganization?: UserOrganization;
}
