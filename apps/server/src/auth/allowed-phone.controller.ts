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
  async addPhoneToOrganization(@Body() dto: AddPhoneDto, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required for adding phone')
    }

    const result = await this.allowedPhoneService.addPhoneToOrganization(dto.phone, organizationId, dto.comment)

    return {
      ...result,
      message: 'Телефон успешно добавлен в список разрешенных для организации.'
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
  @Delete(':phone')
  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'IT')
  async removePhoneFromOrganization(@Param('phone') phone: string, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const result = await this.allowedPhoneService.removePhoneFromOrganization(phone, organizationId)

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
  async checkPhoneInOrganization(@Body() dto: { phone: string }, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }

    const isAllowed = await this.allowedPhoneService.isPhoneAllowedInOrganization(dto.phone, organizationId)

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
   * Получить все организации, к которым у пользователя есть доступ
   */
  @Get('user/organizations')
  @UseGuards(TelegramAuthGuard)
  async getUserAccessibleOrganizations(@Req() req: any) {
    const userPhone = req.user?.phone
    if (!userPhone) {
      throw new Error('User phone not found')
    }

    const organizations = await this.allowedPhoneService.getUserAccessibleOrganizations(userPhone)

    return {
      userPhone,
      organizations
    }
  }

  /**
   * Проверить, есть ли у пользователя доступ к конкретной организации
   */
  @Post('user/check-access')
  @UseGuards(TelegramAuthGuard)
  async checkUserAccessToOrganization(@Body() dto: { organizationId: number }, @Req() req: any) {
    const userPhone = req.user?.phone
    if (!userPhone) {
      throw new Error('User phone not found')
    }

    const hasAccess = await this.allowedPhoneService.hasUserAccessToOrganization(userPhone, dto.organizationId)
    const userRole = await this.allowedPhoneService.getUserRoleInOrganization(userPhone, dto.organizationId)

    return {
      userPhone,
      organizationId: dto.organizationId,
      hasAccess,
      userRole
    }
  }
}
