import { Module } from '@nestjs/common'
import { AllowedPhoneService } from './allowed-phone.service'
import { AllowedPhoneController } from './allowed-phone.controller'
import { PrismaService } from 'nestjs-prisma'

@Module({
  controllers: [AllowedPhoneController],
  providers: [AllowedPhoneService, PrismaService]
})
export class AllowedPhoneModule {}
