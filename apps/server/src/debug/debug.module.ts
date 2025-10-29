import { Module } from '@nestjs/common'
import { DebugController } from './debug.controller'
import { DebugService } from './debug.service'

@Module({
  controllers: [DebugController],
  providers: [DebugService],
  exports: [DebugService] // Экспортируем для использования в других модулях
})
export class DebugModule {}
