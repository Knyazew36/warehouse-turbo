import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResult } from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate<T>({
    model,
    paginationDto,
    where,
    include,
    orderBy,
  }: {
    model: any;
    paginationDto: PaginationDto;
    where?: any;
    include?: any;
    orderBy?: any;
  }): Promise<PaginationResult<T>> {
    const { page = 1, limit = 30, includeTotal = false } = paginationDto;
    const skip = (page - 1) * limit;

    // Получаем данные
    const data = await model.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    });

    // Получаем общее количество, если запрошено
    let total: number | undefined;
    let totalPages: number | undefined;
    let hasNext = false;
    let hasPrev = false;

    if (includeTotal) {
      total = await model.count({ where });
      totalPages = Math.ceil(total / limit);
      hasNext = page < totalPages;
      hasPrev = page > 1;
    } else {
      // Проверяем, есть ли следующая страница
      const nextPageData = await model.findMany({
        where,
        skip: skip + limit,
        take: 1,
      });
      hasNext = nextPageData.length > 0;
      hasPrev = page > 1;
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }
}
