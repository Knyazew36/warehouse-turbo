import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common'
import { RequestWithOrganization } from '../types/request.types'

export const OrganizationId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithOrganization>()
  const organizationId = request.headers['x-organization-id']

  if (!organizationId) {
    throw new BadRequestException('Organization ID header is required')
  }

  return Number(organizationId)
})
