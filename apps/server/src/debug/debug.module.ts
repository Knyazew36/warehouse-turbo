import { Module } from '@nestjs/common'
import { BotModule } from '../bot/bot.module'
import { DebugController } from './debug.controller'
import { DebugService } from './debug.service'

@Module({
  imports: [BotModule], // Импортируем BotModule для доступа к BotService
  controllers: [DebugController],
  providers: [DebugService],
  exports: [DebugService] // Экспортируем для использования в других модулях
})
export class DebugModule {}
