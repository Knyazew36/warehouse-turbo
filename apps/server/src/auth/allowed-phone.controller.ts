import { Controller, Post, Body, UseGuards, Delete, Param } from '@nestjs/common'
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
   * Добавить сотрудника в организацию (привязывает существующий телефон к организации)
   */
  @Post('add')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async addEmployeeToOrganization(@Body() dto: AddPhoneDto, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required for adding employee')
    }

    const result = await this.allowedPhoneService.addEmployeeToOrganization(dto.phone, organizationId, dto.comment)

    return {
      ...result,
      message: 'Сотрудник успешно добавлен в организацию.',
      wasExisting: result.allowedPhones.includes(dto.phone)
    }
  }

  /**
   * Получить список всех разрешенных номеров телефонов в организации
   */
  @Post('list')
  @UseGuards(TelegramAuthGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getAllPhones(@OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }
    return this.allowedPhoneService.getAll(organizationId)
  }

  /**
   * Удалить телефон из списка разрешенных
   */
  @Delete(':phone')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async removePhone(@Param('phone') phone: string, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const result = await this.allowedPhoneService.removePhone(phone, organizationId)

    return {
      ...result,
      message: 'Телефон успешно удален из списка разрешенных.'
    }
  }

  /**
   * Проверить, разрешен ли телефон в организации
   */
  @Post('check')
  @UseGuards(TelegramAuthGuard)
  async checkPhone(@Body() dto: { phone: string }, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const isAllowed = await this.allowedPhoneService.isPhoneAllowed(dto.phone, organizationId)

    return {
      phone: dto.phone,
      isAllowed,
      message: isAllowed ? 'Телефон разрешен в организации' : 'Телефон не разрешен в организации'
    }
  }
}
