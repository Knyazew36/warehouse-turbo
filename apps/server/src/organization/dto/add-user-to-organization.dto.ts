import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class AddUserToOrganizationDto {
  @IsNumber()
  userId: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  isOwner?: boolean;
}
