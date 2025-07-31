import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ConsumptionDto } from './dto/create-shift-report.dto';
import { User } from '@telegram-apps/init-data-node';
import { JsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создаёт ShiftReport и уменьшает остатки для каждого продукта
   */
  async createShiftReport(userId: number, consumptions: ConsumptionDto[], organizationId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Получаем данные пользователя для сохранения
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { telegramId: true, data: true },
      });

      if (!user) {
        throw new BadRequestException('Пользователь не найден');
      }

      // Извлекаем имя из данных пользователя
      const userData = user.data as unknown as User;

      // 1) Проверяем, что не было отчёта с точно таким же userId+createdAt (при необходимости)
      //    (для MVP пропустим дубли)

      // 2) Создаём отчёт
      const shift = await tx.shiftReport.create({
        data: {
          userId,
          organizationId,
          consumptions: consumptions.map((c) => ({
            productId: c.productId,
            consumed: c.consumed,
            comment: c.comment || null,
          })),
          operatorData: userData as unknown as JsonValue,
        },
      });

      // 3) Обновляем остатки товаров
      for (const { productId, consumed } of consumptions) {
        const prod = await tx.product.findUnique({ where: { id: productId } });
        if (!prod) {
          throw new BadRequestException(`Продукт ${productId} не найден`);
        }
        if (consumed > Number(prod.quantity)) {
          throw new BadRequestException(
            `Нельзя израсходовать ${consumed}, на складе только ${prod.quantity}`,
          );
        }
        await tx.product.update({
          where: { id: productId },
          data: { quantity: { decrement: consumed } },
        });
      }

      return shift;
    });
  }

  async findAll() {
    const shiftReports = await this.prisma.shiftReport.findMany({
      include: {
        operator: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Обрабатываем каждый отчет, создавая объект пользователя из сохраненных данных, если связь потеряна
    return shiftReports.map((report) => {
      if (!report.operator && report.operatorData) {
        return {
          ...report,
          operator: report.operatorData as unknown as User,
        };
      }
      return report;
    });
  }
}
