import { Body, Controller, Post, UseGuards, Get, Query } from '@nestjs/common'
import { ReceiptsService } from './receipts.service'
import { CreateReceiptDto } from './dto/create-receipt.dto'
import { GetStatisticsDto } from './dto/get-statistics.dto'
import { TelegramAuthGuard } from 'src/auth/guards/telegram-auth.guard'
import { User } from 'src/auth/decorators/get-user.decorator'
import { User as UserType } from '@prisma/client'
import { OrganizationId } from '../organization/decorators/organization-id.decorator'

@UseGuards(TelegramAuthGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  async create(
    @Body() dto: CreateReceiptDto,
    @User() user: UserType,
    @OrganizationId() organizationId?: number
  ) {
    if (!organizationId) {
      throw new Error('Organization ID is required')
    }
    const receipt = await this.receiptsService.createReceipt(user.id, dto, organizationId)
    return { data: receipt }
  }

  @Get('statistics')
  async getStatistics(@Query() dto: GetStatisticsDto, @OrganizationId() organizationId?: number) {
    const result = await this.receiptsService.getStatistics(dto, organizationId)
    return result
  }
}
