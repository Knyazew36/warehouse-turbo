import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'nestjs-prisma'
import { Product } from '@prisma/client'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, organizationId: number) {
    console.log(dto)

    // Проверяем существование организации
    const organization = await this.prisma.organization.findUnique({
      where: { id: Number(organizationId) }
    })

    if (!organization) {
      throw new NotFoundException(`Organization #${organizationId} not found`)
    }

    // Проверяем уникальность названия продукта в рамках организации
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
        organizationId: Number(organizationId)
      }
    })

    if (existingProduct) {
      throw new NotFoundException(`Product already exists in this organization`)
    }

    // Если указана категория, проверяем её существование
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId }
      })

      if (!category) {
        throw new NotFoundException(`Category #${dto.categoryId} not found`)
      }
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        organizationId: Number(organizationId)
      },
      include: {
        productCategory: true
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
      orderBy: { name: 'asc' },
      include: {
        productCategory: true
      }
    })
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productCategory: true
      }
    })
    if (!product) throw new NotFoundException(`Product #${id} not found`)
    return product
  }

  async update(id: number, dto: UpdateProductDto) {
    const existingProduct = await this.findOne(id)

    // Если указана категория, проверяем её существование
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId }
      })

      if (!category) {
        throw new NotFoundException(`Category #${dto.categoryId} not found`)
      }
    }

    // Если изменяется название, проверяем уникальность в рамках организации
    if (dto.name && dto.name !== existingProduct.name) {
      const productWithSameName = await this.prisma.product.findFirst({
        where: {
          name: dto.name,
          organizationId: existingProduct.organizationId,
          id: { not: id } // Исключаем текущий продукт из проверки
        }
      })
      //FIXME: сделать коды нормально

      if (productWithSameName) {
        throw new NotFoundException(`Product already exists in this organization`)
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        productCategory: true
      }
    })
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
      },
      include: {
        productCategory: true
      }
    })

    // Приводим Prisma Decimal к числу для корректного сравнения
    return products.filter(product => Number(product.quantity) < Number(product.minThreshold))
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

  /**
   * Получить продукты по категории
   */
  async findByCategory(categoryId: number, organizationId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        organizationId: Number(organizationId),
        active: true
      },
      include: {
        productCategory: true
      },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Получить продукты без категории
   */
  async findWithoutCategory(organizationId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId: null,
        organizationId: Number(organizationId),
        active: true
      },
      orderBy: { name: 'asc' }
    })
  }
}
