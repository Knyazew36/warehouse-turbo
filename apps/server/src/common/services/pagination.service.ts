import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { PaginationDto, PaginationResult } from '../dto/pagination.dto'

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate<T>({
    model,
    paginationDto,
    where,
    include,
    orderBy
  }: {
    model: any
    paginationDto: PaginationDto
    where?: any
    include?: any
    orderBy?: any
  }): Promise<PaginationResult<T>> {
    const { page, limit } = paginationDto
    const skip = (page - 1) * limit

    // Получаем данные
    const data = await model.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit
    })

    // Получаем общее количество
    const total = await model.count({ where })
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    }
  }
}
