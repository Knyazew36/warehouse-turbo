import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.organizationId || request.body.organizationId;

    if (!organizationId) {
      return true; // Если organizationId не указан, пропускаем проверку
    }

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован');
    }

    // Проверяем, принадлежит ли пользователь к организации
    const userOrganization = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: parseInt(organizationId),
        },
      },
    });

    if (!userOrganization) {
      throw new ForbiddenException('У вас нет доступа к этой организации');
    }

    // Добавляем информацию о роли пользователя в организации в request
    request.userOrganization = userOrganization;

    return true;
  }
}
