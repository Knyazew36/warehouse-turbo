import { Module } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationController } from './organization.controller'
import { PrismaService } from 'nestjs-prisma'
import { OrganizationRolesGuard } from './guards/organization-roles.guard'

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, PrismaService, OrganizationRolesGuard],
  exports: [OrganizationService, OrganizationRolesGuard]
})
export class OrganizationModule {}
