import { IsOptional, IsString, IsArray, IsEnum, IsBoolean, IsNumber } from 'class-validator'
import { Role } from '@prisma/client'

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsString()
  notificationTime?: string // формат "HH:mm"

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  notificationRoles?: Role[] // роли для уведомлений

  @IsOptional()
  @IsBoolean()
  enabled?: boolean // возможность отключения

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  daysOfWeek?: number[] // дни недели (0-6, где 0 - воскресенье)
}
