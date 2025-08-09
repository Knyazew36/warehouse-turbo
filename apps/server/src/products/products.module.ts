import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { PrismaService } from 'nestjs-prisma'
import { ScheduleModule } from '@nestjs/schedule'
import { UserModule } from '../user/user.module'
import { CronService } from './cron.service'
import { OrganizationModule } from '../organization/organization.module'
import { BotModule } from 'src/bot/bot.module'
import { BotService } from 'src/bot/bot.service'

@Module({
  imports: [ScheduleModule, UserModule, OrganizationModule],
  controllers: [ProductsController, CategoriesController],
  providers: [PrismaService, ProductsService, CategoriesService, BotService, CronService],
  exports: [ProductsService, CategoriesService, CronService]
})
export class ProductsModule {}
