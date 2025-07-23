import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class AllowedPhoneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Проверить, разрешён ли номер телефона
   */
  async isPhoneAllowed(phone: string) {
    return this.prisma.allowedPhone.findUnique({ where: { phone } })
  }

  /**
   * Добавить номер телефона (для админки) - может быть с организацией или без
   */
  async addPhone(phone: string, organizationId?: number, comment?: string) {
    try {
      return await this.prisma.allowedPhone.create({
        data: {
          phone,
          comment,
          organizationId: organizationId || null
        }
      })
    } catch (error) {
      // Если телефон уже существует, обновляем комментарий и организацию если они переданы
      if (error.code === 'P2002') {
        const updateData: any = {}
        if (comment !== undefined) updateData.comment = comment
        if (organizationId !== undefined) updateData.organizationId = organizationId || null

        if (Object.keys(updateData).length > 0) {
          return await this.prisma.allowedPhone.update({
            where: { phone },
            data: updateData
          })
        }

        return await this.prisma.allowedPhone.findUnique({ where: { phone } })
      }
      throw error
    }
  }

  /**
   * Добавить сотрудника в организацию (привязывает существующий телефон к организации)
   */
  async addEmployeeToOrganization(phone: string, organizationId: number, comment?: string) {
    const existingPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone }
    })

    if (!existingPhone) {
      // Если телефона нет, создаем новый с привязкой к организации
      return await this.prisma.allowedPhone.create({
        data: {
          phone,
          organizationId,
          comment
        }
      })
    }

    // Если телефон существует, обновляем привязку к организации
    return await this.prisma.allowedPhone.update({
      where: { phone },
      data: {
        organizationId,
        comment: comment || existingPhone.comment
      }
    })
  }

  /**
   * Привязать номер к пользователю
   */
  async bindPhoneToUser(phone: string, userId: number) {
    return this.prisma.allowedPhone.update({
      where: { phone },
      data: { usedById: userId }
    })
  }

  /**
   * Создать или обновить запись телефона для бота (без организации)
   */
  async createOrUpdatePhoneForBot(phone: string, userId: number) {
    try {
      // Пытаемся найти существующую запись
      const existingPhone = await this.prisma.allowedPhone.findUnique({
        where: { phone }
      })

      if (existingPhone) {
        // Если запись существует, обновляем привязку к пользователю
        return this.prisma.allowedPhone.update({
          where: { phone },
          data: { usedById: userId }
        })
      } else {
        // Если записи не существует, создаем новую
        // Для бота создаем запись без привязки к организации
        return this.prisma.allowedPhone.create({
          data: {
            phone,
            usedById: userId
          }
        })
      }
    } catch (error) {
      console.error('Error in createOrUpdatePhoneForBot:', error)
      throw error
    }
  }

  /**
   * Получить все разрешённые номера (с фильтрацией по организации или без)
   */
  async getAll(organizationId?: number) {
    if (organizationId) {
      // Получаем телефоны конкретной организации
      return this.prisma.allowedPhone.findMany({
        where: { organizationId }
      })
    } else {
      // Получаем все телефоны (включая те, что без организации)
      return this.prisma.allowedPhone.findMany()
    }
  }
}
