import { IsString, IsOptional, IsBoolean, Matches, IsNotEmpty } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Название категории обязательно' })
  name: string

  @IsOptional()
  @IsString()
  description?: string

  // @IsOptional()
  // @IsString()
  // @Matches(/^#[0-9A-F]{6}$/i, { message: 'Color must be a valid hex color (e.g., #FF0000)' })
  // color?: string

  // @IsOptional()
  // @IsString()
  // icon?: string

  @IsOptional()
  @IsBoolean()
  active?: boolean
}
