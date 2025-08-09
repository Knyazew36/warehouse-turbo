import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegramAuthGuard } from './guards/telegram-auth.guard'
import { PrismaService } from 'nestjs-prisma'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [ConfigModule, PrismaModule],

  providers: [PrismaService, TelegramAuthGuard, ConfigService],
  exports: [TelegramAuthGuard]
})
export class AuthModule {}
