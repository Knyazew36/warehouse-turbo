import { Update, Start, Command, Action, Ctx, On } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { PrismaService } from 'nestjs-prisma'
import { BotService } from './bot.service'
import { Role } from '@prisma/client'

@Update()
export class BotUpdate {
  private waitingForNotificationText = new Map<string, boolean>()

  constructor(
    private readonly prisma: PrismaService,
    private readonly botService: BotService
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const webappUrl = process.env.WEBAPP_URL

    await ctx.reply(
      `👋 Добро пожаловать в систему управления складом!

📦 **Основные возможности:**
• Управление товарами и остатками
• Уведомления о низком запасе
• Приход товаров на склад
• Управление персоналом 
• Статистика 

🛠 **Функции для работы:**
• Добавление и редактирование товаров
• Контроль остатков и уведомления о низком запасе
• Управление организациями и пользователями

💼 **Для кого подходит:**
Складские работники, менеджеры, владельцы бизнеса

Нажмите кнопку ниже, чтобы открыть приложение и начать работу!`,
      {
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
    )
    return
  }

  @Action('request_phone')
  async onRequestPhone(@Ctx() ctx: Context) {
    const isAuthorized = await this.checkAuthorization(ctx)
    if (isAuthorized) {
      await ctx.reply('Вы уже авторизованы!')
      return
    }

    await ctx.reply('Пожалуйста, отправьте свой номер телефона, нажав на кнопку ниже:', {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📱 Отправить номер',
              request_contact: true
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
  }

  // @Command('phone')
  // async onPhoneCommand(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  @On('text')
  async onTextMessage(@Ctx() ctx: Context) {
    console.log('onTextMessage', ctx.message)

    const telegramId = String(ctx.from.id)
    const messageText = (ctx.message as any).text

    // Проверяем, ожидаем ли мы текст для уведомления
    if (this.waitingForNotificationText.has(telegramId)) {
      if (messageText === '❌ Отменить отправку') {
        this.clearNotificationState(telegramId)
        await ctx.reply('❌ Отправка уведомления отменена.', {
          reply_markup: { remove_keyboard: true }
        })
        return
      }

      // Отправляем уведомление с полученным текстом
      try {
        const result = await this.botService.sendUpdateNotification(messageText)

        await ctx.reply(
          `✅ Уведомление отправлено!\n\n📝 Текст: "${messageText}"\n\n📊 Статистика:\n• Всего пользователей: ${result.totalUsers}\n• Успешно отправлено: ${result.sentSuccessfully}\n• Ошибок: ${result.failed}`,
          {
            reply_markup: { remove_keyboard: true }
          }
        )

        // Убираем состояние ожидания
        this.clearNotificationState(telegramId)
      } catch (error) {
        console.error('Ошибка отправки уведомления:', error)
        await ctx.reply('❌ Ошибка при отправке уведомления.', {
          reply_markup: { remove_keyboard: true }
        })
        this.clearNotificationState(telegramId)
      }
      return
    }

    // Обработка других текстовых сообщений (если нужно)
    // await this.handleUnauthorizedMessage(ctx)
  }

  // @On('photo')
  // async onPhotoMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('video')
  // async onVideoMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('document')
  // async onDocumentMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('audio')
  // async onAudioMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('voice')
  // async onVoiceMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('sticker')
  // async onStickerMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('animation')
  // async onAnimationMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  // @On('location')
  // async onLocationMessage(@Ctx() ctx: Context) {
  //   await this.handleUnauthorizedMessage(ctx)
  // }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    const contact = (ctx.message as any).contact
    if (!contact || !contact.phone_number) {
      await ctx.reply('Не удалось получить номер телефона.')
      return
    }

    const phone = contact.phone_number.startsWith('+')
      ? contact.phone_number
      : `+${contact.phone_number}`
    const telegramId = String(ctx.from.id)
    console.info('phone', phone)

    // Проверяем, существует ли уже пользователь с таким телефоном
    const existingUserByPhone = await this.prisma.user.findUnique({
      where: { phone }
    })

    if (existingUserByPhone) {
      // Если пользователь с таким телефоном уже существует
      if (existingUserByPhone.telegramId === telegramId) {
        // Это тот же пользователь, просто обновляем данные
        await this.prisma.user.update({
          where: { id: existingUserByPhone.id },
          data: { data: { ...contact } }
        })
      } else {
        // Пользователь с таким телефоном уже существует, но с другим telegramId
        // Обновляем существующего пользователя, добавляя telegramId
        await this.prisma.user.update({
          where: { id: existingUserByPhone.id },
          data: {
            telegramId,
            data: { ...contact }
          }
        })
      }
    } else {
      // Пользователя с таким телефоном нет, создаем нового
      await this.prisma.user.create({
        data: {
          telegramId,
          data: { ...contact },
          phone
        }
      })
    }

    const webappUrl = process.env.WEBAPP_URL || 'https://big-grain-tg.vercel.app'

    // Обновляем предыдущее сообщение, убирая кнопку авторизации
    try {
      await ctx.editMessageText('✅ Авторизация успешна! Вам открыт доступ к приложению.', {
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
      })
    } catch (error) {
      // Если не удалось обновить, отправляем новое сообщение
      await ctx.reply('✅ Авторизация успешна! Вам открыт доступ к приложению.', {
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
      })
    }
  }

  @Command('notify')
  async onNotifyUpdate(@Ctx() ctx: Context) {
    const isAuthorized = await this.checkAuthorization(ctx)
    if (!isAuthorized) {
      await ctx.reply('❌ У вас нет доступа к этой команде.')
      return
    }

    const hasITRole = await this.checkITRole(ctx)
    if (!hasITRole) {
      await ctx.reply('❌ У вас нет прав для отправки уведомлений.')
      return
    }

    // Сохраняем состояние ожидания текста уведомления
    const telegramId = String(ctx.from.id)
    this.waitingForNotificationText.set(telegramId, true)

    await ctx.reply(
      '📝 Пожалуйста, напишите текст уведомления, которое нужно отправить всем пользователям.\n\nПримеры:\n• "У нас вышло обновление!"\n• "Плановые работы 15.01 с 2:00 до 4:00"\n• "Новая функция: экспорт отчетов в Excel"',
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: '❌ Отменить отправку'
              }
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      }
    )
  }

  private async checkAuthorization(ctx: Context): Promise<boolean> {
    const telegramId = String(ctx.from.id)
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      select: { id: true, phone: true }
    })

    // Проверяем, что пользователь существует и имеет телефон
    return !!user && !!user.phone
  }

  private async checkITRole(ctx: Context): Promise<boolean> {
    const telegramId = String(ctx.from.id)

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        userOrganizations: {
          include: {
            organization: true
          }
        }
      }
    })

    if (!user) return false

    // Проверяем, есть ли у пользователя роль IT в любой организации
    return user.userOrganizations.some(uo => uo.role === Role.IT)
  }

  private clearNotificationState(telegramId: string) {
    this.waitingForNotificationText.delete(telegramId)
  }
}
