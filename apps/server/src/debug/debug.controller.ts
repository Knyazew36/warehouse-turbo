import { Body, Controller, Post } from '@nestjs/common'
import { DebugService } from './debug.service'

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  @Post('send-to-debug')
  async sendToDebug(@Body() body: any) {
    return this.debugService.sendToDebug(body)
  }
}
