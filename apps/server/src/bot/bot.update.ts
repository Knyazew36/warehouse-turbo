// src/bot/bot.update.ts
import { Update, Start, Command, Action, Ctx, On } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { ProductsService } from '../products/products.service'
import { PrismaService } from 'nestjs-prisma'
import { NotificationService } from './notification.service'
// import { BotService } from './bot.service';
import { AllowedPhoneService } from '../auth/allowed-phone.service'

@Update()
export class BotUpdate {
  constructor(
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly allowedPhoneService: AllowedPhoneService
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    // Проверяем, авторизован ли пользователь
    const telegramId = String(ctx.from.id)
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        allowedPhone: true
      }
    })

    if (!user || user.allowedPhone === null) {
      await ctx.reply('👋 Привет! Для использования бота необходимо авторизоваться.', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📱 Авторизоваться',
                callback_data: 'request_phone'
              }
            ]
          ]
        }
      })
      return
    }

    const webappUrl = process.env.WEBAPP_URL || 'https://big-grain-tg.vercel.app'

    await ctx.reply('👋 Привет! Я бот для управления складом.', {
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

  @Command('phone')
  async onPhoneCommand(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('text')
  async onTextMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('photo')
  async onPhotoMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('video')
  async onVideoMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('document')
  async onDocumentMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('audio')
  async onAudioMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('voice')
  async onVoiceMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('sticker')
  async onStickerMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('animation')
  async onAnimationMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('location')
  async onLocationMessage(@Ctx() ctx: Context) {
    await this.handleUnauthorizedMessage(ctx)
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    const contact = (ctx.message as any).contact
    if (!contact || !contact.phone_number) {
      await ctx.reply('Не удалось получить номер телефона.')
      return
    }

    const phone = contact.phone_number.startsWith('+') ? contact.phone_number : `+${contact.phone_number}`
    const telegramId = String(ctx.from.id)
    console.info('phone', phone)

    // Проверяем, существует ли разрешенный телефон
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone }
    })

    if (!allowedPhone) {
      await ctx.reply('❌ Этот номер телефона не разрешен для использования в системе.')
      return
    }

    // Проверяем, не привязан ли уже этот телефон к другому пользователю
    if (allowedPhone.userId) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: allowedPhone.userId }
      })

      if (existingUser && existingUser.telegramId !== telegramId) {
        await ctx.reply('❌ Этот номер телефона уже привязан к другому пользователю.')
        return
      }
    }

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

    // Привязываем разрешенный телефон к пользователю
    try {
      await this.allowedPhoneService.bindPhoneToUser(phone, user.id)
      console.log(`✅ Phone ${phone} bound to user ${user.id}`)
    } catch (error) {
      console.error('Error binding phone to user:', error)
      // Если привязка не удалась, но пользователь создан, все равно продолжаем
    }

    // Получаем организации, к которым у пользователя есть доступ
    const accessibleOrganizations = await this.allowedPhoneService.getUserAccessibleOrganizations(phone)

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

  private async handleUnauthorizedMessage(ctx: Context) {
    // Проверяем, авторизован ли пользователь
    const isAuthorized = await this.checkAuthorization(ctx)

    if (!isAuthorized) {
      await ctx.reply('🔐 Для использования бота необходимо авторизоваться.', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📱 Авторизоваться',
                callback_data: 'request_phone'
              }
            ]
          ]
        }
      })
      return
    }

    const webappUrl = process.env.WEBAPP_URL || 'https://big-grain-tg.vercel.app'

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
