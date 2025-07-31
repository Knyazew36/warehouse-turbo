import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from '../bot/notification.service';
import { UserService } from '../user/user.service';
import { Organization, Role } from '@prisma/client';
import { OrganizationSettings } from 'src/organization/types/organization-settings.type';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  /**
   * Проверяет остатки на складе и отправляет уведомления
   * Запускается каждый час для проверки времени отправки
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkLowStockAndNotify() {
    this.logger.log('🔍 Запуск проверки остатков на складе');

    try {
      // Получаем все активные организации
      const organizations = await this.prisma.organization.findMany({
        where: { active: true },
      });

      for (const organization of organizations) {
        await this.processOrganizationNotifications(organization);
      }
    } catch (error) {
      this.logger.error('Ошибка при проверке остатков на складе:', error);
    }
  }

  /**
   * Обрабатывает уведомления для конкретной организации
   */
  private async processOrganizationNotifications(organization: Organization) {
    try {
      // Получаем настройки уведомлений из организации
      const notificationSettings = this.getNotificationSettings(
        organization.settings as unknown as OrganizationSettings,
      );

      // Проверяем, нужно ли отправлять уведомление сейчас
      if (!this.shouldSendNotificationNow(notificationSettings?.notificationTime || '09:00')) {
        return;
      }

      // Получаем товары с низким остатком для организации
      const lowStockProducts = await this.getLowStockProducts(organization.id);

      if (lowStockProducts.length === 0) {
        this.logger.log(`Организация ${organization.name}: нет товаров с низким остатком`);
        return;
      }

      // Получаем пользователей для уведомлений
      const usersToNotify = await this.getUsersToNotify(
        organization.id,
        notificationSettings.notificationRoles || [Role.OWNER, Role.ADMIN],
      );

      if (usersToNotify.length === 0) {
        this.logger.log(`Организация ${organization.name}: нет пользователей для уведомлений`);
        return;
      }

      // Формируем и отправляем уведомления
      await this.sendNotifications(organization, lowStockProducts, usersToNotify);

      this.logger.log(
        `Организация ${organization.name}: отправлено ${usersToNotify.length} уведомлений`,
      );
    } catch (error) {
      this.logger.error(
        `Ошибка обработки уведомлений для организации ${organization.name}:`,
        error,
      );
    }
  }

  /**
   * Получает настройки уведомлений из JSON настроек организации
   */
  private getNotificationSettings(
    settings: OrganizationSettings,
  ): OrganizationSettings['notifications'] {
    const defaultSettings: OrganizationSettings['notifications'] = {
      notificationTime: '09:00',
      notificationRoles: [Role.OWNER, Role.ADMIN],
    };

    if (!settings || !settings.notifications) {
      return defaultSettings;
    }

    return {
      notificationTime: settings.notifications.notificationTime || defaultSettings.notificationTime,
      notificationRoles:
        settings.notifications.notificationRoles || defaultSettings.notificationRoles,
    };
  }

  /**
   * Проверяет, нужно ли отправлять уведомление сейчас
   */
  private shouldSendNotificationNow(notificationTime: string): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentTime === notificationTime;
  }

  /**
   * Получает товары с низким остатком для организации
   */
  private async getLowStockProducts(organizationId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
        active: true,
      },
    });

    return products.filter((product) => product.quantity < product.minThreshold);
  }

  /**
   * Получает пользователей для отправки уведомлений
   */
  private async getUsersToNotify(organizationId: number, roles: Role[]) {
    const users = await this.prisma.user.findMany({
      where: {
        active: true,
        telegramId: { not: null },
        userOrganizations: {
          some: {
            organizationId,
            role: { in: roles },
          },
        },
      },
      include: {
        userOrganizations: {
          where: { organizationId },
        },
      },
    });

    return users;
  }

  /**
   * Отправляет уведомления пользователям
   */
  private async sendNotifications(organization: any, lowStockProducts: any[], users: any[]) {
    // Формируем текст уведомления
    const productList = lowStockProducts
      .map((product) => {
        const formatNumber = (value: number) => {
          if (Number.isInteger(value)) {
            return value.toString();
          }
          return Number(value.toFixed(2)).toString();
        };
        return `• ${product.name}: ${formatNumber(product.quantity)} ${product.unit || 'ед'} (минимум: ${formatNumber(product.minThreshold)} ${product.unit || 'ед'})`;
      })
      .join('\n');

    const message = `⚠️ **${organization.name}**\n\nНа складе заканчиваются следующие товары:\n\n${productList}`;

    // Получаем URL веб-приложения
    const webappUrl =
      this.notificationService.config.get<string>('WEBAPP_URL') ||
      'https://big-grain-tg.vercel.app';

    // Отправляем уведомления каждому пользователю
    for (const user of users) {
      try {
        await this.notificationService.sendMessage(user.telegramId, message, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: '🚀 Открыть приложение', web_app: { url: webappUrl } }]],
          },
        });

        this.logger.log(`Уведомление отправлено пользователю ${user.telegramId}`);
      } catch (error) {
        this.logger.error(`Ошибка отправки уведомления пользователю ${user.telegramId}:`, error);
      }
    }
  }
}
