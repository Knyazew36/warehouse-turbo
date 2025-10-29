import { Body, Controller, Get, Post } from '@nestjs/common'
import { DebugService } from './debug.service'

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  @Post('send-to-debug')
  async sendToDebug(@Body() body: string) {
    return this.debugService.sendToDebug(body)
  }
}
