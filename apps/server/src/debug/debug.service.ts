import { Injectable } from '@nestjs/common'
import { BotService } from 'src/bot/bot.service'

@Injectable()
export class DebugService {
  constructor(private readonly botService: BotService) {}

  async sendToDebug(body: string) {
    return this.botService.sendMessage(process.env.DEBUG_CHAT_ID, JSON.stringify(body))
  }
}
