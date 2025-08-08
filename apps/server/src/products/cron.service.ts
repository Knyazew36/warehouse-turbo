import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { NotificationService } from '../bot/notification.service'
import { UserService } from '../user/user.service'
import { Organization, Role, User } from '@prisma/client'
import { OrganizationSettings } from 'src/organization/types/organization-settings.type'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  /**
   * Проверяет остатки на складе и отправляет уведомления
   * Запускается каждый час для проверки времени отправки
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkLowStockAndNotify() {
    const startTime = Date.now()
    this.logger.log('🔍 Запуск проверки остатков на складе')

    try {
      // Получаем все активные организации
      const organizations = await this.prisma.organization.findMany({
        where: { active: true }
      })

      let processedOrganizations = 0
      let totalNotificationsSent = 0

      for (const organization of organizations) {
        this.logger.log(`🏢 Обработка организации: ${organization.name} (ID: ${organization.id})`)
        const result = await this.processOrganizationNotifications(organization)
        if (result) {
          processedOrganizations++
          totalNotificationsSent += result.notificationsSent
        }
      }

      const executionTime = Date.now() - startTime
      this.logger.log(
        `✅ Проверка завершена за ${executionTime}ms. Обработано организаций: ${processedOrganizations}, отправлено уведомлений: ${totalNotificationsSent}`
      )
    } catch (error) {
      this.logger.error('❌ Ошибка при проверке остатков на складе:', error)
    }
  }

  /**
   * Обрабатывает уведомления для конкретной организации
   */
  private async processOrganizationNotifications(
    organization: Organization
  ): Promise<{ notificationsSent: number } | null> {
    const startTime = Date.now()
    this.logger.log(`🏢 Начало обработки организации ${organization.name} (ID: ${organization.id})`)

    try {
      // Получаем настройки уведомлений из организации
      this.logger.log(`⚙️ Получение настроек уведомлений для организации ${organization.name}`)
      const notificationSettings = this.getNotificationSettings(
        organization.settings as unknown as OrganizationSettings
      )
      this.logger.log(
        `📅 Настройки уведомлений: время ${notificationSettings.notificationTime}, роли ${notificationSettings.notificationRoles.join(', ')}`
      )

      // Проверяем, нужно ли отправлять уведомление сейчас
      const shouldSend = this.shouldSendNotificationNow(
        notificationSettings?.notificationTime || '17:18'
      )
      this.logger.log(
        `⏰ Проверка времени отправки: ${shouldSend ? 'отправляем' : 'не отправляем'}`
      )

      if (!shouldSend) {
        this.logger.log(
          `⏰ Пропуск отправки для организации ${organization.name} - не время уведомлений`
        )
        return null
      }

      // Получаем товары с низким остатком для организации
      this.logger.log(`📦 Поиск товаров с низким остатком для организации ${organization.name}`)
      const lowStockProducts = await this.getLowStockProducts(organization.id)
      this.logger.log(`📦 Найдено ${lowStockProducts.length} товаров с низким остатком`)

      if (lowStockProducts.length === 0) {
        this.logger.log(`✅ Организация ${organization.name}: нет товаров с низким остатком`)
        return null
      }

      // Логируем детали товаров с низким остатком
      lowStockProducts.forEach(product => {
        this.logger.log(
          `📦 Товар "${product.name}": остаток ${product.quantity} ${product.unit || 'ед'}, минимум ${product.minThreshold} ${product.unit || 'ед'}`
        )
      })

      // Получаем пользователей для уведомлений
      this.logger.log(`👥 Поиск пользователей для уведомлений в организации ${organization.name}`)
      const usersToNotify = await this.getUsersToNotify(
        organization.id,
        notificationSettings.notificationRoles || [Role.OWNER, Role.ADMIN]
      )
      this.logger.log(`👥 Найдено ${usersToNotify.length} пользователей для уведомлений`)

      console.info('usersToNotify', usersToNotify)
      if (usersToNotify.length === 0) {
        this.logger.log(`⚠️ Организация ${organization.name}: нет пользователей для уведомлений`)
        return null
      }

      // Логируем пользователей для уведомлений
      usersToNotify.forEach(user => {
        this.logger.log(`👤 Пользователь для уведомления: ${user.telegramId} (роль: ${user})`)
      })

      // Формируем и отправляем уведомления
      this.logger.log(`📤 Отправка уведомлений для организации ${organization.name}`)
      const notificationsSent = await this.sendNotifications(
        organization,
        lowStockProducts,
        usersToNotify
      )

      const executionTime = Date.now() - startTime
      this.logger.log(
        `✅ Организация ${organization.name}: обработка завершена за ${executionTime}ms, отправлено ${notificationsSent} уведомлений`
      )

      return { notificationsSent }
    } catch (error) {
      this.logger.error(
        `❌ Ошибка обработки уведомлений для организации ${organization.name}:`,
        error
      )
      return null
    }
  }

  /**
   * Получает настройки уведомлений из JSON настроек организации
   */
  private getNotificationSettings(
    settings: OrganizationSettings
  ): OrganizationSettings['notifications'] {
    const defaultSettings: OrganizationSettings['notifications'] = {
      notificationTime: '09:00',
      notificationRoles: [Role.OWNER, Role.ADMIN]
    }

    if (!settings || !settings.notifications) {
      this.logger.log('⚙️ Используются настройки по умолчанию')
      return defaultSettings
    }

    this.logger.log('⚙️ Используются пользовательские настройки уведомлений')
    return {
      notificationTime: settings.notifications.notificationTime || defaultSettings.notificationTime,
      notificationRoles:
        settings.notifications.notificationRoles || defaultSettings.notificationRoles
    }
  }

  /**
   * Проверяет, нужно ли отправлять уведомление сейчас
   */
  private shouldSendNotificationNow(notificationTime: string): boolean {
    const now = new Date()
    const [hoursStr, minutesStr] = String(notificationTime || '').split(':')
    const targetHours = Number(hoursStr)
    const targetMinutes = Number(minutesStr ?? '0')

    this.logger.log(
      `⏰ Текущее время: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}, целевое время: ${targetHours}:${targetMinutes.toString().padStart(2, '0')}`
    )

    if (Number.isNaN(targetHours) || Number.isNaN(targetMinutes)) {
      this.logger.warn(`⚠️ Некорректный формат времени уведомлений: ${notificationTime}`)
      return false
    }

    const shouldSend = now.getHours() === targetHours && now.getMinutes() === targetMinutes
    // const shouldSend = true
    this.logger.log(`⏰ Результат проверки времени: ${shouldSend ? 'отправляем' : 'не отправляем'}`)
    return shouldSend
  }

  /**
   * Получает товары с низким остатком для организации
   */
  private async getLowStockProducts(organizationId: number) {
    this.logger.log(`🔍 Поиск товаров с низким остатком для организации ID: ${organizationId}`)

    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
        active: true
      }
    })

    this.logger.log(`📦 Найдено ${products.length} активных товаров в организации`)

    // Prisma Decimal нужно приводить к числу для корректного сравнения
    const lowStockProducts = products.filter(
      product => Number(product.quantity) < Number(product.minThreshold)
    )

    this.logger.log(
      `📦 Товаров с низким остатком: ${lowStockProducts.length} из ${products.length}`
    )

    return lowStockProducts
  }

  /**
   * Получает пользователей для отправки уведомлений
   */
  private async getUsersToNotify(organizationId: number, roles: Role[]) {
    this.logger.log(
      `👥 Поиск пользователей для организации ID: ${organizationId} с ролями: ${roles.join(', ')}`
    )

    let users: User[] = []
    try {
      users = await this.prisma.user.findMany({
        where: {
          active: true,
          telegramId: { not: '' },
          userOrganizations: {
            some: {
              organizationId,
              role: { in: roles }
            }
          }
        },
        include: {
          userOrganizations: {
            where: { organizationId }
          }
        }
      })

      this.logger.log(`👥 Найдено ${users.length} активных пользователей с Telegram ID`)
    } catch (error) {
      console.error('error', error)
      this.logger.error(`❌ Ошибка при поиске пользователей для уведомлений:`, error)
      return []
    }

    return users
  }

  /**
   * Отправляет уведомления пользователям
   */
  private async sendNotifications(
    organization: any,
    lowStockProducts: any[],
    users: any[]
  ): Promise<number> {
    this.logger.log(`📤 Начало отправки уведомлений для организации ${organization.name}`)

    // Формируем текст уведомления
    const productList = lowStockProducts
      .map(product => {
        const toPlainNumberString = (raw: any) => {
          const n = Number(raw)
          if (Number.isNaN(n)) {
            return String(raw)
          }
          return Number.isInteger(n) ? String(n) : n.toFixed(2)
        }
        return `• ${product.name}: ${toPlainNumberString(product.quantity)} ${product.unit || 'ед'} (минимум: ${toPlainNumberString(product.minThreshold)} ${product.unit || 'ед'})`
      })
      .join('\n')

    const message = `⚠️ <b>${organization.name}</b>\n\nНа складе заканчиваются следующие товары:\n\n${productList}`
    this.logger.log(`📝 Сформирован текст уведомления длиной ${message.length} символов`)

    // Получаем URL веб-приложения
    const webappUrl =
      this.notificationService.config.get<string>('WEBAPP_URL') ||
      'https://5278831-ad07030.twc1.net'

    this.logger.log(`🌐 URL веб-приложения: ${webappUrl}`)

    let successfulNotifications = 0
    let failedNotifications = 0

    // Отправляем уведомления каждому пользователю
    for (const user of users) {
      try {
        this.logger.log(`📤 Отправка уведомления пользователю ${user.telegramId}`)

        await this.notificationService.sendMessage(user.telegramId, message, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[{ text: '🚀 Открыть приложение', web_app: { url: webappUrl } }]]
          }
        })

        this.logger.log(`✅ Уведомление успешно отправлено пользователю ${user.telegramId}`)
        successfulNotifications++
      } catch (error) {
        this.logger.error(`❌ Ошибка отправки уведомления пользователю ${user.telegramId}:`, error)
        failedNotifications++
      }
    }

    this.logger.log(
      `📊 Результат отправки: успешно ${successfulNotifications}, неудачно ${failedNotifications}`
    )
    return successfulNotifications
  }
}
