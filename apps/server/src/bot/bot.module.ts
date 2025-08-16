import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { ProductsModule } from 'src/products/products.module'

import { AuthModule } from '../auth/auth.module'
import { BotUpdate } from './bot.update'
import { BotService } from './bot.service'

@Module({
  imports: [
    ConfigModule, // чтобы получить TG_BOT_TOKEN
    PrismaModule, // экспортирует PrismaService
    ProductsModule, // нужен для ProductsService в BotUpdate

    forwardRef(() => AuthModule)
  ],
  providers: [PrismaService, BotUpdate, BotService],
  exports: [BotUpdate]
})
export class BotModule {}
