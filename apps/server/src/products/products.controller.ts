import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard';
import { OrganizationId } from '../organization/decorators/organization-id.decorator';

@UseGuards(TelegramAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }
    await this.productsService.create(dto, organizationId);
    return true;
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive?: string, @OrganizationId() organizationId?: number) {
    const only = onlyActive === 'false' ? false : true;
    return this.productsService.findAll(only, organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Post('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
