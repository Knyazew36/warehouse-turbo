import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common'
import { GetUsersDto } from './dto/get-users.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { OrganizationRolesGuard } from '../organization/guards/organization-roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { UserService } from './user.service'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get()
  @Roles('ADMIN', 'OWNER', 'IT')
  findAll(@Query() query: GetUsersDto, @OrganizationId() organizationId?: number) {
    return this.usersService.findAll(query, organizationId)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get('employees')
  @Roles('ADMIN', 'OWNER', 'OPERATOR')
  getEmployees(@OrganizationId() organizationId?: number) {
    return this.usersService.getEmployees(organizationId)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get('role/:role')
  @Roles('ADMIN', 'OWNER', 'IT')
  getUsersByRole(@Param('role') role: Role, @OrganizationId() organizationId?: number) {
    return this.usersService.getUsersByRole(role, organizationId)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get(':telegramId/role')
  getUserRole(@Param('telegramId') telegramId: string, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new BadRequestException('organizationId is required')
    }
    return this.usersService.getUserRole(telegramId, organizationId)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get(':id')
  @Roles('ADMIN', 'OWNER', 'IT')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Post('/update/:id')
  @Roles('ADMIN', 'OWNER', 'IT')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Post('/remove/:id')
  @Roles('ADMIN', 'OWNER', 'IT')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }

  @UseGuards(TelegramAuthGuard, RolesGuard)
  @Post('/hard-remove/:id')
  @Roles('OWNER', 'IT')
  hardRemove(@Param('id') id: string) {
    return this.usersService.hardRemove(+id)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Post('/restore/:id')
  @Roles('ADMIN', 'OWNER', 'IT')
  restore(@Param('id') id: string) {
    return this.usersService.restore(+id)
  }

  @UseGuards(TelegramAuthGuard, OrganizationRolesGuard)
  @Get('deleted/list')
  @Roles('ADMIN', 'OWNER', 'IT')
  getDeletedUsers(@OrganizationId() organizationId?: number) {
    return this.usersService.getDeletedUsers(organizationId)
  }
}
