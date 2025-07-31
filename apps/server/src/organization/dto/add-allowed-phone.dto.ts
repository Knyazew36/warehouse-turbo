import { IsString, IsNotEmpty } from 'class-validator';

export class AddAllowedPhoneDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
