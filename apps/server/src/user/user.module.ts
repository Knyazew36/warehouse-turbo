import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'nestjs-prisma';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { OrganizationModule } from '../organization/organization.module';
import { OrganizationService } from 'src/organization/organization.service';

@Module({
  imports: [AuthModule, OrganizationModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, OrganizationService],
  exports: [UserService],
})
export class UserModule {}
