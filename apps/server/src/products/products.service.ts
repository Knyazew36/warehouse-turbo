import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'nestjs-prisma'
import { Product } from '@prisma/client'
import { BotService } from '../bot/bot.service'
import { NotificationService } from '../bot/notification.service'
import { UserService } from '../user/user.service'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly botService: BotService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {
    console.log('🟢 ProductsService создан', new Date().toISOString())
  }

  async create(dto: CreateProductDto, organizationId: number) {
    // Проверяем существование организации
    const organization = await this.prisma.organization.findUnique({
      where: { id: Number(organizationId) }
    })

    if (!organization) {
      throw new NotFoundException(`Organization #${organizationId} not found`)
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        organizationId: Number(organizationId)
      }
    })
  }

  async findAll(onlyActive = true, organizationId?: number): Promise<Product[]> {
    const whereClause: any = {}

    if (onlyActive) {
      whereClause.active = true
    }

    if (organizationId !== undefined && organizationId !== null) {
      whereClause.organizationId = Number(organizationId)
    }

    return this.prisma.product.findMany({
      where: whereClause,
      orderBy: { name: 'desc' }
    })
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException(`Product #${id} not found`)
    return product
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id)
    return this.prisma.product.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.product.delete({ where: { id } })
  }

  /**
   * Получить товары с низким остатком для организации
   */
  async getLowStockProducts(organizationId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
        active: true
      }
    })

    return products.filter(product => product.quantity < product.minThreshold)
  }

  /**
   * Проверить остатки на складе для конкретной организации
   */
  async checkLowStockForOrganization(organizationId: number) {
    const lowStockProducts = await this.getLowStockProducts(organizationId)

    if (lowStockProducts.length === 0) {
      return { hasLowStock: false, products: [] }
    }

    return {
      hasLowStock: true,
      products: lowStockProducts
    }
  }
}
