import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger'
import { OrganizationService } from './organization.service'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { User } from 'src/auth/decorators/get-user.decorator'
import { User as UserType } from '@prisma/client'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { UpdateNotificationSettingsDto } from '../products/dto/update-notification-settings.dto'

@ApiTags('Организации')
@UseGuards(TelegramAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('stats')
  @Roles(Role.IT)
  async getStats() {
    return await this.organizationService.getStats()
  }

  @Post()
  @ApiOperation({ summary: 'Создать организацию' })
  @ApiBody({ type: CreateOrganizationDto })
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @User() user: UserType) {
    return await this.organizationService.create(createOrganizationDto, user.id)
  }

  @Get('available')
  @ApiOperation({ summary: 'Получить доступные организации для пользователя' })
  async getAvailableOrganizations(@User() user: UserType) {
    return await this.organizationService.getAvailableOrganizations(user.id)
  }

  @Post(':id/join')
  @ApiOperation({
    summary: 'Присоединиться к организации (когда тебя добавили по телефону и пришло приглашение)'
  })
  @ApiParam({ name: 'id', type: Number })
  async joinOrganization(@Param('id', ParseIntPipe) id: number, @User() user: UserType) {
    return await this.organizationService.joinOrganization(id, user.id)
  }

  @Get(':id')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Получить организацию по ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.organizationService.findOne(id)
  }

  @Post(':id/update')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Обновить организацию' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrganizationDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return await this.organizationService.update(id, updateOrganizationDto)
  }

  @Post('delete/:id')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Удалить организацию' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.organizationService.remove(id)
  }

  @Post(':id/users')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Добавить пользователя в организацию' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AddUserToOrganizationDto })
  async addUserToOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() addUserDto: AddUserToOrganizationDto
  ) {
    return await this.organizationService.addUserToOrganization(id, addUserDto)
  }

  @Post(':id/users/:userId/remove')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Удалить пользователя из организации' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async removeUserFromOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number
  ) {
    return await this.organizationService.removeUserFromOrganization(id, userId)
  }

  @Post(':id/users/:userId/role')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Обновить роль пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { role: { type: 'string' }, isOwner: { type: 'boolean' } }
    }
  })
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { role: Role; isOwner?: boolean }
  ) {
    const userOrg = await this.organizationService.updateUserRole(
      id,
      userId,
      body.role,
      body.isOwner
    )
    return { data: userOrg }
  }

  @Post(':id/notification-settings')
  @Roles(Role.IT, Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Обновить настройки уведомлений организации' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateNotificationSettingsDto })
  async updateNotificationSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationSettingsDto: UpdateNotificationSettingsDto
  ) {
    return await this.organizationService.updateNotificationSettings(
      id,
      updateNotificationSettingsDto
    )
  }
}
