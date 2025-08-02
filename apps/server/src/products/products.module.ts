import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { PrismaService } from 'nestjs-prisma'
import { BotService } from '../bot/bot.service'
import { ScheduleModule } from '@nestjs/schedule'
import { NotificationModule } from '../bot/notification.module'
import { UserModule } from '../user/user.module'
import { CronService } from './cron.service'
import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [ScheduleModule, NotificationModule, UserModule, OrganizationModule],
  controllers: [ProductsController, CategoriesController],
  providers: [PrismaService, ProductsService, CategoriesService, BotService, CronService],
  exports: [ProductsService, CategoriesService, CronService]
})
export class ProductsModule {}
