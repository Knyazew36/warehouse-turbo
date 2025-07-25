import { Body, Controller, Post, UseGuards, Get, Query } from '@nestjs/common'
import { ReceiptsService } from './receipts.service'
import { CreateReceiptDto } from './dto/create-receipt.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { User } from 'src/auth/decorators/get-user.decorator'
import { User as UserType } from '@prisma/client'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @UseGuards(TelegramAuthGuard)
  async create(@Body() dto: CreateReceiptDto, @User() user: UserType, @OrganizationId() organizationId?: number) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }
    const receipt = await this.receiptsService.createReceipt(user.id, dto, organizationId)
    return { data: receipt }
  }

  @Get('statistics')
  @UseGuards(TelegramAuthGuard)
  async getStatistics(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @OrganizationId() organizationId?: number
  ) {
    const stat = await this.receiptsService.getStatistics(start, end, organizationId)
    return {
      periodStart: stat.periodStart,
      periodEnd: stat.periodEnd,
      data: stat.data
    }
  }
}
