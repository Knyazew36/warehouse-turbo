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
   * Добавить номер телефона (для админки)
   */
  async addPhone(phone: string, organizationId: number, comment?: string) {
    try {
      return await this.prisma.allowedPhone.create({ data: { phone, comment, organizationId } })
    } catch (error) {
      // Если телефон уже существует, обновляем комментарий если он передан
      if (error.code === 'P2002' && comment) {
        return await this.prisma.allowedPhone.update({
          where: { phone },
          data: { comment }
        })
      }
      // Если телефон уже существует и комментарий не передан, возвращаем существующую запись
      if (error.code === 'P2002') {
        return await this.prisma.allowedPhone.findUnique({ where: { phone } })
      }
      throw error
    }
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
        // Если записи нет, создаем новую с дефолтной организацией
        // Сначала найдем первую активную организацию или создадим дефолтную
        let defaultOrganization = await this.prisma.organization.findFirst({
          where: { active: true }
        })

        if (!defaultOrganization) {
          // Создаем дефолтную организацию
          defaultOrganization = await this.prisma.organization.create({
            data: {
              name: 'Default Organization',
              description: 'Default organization for bot users'
            }
          })
        }

        // Создаем запись телефона
        return this.prisma.allowedPhone.create({
          data: {
            phone,
            organizationId: defaultOrganization.id,
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
   * Получить все разрешённые номера
   */
  async getAll(organizationId?: number) {
    return this.prisma.allowedPhone.findMany({ where: { organizationId } })
  }
}
