import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common'
import { CronService } from './cron.service'
import { OrganizationService } from '../organization/organization.service'
import { OrganizationAccessGuard } from '../organization/guards/organization-access.guard'
import { OrganizationRolesGuard } from '../organization/guards/organization-roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { CurrentOrganization } from '../organization/decorators/current-organization.decorator'
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto'
import { OrganizationSettings } from 'src/organization/types/organization-settings.type'

@Controller('cron')
@UseGuards(OrganizationAccessGuard, OrganizationRolesGuard)
export class CronController {
  constructor(
    private readonly cronService: CronService,
    private readonly organizationService: OrganizationService
  ) {}
}
