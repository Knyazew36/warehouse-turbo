import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'
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

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.IT)
  async findAll() {
    const organizations = await this.organizationService.findAll()
    return { data: organizations }
  }

  @Get('my')
  async getMyOrganizations(@User() user: UserType) {
    return await this.organizationService.getUserOrganizations(user.id)
  }

  @Get('available')
  async getAvailableOrganizations(@User() user: UserType) {
    const result = await this.organizationService.getAvailableOrganizations(user.id)
    return { data: result }
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
}
