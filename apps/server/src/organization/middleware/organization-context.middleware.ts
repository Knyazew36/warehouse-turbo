import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { RequestWithOrganization } from '../types/request.types';

@Injectable()
export class OrganizationContextMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: RequestWithOrganization, res: Response, next: NextFunction) {
    const organizationId = req.headers['x-organization-id'] as string;

    if (organizationId && req.user) {
      // Проверяем, принадлежит ли пользователь к организации
      const userOrganization = await this.prisma.userOrganization.findUnique({
        where: {
          userId_organizationId: {
            userId: req.user.id,
            organizationId: parseInt(organizationId),
          },
        },
      });

      if (userOrganization) {
        req.organizationId = parseInt(organizationId);
        req.userOrganization = userOrganization;
      }
    }

    next();
  }
}
