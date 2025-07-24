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
      where: { telegramId }
    })

    if (!user || user.phone === null) {
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

    // // Проверяем, используется ли номер другим пользователем
    // const existingAllowedPhone = await this.prisma.user.findUnique({
    //   where: { phone: phone, telegramId: { not: telegramId } }
    // })

    // if (existingAllowedPhone && existingAllowedPhone.phone) {
    //   const existingUser = await this.prisma.user.findUnique({
    //     where: { id: existingAllowedPhone.id }
    //   })
    //   if (existingUser && existingUser.telegramId !== telegramId) {
    //     await ctx.reply('❌ Этот номер телефона уже используется другим пользователем.')
    //     return
    //   }
    // }

    // Привязываем номер к пользователю
    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: {
        data: { ...contact }
        // role: 'OPERATOR', // Убеждаемся, что пользователь получает роль OPERATOR
      },
      create: {
        telegramId,
        data: { ...contact }
        // role: 'OPERATOR', // Новые пользователи получают роль OPERATOR
      }
    })

    // Создаем или обновляем запись телефона для бота
    // const allowedPhone = await this.allowedPhoneService.addEmployeeToOrganization(phone, user.id)

    // Если телефон привязан к организации, создаем связь UserOrganization
    // if (allowedPhone.organizationId) {
    //   try {
    //     await this.prisma.userOrganization.upsert({
    //       where: {
    //         userId_organizationId: {
    //           userId: user.id,
    //           organizationId: allowedPhone.organizationId
    //         }
    //       },
    //       update: {
    //         // Обновляем роль на OPERATOR если связь уже существует
    //         role: 'OPERATOR'
    //       },
    //       create: {
    //         userId: user.id,
    //         organizationId: allowedPhone.organizationId,
    //         role: 'OPERATOR',
    //         isOwner: false
    //       }
    //     })
    //     console.log(`✅ User ${user.id} added to organization ${allowedPhone.organizationId}`)
    //   } catch (error) {
    //     console.error('Error creating UserOrganization:', error)
    //   }
    // }

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
      where: { telegramId }
    })

    return user && user.phone !== null
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
