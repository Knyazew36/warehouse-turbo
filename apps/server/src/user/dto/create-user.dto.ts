import { IsString, Matches } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must be in format +7XXXXXXXXXX' })
  phone: string
}
