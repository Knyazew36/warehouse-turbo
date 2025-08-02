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
  Request
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from 'src/organization/decorators/organization-id.decorator'

@Controller('categories')
@UseGuards(TelegramAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto, @OrganizationId() organizationId: number) {
    return this.categoriesService.create(createCategoryDto, organizationId)
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR, Role.GUEST)
  findAll(
    @Query('onlyActive') onlyActive: string = 'true',
    @OrganizationId() organizationId: number
  ) {
    return this.categoriesService.findAll(onlyActive === 'true', organizationId)
  }

  @Get('with-products')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR, Role.GUEST)
  findAllWithProducts(
    @Query('onlyActive') onlyActive: string = 'true',
    @OrganizationId() organizationId: number
  ) {
    return this.categoriesService.findAllWithProducts(onlyActive === 'true', organizationId)
  }

  @Get('with-count')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR, Role.GUEST)
  findAllWithProductCount(@OrganizationId() organizationId: number) {
    return this.categoriesService.findAllWithProductCount(organizationId)
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR, Role.GUEST)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id)
  }

  @Post('update/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto)
  }

  @Post('delete/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id)
  }
}
