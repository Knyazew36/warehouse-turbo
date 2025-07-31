import { IsOptional, IsString } from 'class-validator';

export class GetStatisticsDto {
  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;
}
