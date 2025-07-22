import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AllowedPhoneService } from './allowed-phone.service'
import { AddPhoneDto } from './dto/add-phone.dto'
import { Roles } from './decorators/roles.decorator'
import { RolesGuard } from './guards/roles.guard'
import { TelegramAuthGuard } from './guards/telegram-auth.guard'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'

@Controller('allowed-phones')
export class AllowedPhoneController {
  constructor(private readonly allowedPhoneService: AllowedPhoneService) {}

  /**
   * Добавить разрешенный номер телефона (только для админа)
   */
  @Post('add')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async addPhone(@Body() dto: AddPhoneDto, @OrganizationId() organizationId?: number) {
    const existingPhone = await this.allowedPhoneService.isPhoneAllowed(dto.phone)

    if (existingPhone) {
      // Если телефон уже существует, обновляем комментарий если он передан
      if (dto.comment) {
        if (!organizationId) {
          throw new Error('Organization ID is required')
        }
        const updatedPhone = await this.allowedPhoneService.addPhone(dto.phone, organizationId, dto.comment)
        return {
          ...updatedPhone,
          message: 'Телефон уже был в списке разрешенных. Комментарий обновлен.',
          wasExisting: true
        }
      }

      return {
        ...existingPhone,
        message: 'Телефон уже находится в списке разрешенных.',
        wasExisting: true
      }
    }

    // Если телефона нет, добавляем новый
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }
    const newPhone = await this.allowedPhoneService.addPhone(dto.phone, organizationId, dto.comment)
    return {
      ...newPhone,
      message: 'Телефон успешно добавлен в список разрешенных.',
      wasExisting: false
    }
  }

  /**
   * Получить список всех разрешенных номеров телефонов
   */
  @Post('list')
  @UseGuards(TelegramAuthGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getAllPhones(@OrganizationId() organizationId?: number) {
    return this.allowedPhoneService.getAll(organizationId)
  }

  /**
   * Проверить, разрешен ли номер телефона
   */
  @Post('check')
  async checkPhone(@Body('phone') phone: string) {
    const allowedPhone = await this.allowedPhoneService.isPhoneAllowed(phone)
    return {
      phone,
      isAllowed: !!allowedPhone,
      isUsed: !!allowedPhone?.usedById,
      comment: allowedPhone?.comment
    }
  }
}
