import { IsString, IsOptional, Length, Matches, IsNumber } from 'class-validator'

export class AddPhoneDto {
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must be in format +7XXXXXXXXXX' })
  phone: string

  @IsOptional()
  @IsString()
  @Length(0, 256)
  comment?: string
}

export class BindPhoneToUserDto {
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must be in format +7XXXXXXXXXX' })
  phone: string

  @IsNumber()
  userId: number
}

export class UnbindPhoneFromUserDto {
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must be in format +7XXXXXXXXXX' })
  phone: string
}
