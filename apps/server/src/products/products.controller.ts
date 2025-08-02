import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'

@UseGuards(TelegramAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  async create(@Body() dto: CreateProductDto, @OrganizationId() organizationId?: number) {
    await this.productsService.create(dto, organizationId)
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive?: string, @OrganizationId() organizationId?: number) {
    const only = onlyActive === 'false' ? false : true
    return this.productsService.findAll(only, organizationId)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id)
  }

  @Post('update/:id')
  @Roles('OWNER', 'ADMIN')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return await this.productsService.update(id, dto)
  }

  @Post('delete/:id')
  @Roles('OWNER', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id)
  }
}
