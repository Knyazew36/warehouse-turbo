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
   * Может быть добавлен с организацией или без (для глобальных пользователей)
   */
  @Post('add')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async addPhone(@Body() dto: AddPhoneDto, @OrganizationId() organizationId?: number) {
    const existingPhone = await this.allowedPhoneService.isPhoneAllowed(dto.phone)

    if (existingPhone) {
      // Если телефон уже существует, обновляем комментарий если он передан
      if (dto.comment) {
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

    // Если телефона нет, добавляем новый (может быть с организацией или без)
    const newPhone = await this.allowedPhoneService.addPhone(dto.phone, organizationId, dto.comment)
    return {
      ...newPhone,
      message: organizationId
        ? 'Телефон успешно добавлен в список разрешенных для организации.'
        : 'Телефон успешно добавлен в глобальный список разрешенных.',
      wasExisting: false
    }
  }

  /**
   * Добавить сотрудника в организацию (привязывает существующий телефон к организации)
   */
  @Post('add-employee')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async addEmployeeToOrganization(@Body() dto: AddPhoneDto, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required for adding employee')
    }

    const result = await this.allowedPhoneService.addEmployeeToOrganization(dto.phone, organizationId, dto.comment)

    return {
      ...result,
      message:
        result.organizationId === organizationId
          ? 'Сотрудник успешно добавлен в организацию.'
          : 'Телефон привязан к организации.',
      wasExisting: !!result.organizationId
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
      hasOrganization: !!allowedPhone?.organizationId,
      comment: allowedPhone?.comment
    }
  }
}
