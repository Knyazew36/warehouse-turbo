import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'nestjs-prisma'
import { Product } from '@prisma/client'
import { BotService } from '../bot/bot.service'
import { NotificationService } from '../bot/notification.service'
import { UserService } from '../user/user.service'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly botService: BotService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {
    console.log('🟢 ProductsService создан', new Date().toISOString())
  }

  async create(dto: CreateProductDto, organizationId: number) {
    // Проверяем существование организации
    const organization = await this.prisma.organization.findUnique({
      where: { id: Number(organizationId) }
    })

    if (!organization) {
      throw new NotFoundException(`Organization #${organizationId} not found`)
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        organizationId: Number(organizationId)
      }
    })
  }

  async findAll(onlyActive = true, organizationId?: number): Promise<Product[]> {
    const whereClause: any = {}

    if (onlyActive) {
      whereClause.active = true
    }

    if (organizationId) {
      whereClause.organizationId = organizationId
    }

    return this.prisma.product.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    })
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException(`Product #${id} not found`)
    return product
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id)
    return this.prisma.product.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.product.delete({ where: { id } })
  }

  // @Cron(CronExpression.EVERY_HOUR)
  //FIXME: не забыть
  // @Cron('0 9 * * *') // Каждый день в 9 утра
  // @Cron(CronExpression.EVERY_MINUTE)
  async checkLowStockAndNotify() {
    console.log('🔍 checkLowStockAndNotify')
    // Получаем все товары
    const allProducts = await this.prisma.product.findMany()
    const lowStock = allProducts.filter(p => p.quantity < p.minThreshold)
    if (lowStock.length === 0) return

    // Формируем текст уведомления
    const productList = lowStock
      .map(p => `• ${p.name}: ${p.quantity} ${p?.unit || ''} (минимум: ${p.minThreshold} ${p?.unit || ''}.)`)
      .join('\n')
    const message = `⚠️ На складе заканчиваются следующие товары:\n\n${productList}`

    // Получаем всех активных пользователей, кроме операторов
    const users = await this.userService.findAll()
    // const notifyUsers = users.filter(u => u.role !== 'OPERATOR' && u.active && u.telegramId)

    // for (const user of notifyUsers) {
    //   console.info('🔍 sendMessage', user.telegramId, message)
    //   try {
    //     const webappUrl = this.notificationService.config.get<string>('WEBAPP_URL') || 'https://big-grain-tg.vercel.app'
    //     await this.notificationService.sendMessage(user.telegramId, message, {
    //       reply_markup: {
    //         inline_keyboard: [[{ text: '🚀 Открыть приложение', web_app: { url: webappUrl } }]]
    //       }
    //     })
    //   } catch (err) {
    //     console.error(`Ошибка отправки уведомления пользователю ${user.telegramId}:`, err)
    //   }
    // }
  }
}
