import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsString()
  notificationTime?: string; // формат "HH:mm"

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  notificationRoles?: Role[]; // роли для уведомлений
}
