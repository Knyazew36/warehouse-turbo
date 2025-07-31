import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
  Min,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ConsumptionDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  consumed: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateShiftReportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsumptionDto)
  consumptions: ConsumptionDto[];
}
