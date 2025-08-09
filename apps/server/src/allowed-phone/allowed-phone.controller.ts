import { Controller, Post, Body, UseGuards, Delete, Param, Get, Req } from '@nestjs/common'
import { AllowedPhoneService } from './allowed-phone.service'

import { OrganizationId } from '../organization/decorators/organization-id.decorator'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { AddPhoneDto } from './dto/add-phone.dto'

@Controller('allowed-phones')
export class AllowedPhoneController {
  constructor(private readonly allowedPhoneService: AllowedPhoneService) {}
  /**
   * Добавить телефон в список разрешенных для организации
   */
  @Post('add')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async addPhoneToOrganization(
    @Body() dto: AddPhoneDto,
    @OrganizationId() organizationId?: number
  ) {
    if (!organizationId) {
      throw new Error('Organization ID is required for adding phone')
    }

    const result = await this.allowedPhoneService.addPhoneToOrganization(
      dto.phone,
      organizationId,
      dto.comment
    )

    return {
      ...result,
      message: 'message' in result ? result.message : 'Телефон успешно добавлен'
    }
  }

  /**
   * Получить список всех разрешенных номеров телефонов в организации
   */
  @Post('list')
  @UseGuards(TelegramAuthGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getAllPhonesForOrganization(@OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }
    return this.allowedPhoneService.getAllPhonesForOrganization(organizationId)
  }

  /**
   * Удалить телефон из списка разрешенных организации
   */
  @Post('delete/:id')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async removePhoneFromOrganization(
    @Param('id') id: number,
    @OrganizationId() organizationId?: number
  ) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const result = await this.allowedPhoneService.removePhoneFromOrganization(id, organizationId)

    return {
      ...result,
      message: 'Телефон успешно удален из списка разрешенных организации.'
    }
  }
}
