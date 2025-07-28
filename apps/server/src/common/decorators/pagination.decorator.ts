import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PaginationDto } from '../dto/pagination.dto'

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    return {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 30,
      includeTotal: query.includeTotal === 'true' || query.includeTotal === true
    }
  }
)
