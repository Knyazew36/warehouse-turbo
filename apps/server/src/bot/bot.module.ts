import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { ProductsModule } from 'src/products/products.module'

import { AllowedPhoneService } from 'src/allowed-phone/allowed-phone.service'
import { AuthModule } from '../auth/auth.module'
import { BotService } from './bot.service'
import { BotUpdate } from './bot.update'

@Module({
  imports: [
    ConfigModule, // чтобы получить TG_BOT_TOKEN
    PrismaModule, // экспортирует PrismaService
    ProductsModule, // нужен для ProductsService в BotUpdate

    forwardRef(() => AuthModule) // для AllowedPhoneService
  ],
  providers: [PrismaService, BotUpdate, AllowedPhoneService, BotService],
  exports: [BotUpdate, BotService]
})
export class BotModule {}
