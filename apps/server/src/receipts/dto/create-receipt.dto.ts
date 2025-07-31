import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsPositive, Min } from 'class-validator';

export class Receipt {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  quantity: number;
}

export class CreateReceiptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Receipt)
  receipts: Receipt[];
}
