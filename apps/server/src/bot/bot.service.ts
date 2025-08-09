import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf, Context as TelegrafContext } from 'telegraf'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    public readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Отправить сообщение пользователю
   */
  async sendMessage(telegramId: string, message: string, extra?: any) {
    try {
      return await this.bot.telegram.sendMessage(telegramId, message, extra)
    } catch (error) {
      console.error(`Ошибка отправки сообщения пользователю ${telegramId}:`, error)
      throw error
    }
  }

  /**
   * Отправить уведомление об обновлении всем пользователям
   */
  async sendUpdateNotification(message: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { active: true },
        select: { telegramId: true }
      })

      const webappUrl = this.config.get('WEBAPP_URL')

      const extra = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: webappUrl }
              }
            ]
          ]
        }
      }

      const results = []
      for (const user of users) {
        try {
          const result = await this.sendMessage(user.telegramId, message, extra)
          results.push({ telegramId: user.telegramId, success: true, result })
        } catch (error) {
          results.push({ telegramId: user.telegramId, success: false, error: error.message })
        }
      }

      return {
        totalUsers: users.length,
        sentSuccessfully: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    } catch (error) {
      console.error('Ошибка отправки уведомления об обновлении:', error)
      throw error
    }
  }
}
