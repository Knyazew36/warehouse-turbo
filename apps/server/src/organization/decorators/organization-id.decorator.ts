import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { RequestWithOrganization } from '../types/request.types';

export const OrganizationId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithOrganization>();

  console.log('🔍 OrganizationId decorator:', {
    organizationIdFromContext: request.organizationId,
    organizationIdFromHeader: request.headers['x-organization-id'],
    path: request.path,
  });

  // Сначала проверяем, был ли organizationId установлен middleware
  if (request.organizationId) {
    console.log('✅ Using organizationId from context:', request.organizationId);
    return request.organizationId;
  }

  // Если нет, берем из заголовка
  const organizationId = request.headers['x-organization-id'];

  if (!organizationId) {
    console.log('❌ No organizationId found');
    throw new BadRequestException('Organization ID header is required');
  }

  console.log('✅ Using organizationId from header:', organizationId);
  return Number(organizationId);
});
