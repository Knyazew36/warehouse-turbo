import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ConsumptionDto } from './dto/create-shift-report.dto'

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создаёт ShiftReport и уменьшает остатки для каждого продукта
   */
  async createShiftReport(userId: number, consumptions: ConsumptionDto[], organizationId: number) {
    return this.prisma.$transaction(async tx => {
      // Получаем данные пользователя для сохранения
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { telegramId: true, data: true }
      })

      if (!user) {
        throw new BadRequestException('Пользователь не найден')
      }

      // Извлекаем имя из данных пользователя
      const userData = user.data as any
      const userName = userData?.first_name || userData?.username || user.telegramId

      // 1) Проверяем, что не было отчёта с точно таким же userId+createdAt (при необходимости)
      //    (для MVP пропустим дубли)

      // 2) Создаём отчёт
      const shift = await tx.shiftReport.create({
        data: {
          userId,
          organizationId,
          consumptions: consumptions.map(c => ({
            productId: c.productId,
            consumed: c.consumed,
            comment: c.comment || null
          })),
          userName,
          userTelegramId: user.telegramId
        }
      })

      // 3) Обновляем остатки товаров
      for (const { productId, consumed } of consumptions) {
        const prod = await tx.product.findUnique({ where: { id: productId } })
        if (!prod) {
          throw new BadRequestException(`Продукт ${productId} не найден`)
        }
        if (consumed > Number(prod.quantity)) {
          throw new BadRequestException(
            `Нельзя израсходовать ${consumed}, на складе только ${prod.quantity}`
          )
        }
        await tx.product.update({
          where: { id: productId },
          data: { quantity: { decrement: consumed } }
        })
      }

      return shift
    })
  }

  async findAll() {
    const shiftReports = await this.prisma.shiftReport.findMany({
      include: {
        operator: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Обрабатываем каждый отчет, создавая объект пользователя из сохраненных данных, если связь потеряна
    return shiftReports.map(report => {
      if (!report.operator && report.userName && report.userTelegramId) {
        return {
          ...report,
          operator: {
            id: report.userId,
            telegramId: report.userTelegramId,
            data: { first_name: report.userName },
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
            active: true
          } as any
        }
      }
      return report
    })
  }
}
