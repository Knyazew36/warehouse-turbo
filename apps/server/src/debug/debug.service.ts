import { Injectable } from '@nestjs/common'
import { BotService } from 'src/bot/bot.service'

@Injectable()
export class DebugService {
  constructor(private readonly botService: BotService) {}

  async sendToDebug(body: any) {
    console.log('sendToDebug', body)
    const message = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
    return this.botService.sendMessage(process.env.DEBUG_CHAT_ID, message)
  }
}
