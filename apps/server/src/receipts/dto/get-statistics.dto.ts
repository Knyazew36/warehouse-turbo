import { IsOptional, IsString } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class GetStatisticsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  start?: string

  @IsOptional()
  @IsString()
  end?: string
}
