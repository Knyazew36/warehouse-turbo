// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '@prisma/client';
// import { ROLES_KEY } from '../../auth/decorators/roles.decorator';
// import { PrismaService } from 'nestjs-prisma';

// @Injectable()
// export class OrganizationRolesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private readonly prisma: PrismaService,
//   ) {}

//   async canActivate(ctx: ExecutionContext): Promise<boolean> {
//     const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       ctx.getHandler(),
//       ctx.getClass(),
//     ]);

//     if (!required || required.length === 0) {
//       return true; // нет ограничения — пропускаем
//     }

//     const req = ctx.switchToHttp().getRequest();
//     const user = req.user; // заполняется TelegramAuthGuard

//     if (!user) {
//       throw new ForbiddenException('Пользователь не авторизован');
//     }

//     // Получаем organizationId из заголовка
//     const organizationId = req.headers['x-organization-id'];

//     if (!organizationId) {
//       throw new ForbiddenException('Organization ID header is required');
//     }

//     // Проверяем роль пользователя в конкретной организации
//     const userOrganization = await this.prisma.userOrganization.findUnique({
//       where: {
//         userId_organizationId: {
//           userId: user.id,
//           organizationId: parseInt(organizationId),
//         },
//       },
//     });

//     if (!userOrganization) {
//       throw new ForbiddenException('У вас нет доступа к этой организации');
//     }

//     // Проверяем, есть ли у пользователя необходимая роль в организации
//     if (!required.includes(userOrganization.role)) {
//       throw new ForbiddenException('Недостаточно прав в этой организации');
//     }

//     // Добавляем информацию о роли пользователя в организации в request
//     req.userOrganization = userOrganization;

//     return true;
//   }
// }
