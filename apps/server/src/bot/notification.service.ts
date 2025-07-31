import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context as TelegrafContext } from 'telegraf';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class NotificationService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    public readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Отправить сообщение пользователю
   */
  async sendMessage(telegramId: string, message: string, extra?: any) {
    try {
      return await this.bot.telegram.sendMessage(telegramId, message, extra);
    } catch (error) {
      console.error(`Ошибка отправки сообщения пользователю ${telegramId}:`, error);
      throw error;
    }
  }
}
