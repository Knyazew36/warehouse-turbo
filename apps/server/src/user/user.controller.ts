import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common'
import { GetUsersDto } from './dto/get-users.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { UserService } from './user.service'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'

@UseGuards(TelegramAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles('ADMIN', 'OWNER', 'IT')
  findAll(@Query() query: GetUsersDto, @OrganizationId() organizationId?: number) {
    return this.usersService.findAll(query, organizationId)
  }

  @Get('employees')
  @Roles('ADMIN', 'OWNER')
  getEmployees(@OrganizationId() organizationId?: number) {
    return this.usersService.getEmployees(organizationId)
  }

  @Get('role/:role')
  @Roles('ADMIN', 'OWNER', 'IT')
  getUsersByRole(@Param('role') role: Role, @OrganizationId() organizationId?: number) {
    return this.usersService.getUsersByRole(role, organizationId)
  }

  @Get(':telegramId/role')
  getUserRole(@Param('telegramId') telegramId: string, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new BadRequestException('organizationId is required')
    }
    return this.usersService.getUserRole(telegramId, organizationId)
  }

  @Get(':id')
  @Roles('ADMIN', 'OWNER', 'IT')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Post('/update/:id')
  @Roles('ADMIN', 'OWNER', 'IT')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Post('/remove/:id')
  @Roles('ADMIN', 'OWNER', 'IT')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
