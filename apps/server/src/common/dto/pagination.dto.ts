import { IsOptional, IsInt, Min, Max } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeTotal?: boolean = false
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total?: number
    totalPages?: number
    hasNext: boolean
    hasPrev: boolean
  }
}
