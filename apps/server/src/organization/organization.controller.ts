import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'
import { AddAllowedPhoneDto } from './dto/add-allowed-phone.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { User } from 'src/auth/decorators/get-user.decorator'
import { User as UserType } from '@prisma/client'

@UseGuards(TelegramAuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @User() user: UserType) {
    const organization = await this.organizationService.create(createOrganizationDto, user.id)
    return { data: organization }
  }

  // @Get()
  // @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  // async findAll() {
  //   const organizations = await this.organizationService.findAll()
  //   return { data: organizations }
  // }

  @Get('my')
  async getMyOrganizations(@User() user: UserType) {
    return await this.organizationService.getUserOrganizations(user.id)
  }

  @Get('available')
  async getAvailableOrganizations(@User() user: UserType) {
    return await this.organizationService.getAvailableOrganizations(user.id)
  }

  @Post(':id/join')
  async joinOrganization(@Param('id', ParseIntPipe) id: number, @User() user: UserType) {
    const userOrg = await this.organizationService.joinOrganization(id, user.id)
    return { data: userOrg }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const organization = await this.organizationService.findOne(id)
    return { data: organization }
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationService.update(id, updateOrganizationDto)
    return { data: organization }
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const organization = await this.organizationService.remove(id)
    return { data: organization }
  }

  @Post(':id/users')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async addUserToOrganization(@Param('id', ParseIntPipe) id: number, @Body() addUserDto: AddUserToOrganizationDto) {
    const userOrg = await this.organizationService.addUserToOrganization(id, addUserDto)
    return { data: userOrg }
  }

  @Delete(':id/users/:userId')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async removeUserFromOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number
  ) {
    await this.organizationService.removeUserFromOrganization(id, userId)
    return { success: true }
  }

  @Get(':id/users')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async getOrganizationUsers(@Param('id', ParseIntPipe) id: number) {
    const users = await this.organizationService.getOrganizationUsers(id)
    return { data: users }
  }

  @Patch(':id/users/:userId/role')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { role: Role; isOwner?: boolean }
  ) {
    const userOrg = await this.organizationService.updateUserRole(id, userId, body.role, body.isOwner)
    return { data: userOrg }
  }

  // Новые эндпоинты для работы с разрешенными телефонами

  @Get(':id/allowed-phones')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async getAllowedPhones(@Param('id', ParseIntPipe) id: number) {
    const phones = await this.organizationService.getAllowedPhones(id)
    return { data: phones }
  }

  @Post(':id/allowed-phones')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async addAllowedPhone(@Param('id', ParseIntPipe) id: number, @Body() addAllowedPhoneDto: AddAllowedPhoneDto) {
    const organization = await this.organizationService.addAllowedPhone(id, addAllowedPhoneDto.phone)
    return { data: organization }
  }

  @Delete(':id/allowed-phones')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async removeAllowedPhone(@Param('id', ParseIntPipe) id: number, @Body() addAllowedPhoneDto: AddAllowedPhoneDto) {
    const organization = await this.organizationService.removeAllowedPhone(id, addAllowedPhoneDto.phone)
    return { data: organization }
  }

  @Get(':id/can-join/:userId')
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async canUserJoinOrganization(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
    const canJoin = await this.organizationService.canUserJoinOrganization(id, userId)
    return { data: { canJoin } }
  }
}
