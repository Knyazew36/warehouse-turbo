import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithOrganization } from '../types/request.types';

export const OrganizationId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithOrganization>();
  return request.organizationId;
});
