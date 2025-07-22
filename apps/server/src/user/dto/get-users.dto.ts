import { IsOptional, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

export class GetUsersDto {
  @IsOptional()
  onlyEmployees?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDeleted?: boolean
}
