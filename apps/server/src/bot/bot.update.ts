import { Update, Start, Command, Action, Ctx, On } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { PrismaService } from 'nestjs-prisma'
import { AllowedPhoneService } from 'src/allowed-phone/allowed-phone.service'
import { BotService } from './bot.service'
import { Role } from '@prisma/client'

@Update()
export class BotUpdate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly allowedPhoneService: AllowedPhoneService,
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

    // Создаем или обновляем пользователя
    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: {
        data: { ...contact }
      },
      create: {
        telegramId,
        data: { ...contact }
      }
    })

    // Создаем allowedPhone, если его еще нет, и привязываем к пользователю
    try {
      // Сначала создаем allowedPhone, если его нет
      const allowedPhone = await this.prisma.allowedPhone.upsert({
        where: { phone },
        update: {},
        create: {
          phone,
          comment: `Автоматически создан при авторизации пользователя ${user.telegramId}`
        }
      })

      // Затем привязываем к пользователю
      await this.allowedPhoneService.bindPhoneToUser(phone, user.id)
      console.log(`✅ Phone ${phone} created and bound to user ${user.id}`)
    } catch (error) {
      console.error('Error creating/binding phone to user:', error)
      // Если привязка не удалась, но пользователь создан, все равно продолжаем
    }

    // Получаем организации, к которым у пользователя есть доступ
    const accessibleOrganizations =
      await this.allowedPhoneService.getUserAccessibleOrganizations(phone)

    // Создаем связи UserOrganization для всех доступных организаций
    for (const orgData of accessibleOrganizations) {
      try {
        await this.prisma.userOrganization.upsert({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: orgData.organization.id
            }
          },
          update: {
            // Обновляем роль если связь уже существует
            role: orgData.userRole || 'OPERATOR'
          },
          create: {
            userId: user.id,
            organizationId: orgData.organization.id,
            role: orgData.userRole || 'OPERATOR',
            isOwner: orgData.isOwner || false
          }
        })
        console.log(`✅ User ${user.id} added to organization ${orgData.organization.id}`)
      } catch (error) {
        console.error(`Error creating UserOrganization for org ${orgData.organization.id}:`, error)
      }
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

    try {
      const messageText = (ctx.message as any).text || 'У нас вышло обновление!'
      const result = await this.botService.sendUpdateNotification(messageText)

      await ctx.reply(
        `✅ Уведомление об обновлении отправлено!\n\n📊 Статистика:\n• Всего пользователей: ${result.totalUsers}\n• Успешно отправлено: ${result.sentSuccessfully}\n• Ошибок: ${result.failed}`
      )
    } catch (error) {
      console.error('Ошибка отправки уведомления об обновлении:', error)
      await ctx.reply('❌ Ошибка при отправке уведомления об обновлении.')
    }
  }

  private async checkAuthorization(ctx: Context): Promise<boolean> {
    const telegramId = String(ctx.from.id)
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        allowedPhone: true
      }
    })

    // Проверяем, что пользователь существует и привязан к разрешенному телефону
    return user && user.allowedPhone !== null
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
}
