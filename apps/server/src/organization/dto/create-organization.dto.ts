import { IsString, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  allowedPhones?: string[]; // Оставляем для обратной совместимости, но обрабатываем по-новому
}
