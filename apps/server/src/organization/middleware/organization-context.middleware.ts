// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Response, NextFunction } from 'express';
// import { PrismaService } from 'nestjs-prisma';
// import { RequestWithOrganization } from '../types/request.types';

// @Injectable()
// export class OrganizationContextMiddleware implements NestMiddleware {
//   constructor(private readonly prisma: PrismaService) {}

//   async use(req: RequestWithOrganization, res: Response, next: NextFunction) {
//     const organizationId = req.headers['x-organization-id'] as string;

//     console.log('🔍 OrganizationContextMiddleware:', {
//       organizationId,
//       userId: req.user?.id,
//       path: req.path,
//     });

//     if (organizationId && req.user) {
//       // Проверяем, принадлежит ли пользователь к организации
//       const userOrganization = await this.prisma.userOrganization.findUnique({
//         where: {
//           userId_organizationId: {
//             userId: req.user.id,
//             organizationId: parseInt(organizationId),
//           },
//         },
//       });

//       console.log('🔍 UserOrganization found:', userOrganization);

//       if (userOrganization) {
//         req.organizationId = parseInt(organizationId);
//         req.userOrganization = userOrganization;
//         console.log('✅ Organization context set:', req.organizationId);
//       } else {
//         console.log('❌ User does not belong to organization');
//       }
//     } else {
//       console.log('❌ Missing organizationId or user');
//     }

//     next();
//   }
// }
