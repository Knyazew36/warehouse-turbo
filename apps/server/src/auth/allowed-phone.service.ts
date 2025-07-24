import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class AllowedPhoneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Добавить сотрудника в организацию (привязывает существующий телефон к организации)
   */
  async addEmployeeToOrganization(phone: string, organizationId: number, comment?: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    })
    if (!organization) {
      throw new NotFoundException('Организация не найдена')
    }

    // Проверяем, не добавлен ли уже этот телефон
    if (organization.allowedPhones.includes(phone)) {
      throw new Error('Этот телефон уже добавлен в список разрешенных')
    }

    return await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        allowedPhones: {
          push: phone
        }
      }
    })
  }

  /**
   * Получить все разрешённые номера организации
   */
  async getAll(organizationId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      throw new NotFoundException('Организация не найдена')
    }

    // Получаем телефоны конкретной организации
    return organization.allowedPhones
  }

  /**
   * Удалить телефон из списка разрешенных
   */
  async removePhone(phone: string, organizationId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      throw new NotFoundException('Организация не найдена')
    }

    // Проверяем, есть ли этот телефон в списке
    if (!organization.allowedPhones.includes(phone)) {
      throw new Error('Этот телефон не найден в списке разрешенных')
    }

    return await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        allowedPhones: {
          set: organization.allowedPhones.filter(p => p !== phone)
        }
      }
    })
  }

  /**
   * Проверить, разрешен ли телефон в организации
   */
  async isPhoneAllowed(phone: string, organizationId: number): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return false
    }

    return organization.allowedPhones.includes(phone)
  }
}
