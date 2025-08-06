import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto, organizationId: number) {
    // Проверяем существование организации
    const organization = await this.prisma.organization.findUnique({
      where: { id: Number(organizationId) }
    })

    if (!organization) {
      throw new NotFoundException(`Organization #${organizationId} not found`)
    }

    return this.prisma.productCategory.create({
      data: {
        ...dto,
        organizationId: Number(organizationId)
      }
    })
  }

  async findAll(onlyActive = true, organizationId?: number, isSelectOptions = false) {
    const whereClause: any = {}

    if (onlyActive) {
      whereClause.active = true
    }

    if (organizationId !== undefined && organizationId !== null) {
      whereClause.organizationId = Number(organizationId)
    }

    // Получаем все категории
    const categories = await this.prisma.productCategory.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    })

    // Если запрошены selectOptions, возвращаем массив с label и value
    if (isSelectOptions) {
      return categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    }

    // Иначе возвращаем полные данные категорий
    return categories
  }

  async findOne(id: number) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          where: { active: true }
        }
      }
    })

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`)
    }

    return category
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id)
    return this.prisma.productCategory.update({
      where: { id },
      data: dto
    })
  }

  async remove(id: number) {
    const category = await this.findOne(id)

    // Проверяем, есть ли продукты в этой категории
    // const productsInCategory = await this.prisma.product.count({
    //   where: { categoryId: id }
    // })

    // if (productsInCategory > 0) {
    //   throw new NotFoundException(
    //     `Cannot delete category with ${productsInCategory} products. Please move or delete products first.`
    //   )
    // }

    return this.prisma.productCategory.delete({ where: { id } })
  }

  /**
   * Получить все категории с продуктами
   */
  async findAllWithProducts(onlyActive = true, organizationId?: number) {
    const whereClause: any = {}

    if (onlyActive) {
      whereClause.active = true
    }

    if (organizationId !== undefined && organizationId !== null) {
      whereClause.organizationId = Number(organizationId)
    }

    // Получаем все категории с продуктами
    const categories = await this.prisma.productCategory.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        products: {
          where: onlyActive ? { active: true } : {},
          orderBy: { name: 'asc' }
        }
      }
    })

    // Получаем продукты без категории
    const productsWithoutCategory = await this.prisma.product.findMany({
      where: {
        categoryId: null,
        organizationId: Number(organizationId),
        ...(onlyActive ? { active: true } : {})
      },
      orderBy: { name: 'asc' }
    })

    // Формируем результат
    const result = {
      categoriesWithProducts: categories,
      productsWithoutCategory: productsWithoutCategory
    }

    return result
  }

  /**
   * Получить все категории с количеством продуктов
   */
  async findAllWithProductCount(organizationId: number) {
    return this.prisma.productCategory.findMany({
      where: {
        organizationId: Number(organizationId),
        active: true
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }
}
