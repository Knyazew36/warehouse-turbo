import { Controller, Post, Body, UseGuards, Delete, Param, Get, Req } from '@nestjs/common'
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

  /**
   * Проверить, разрешен ли телефон в организации
   */
  @Post('check')
  @UseGuards(TelegramAuthGuard)
  async checkPhoneInOrganization(
    @Body() dto: { phone: string },
    @OrganizationId() organizationId?: number
  ) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const isAllowed = await this.allowedPhoneService.isPhoneAllowedInOrganization(
      dto.phone,
      organizationId
    )

    return {
      phone: dto.phone,
      isAllowed,
      organizationId
    }
  }

  /**
   * Получить все организации, где разрешен телефон
   */
  @Get('organizations/:phone')
  @UseGuards(TelegramAuthGuard)
  async getOrganizationsForPhone(@Param('phone') phone: string) {
    const organizations = await this.allowedPhoneService.getOrganizationsForPhone(phone)

    return {
      phone,
      organizations
    }
  }

  /**
   * Получить все разрешенные телефоны (глобально)
   */
  @Get('all')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getAllAllowedPhones() {
    return this.allowedPhoneService.getAllAllowedPhones()
  }

  /**
   * Получить пользователя по разрешенному телефону
   */
  @Get('user/:phone')
  @UseGuards(TelegramAuthGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getUserByAllowedPhone(@Param('phone') phone: string) {
    const user = await this.allowedPhoneService.getUserByAllowedPhone(phone)

    return {
      phone,
      user
    }
  }

  /**
   * Получить разрешенный телефон пользователя
   */
  @Get('user/:userId/phone')
  @UseGuards(TelegramAuthGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async getAllowedPhoneByUser(@Param('userId') userId: string) {
    const allowedPhone = await this.allowedPhoneService.getAllowedPhoneByUser(parseInt(userId))

    return {
      userId: parseInt(userId),
      allowedPhone
    }
  }
}
