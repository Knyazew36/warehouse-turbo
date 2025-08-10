import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from 'src/organization/decorators/organization-id.decorator'

@ApiTags('Категории продуктов')
@Controller('categories')
@UseGuards(TelegramAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Создать новую категорию' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto, @OrganizationId() organizationId: number) {
    return this.categoriesService.create(createCategoryDto, organizationId)
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Получить список всех категорий' })
  @ApiQuery({ name: 'onlyActive', required: false, type: String })
  @ApiQuery({ name: 'isSelectOptions', required: false, type: String })
  findAll(
    @Query('onlyActive') onlyActive: string = 'true',
    @Query('isSelectOptions') isSelectOptions: string = 'false',
    @OrganizationId() organizationId: number
  ) {
    return this.categoriesService.findAll(
      onlyActive === 'true',
      organizationId,
      isSelectOptions === 'true'
    )
  }

  @Get('with-products')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Получить категории с продуктами' })
  @ApiQuery({ name: 'onlyActive', required: false, type: String })
  findAllWithProducts(
    @Query('onlyActive') onlyActive: string = 'true',
    @OrganizationId() organizationId: number
  ) {
    return this.categoriesService.findAllWithProducts(onlyActive === 'true', organizationId)
  }

  @Get('with-count')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Получить категории с количеством продуктов' })
  findAllWithProductCount(@OrganizationId() organizationId: number) {
    return this.categoriesService.findAllWithProductCount(organizationId)
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id)
  }

  @Post('update/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryDto })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto)
  }

  @Post('delete/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id)
  }
}
