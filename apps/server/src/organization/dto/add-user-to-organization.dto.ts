import { IsNumber, IsEnum, IsOptional, IsString, Matches } from 'class-validator'
import { Role } from '@prisma/client'

export class AddUserToOrganizationDto {
  @IsOptional()
  @IsNumber()
  userId?: number

  @IsOptional()
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must be in format +7XXXXXXXXXX' })
  phone?: string

  @IsEnum(Role)
  @IsOptional()
  role: Role

  // @IsOptional()
  // isOwner?: boolean
}
