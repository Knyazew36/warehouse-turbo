import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateReceiptDto } from './dto/create-receipt.dto'
import { PaginationService } from '../common/services/pagination.service'
import { GetStatisticsDto } from './dto/get-statistics.dto'
import { PaginationResult } from '../common/dto/pagination.dto'

export interface StatisticsProduct {
  product: any // Можно заменить на Product из @prisma/client
  quantity: number
  comment?: string // Добавляем поле для комментария
}

export interface StatisticsOperation {
  type: 'income' | 'outcome'
  date: Date
  user: any // Можно заменить на User из @prisma/client
  products: StatisticsProduct[]
}

export interface StatisticsResult {
  periodStart: Date
  periodEnd: Date
  data: StatisticsOperation[]
}

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  async createReceipt(userId: number, dto: CreateReceiptDto, organizationId: number) {
    return this.prisma.$transaction(async tx => {
      // Проверяем, что все товары существуют
      for (const receiptItem of dto.receipts) {
        const product = await tx.product.findUnique({ where: { id: receiptItem.productId } })
        if (!product) {
          throw new BadRequestException(`Товар с ID ${receiptItem.productId} не найден`)
        }
      }

      // Создаём чек одной записью с массивом товаров
      const receipt = await tx.receipt.create({
        data: {
          operatorId: userId,
          organizationId,
          receipts: JSON.stringify(dto.receipts)
        }
      })

      // Обновляем остатки
      for (const receiptItem of dto.receipts) {
        await tx.product.update({
          where: { id: receiptItem.productId },
          data: { quantity: { increment: receiptItem.quantity } }
        })
      }

      return receipt
    })
  }

  async getStatistics(
    dto: GetStatisticsDto,
    organizationId?: number
  ): Promise<PaginationResult<StatisticsOperation>> {
    const { start, end, ...paginationDto } = dto

    // Определяем период по умолчанию (последний месяц)
    let periodStart: Date, periodEnd: Date
    const now = new Date()

    if (start) {
      periodStart = new Date(start)
    } else {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    if (end) {
      periodEnd = new Date(end)
    } else {
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    // Строим where условие для фильтрации
    const whereCondition = {
      organizationId,
      createdAt: {
        gte: periodStart,
        lte: periodEnd
      }
    }

    // Получаем данные с пагинацией
    const receiptsResult = await this.paginationService.paginate({
      model: this.prisma.receipt,
      paginationDto,
      where: whereCondition,
      include: {
        operator: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const shiftReportsResult = await this.paginationService.paginate({
      model: this.prisma.shiftReport,
      paginationDto,
      where: whereCondition,
      include: {
        User: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Получаем продукты и пользователей для маппинга
    const [products, users] = await Promise.all([
      this.prisma.product.findMany({ where: { active: true, organizationId } }),
      this.prisma.user.findMany({ where: { userOrganizations: { some: { organizationId } } } })
    ])

    const productMap = new Map(products.map(p => [p.id, p]))
    const userMap = new Map(users.map(u => [u.id, u]))

    // Преобразуем данные в нужный формат
    const transformData = (data: any[], type: 'income' | 'outcome') => {
      return data.map(item => {
        if (type === 'income') {
          let items: { product: any; quantity: number }[] = []
          try {
            let raw = item.receipts
            if (typeof raw === 'string') raw = JSON.parse(raw)
            if (!Array.isArray(raw)) raw = []
            items = raw.map((c: any) => ({
              product: productMap.get(c.productId) || null,
              quantity: c.quantity
            }))
          } catch {
            items = []
          }
          return {
            type: 'income' as const,
            date: item.createdAt,
            user: userMap.get(item.operatorId) || null,
            products: items
          }
        } else {
          let consumptions: { product: any; quantity: number; comment?: string }[] = []
          try {
            let raw = item.consumptions
            if (typeof raw === 'string') {
              raw = JSON.parse(raw)
            }
            if (!Array.isArray(raw)) raw = []
            consumptions = raw.map((c: any) => ({
              product: productMap.get(c.productId) || null,
              quantity: c.consumed,
              comment: c.comment || undefined
            }))
          } catch {
            consumptions = []
          }
          return {
            type: 'outcome' as const,
            date: item.createdAt,
            user: userMap.get(item.userId) || null,
            products: consumptions
          }
        }
      })
    }

    // Объединяем данные
    const incomeData = transformData(receiptsResult.data, 'income')
    const outcomeData = transformData(shiftReportsResult.data, 'outcome')
    const combinedData = [...incomeData, ...outcomeData]

    // Сортируем по дате (новые сверху)
    combinedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Применяем пагинацию к объединенным данным
    const { page = 1, limit = 30 } = paginationDto
    const skip = (page - 1) * limit
    const paginatedData = combinedData.slice(skip, skip + limit)

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: combinedData.length,
        totalPages: Math.ceil(combinedData.length / limit),
        hasNext: skip + limit < combinedData.length,
        hasPrev: page > 1
      }
    }
  }
}
