import { Injectable } from '@nestjs/common'
import { BotService } from 'src/bot/bot.service'

@Injectable()
export class DebugService {
  constructor(private readonly botService: BotService) {}

  async sendToDebug(body: string) {
    console.log('sendToDebug', body)
    return this.botService.sendMessage(process.env.DEBUG_CHAT_ID, body)
  }
}
