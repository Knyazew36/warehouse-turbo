import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CronService } from './cron.service'

@ApiTags('Продукты')
@UseGuards(TelegramAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cronService: CronService
  ) {}

  // @Get('cron')
  // @Roles('OWNER', 'ADMIN')
  // async cron() {
  //   return await this.cronService.checkLowStockAndNotify()
  // }

  @Post()
  @Roles('OWNER', 'ADMIN')
  //
  @ApiOperation({ summary: 'Создать новый продукт' })
  @ApiBody({ type: CreateProductDto })
  //
  async create(@Body() dto: CreateProductDto, @OrganizationId() organizationId?: number) {
    await this.productsService.create(dto, organizationId)
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех продуктов' })
  @ApiQuery({ name: 'onlyActive', required: false, type: String })
  findAll(@Query('onlyActive') onlyActive?: string, @OrganizationId() organizationId?: number) {
    const only = onlyActive === 'false' ? false : true
    return this.productsService.findAll(only, organizationId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id)
  }

  @Post('update/:id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Обновить продукт' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return await this.productsService.update(id, dto)
  }

  @Post('delete/:id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id)
  }
}
