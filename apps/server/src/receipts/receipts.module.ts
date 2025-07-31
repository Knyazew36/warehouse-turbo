import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { PrismaService } from 'nestjs-prisma';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService, PrismaService, PaginationService],
})
export class ReceiptsModule {}
