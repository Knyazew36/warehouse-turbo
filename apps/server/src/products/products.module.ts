import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { CronController } from './cron.controller'
import { PrismaService } from 'nestjs-prisma'
import { BotService } from '../bot/bot.service'
import { ScheduleModule } from '@nestjs/schedule'
import { NotificationModule } from '../bot/notification.module'
import { UserModule } from '../user/user.module'
import { CronService } from './cron.service'
import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [ScheduleModule, NotificationModule, UserModule, OrganizationModule],
  controllers: [ProductsController, CronController],
  providers: [PrismaService, ProductsService, BotService, CronService],
  exports: [ProductsService, CronService]
})
export class ProductsModule {}
