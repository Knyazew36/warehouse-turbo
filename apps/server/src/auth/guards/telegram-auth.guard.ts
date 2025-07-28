// src/auth/guards/telegram-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'nestjs-prisma'
import { validate, parse, User } from '@telegram-apps/init-data-node'
import { RequestWithOrganization } from '../../organization/types/request.types'
@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithOrganization>()
    const authHeader = String(req.header('authorization') || '')

    // 1) Разбираем "tma <initDataRaw>"
    const [authType, initDataRaw = ''] = authHeader.split(' ')
    if (authType !== 'tma' || !initDataRaw) {
      throw new UnauthorizedException('Invalid authorization header')
    }

    const nodeEnv = this.config.get<string>('NODE_ENV') || 'development'
    const isDev = nodeEnv === 'development'

    const devToken = this.config.get<string>('TG_BOT_TOKEN_DEV')
    const prodToken = this.config.get<string>('TG_BOT_TOKEN')

    const token = isDev ? devToken : prodToken

    // 2) Проверяем подпись и срок жизни (по умолчанию 3600 сек)
    const botToken = token
    try {
      validate(initDataRaw, botToken)
      // validate(initDataRaw, botToken, { expiresIn: 3600 });
    } catch (err: any) {
      // сюда придёт ошибка как "Signature mismatch" или "Expired"
      throw new UnauthorizedException(`InitData validation failed: ${err.message}`)
    }

    // 3) Парсим initData
    let initData
    try {
      initData = parse(initDataRaw)
    } catch (err: any) {
      throw new UnauthorizedException(`InitData parse failed: ${err.message}`)
    }

    // 4) Апсертим пользователя в БД
    // initData.user.id — это number
    const telegramId = String(initData.user.id)
    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: {
        data: initData?.user
      },
      create: {
        telegramId,
        data: initData?.user
      },
      include: {
        allowedPhone: true
      }
    })

    // 5) Получаем роль пользователя в текущей организации (если указана)
    const organizationId = req.headers['x-organization-id'] as string
    let userWithRole = user

    if (organizationId) {
      const userOrganization = await this.prisma.userOrganization.findUnique({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: parseInt(organizationId)
          }
        }
      })

      if (userOrganization) {
        // Добавляем роль к объекту пользователя
        userWithRole = {
          ...user,
          role: userOrganization.role
        } as any
      } else {
        throw new UnauthorizedException('User not found in organization')
      }
    }

    // 6) Проверяем, что пользователь авторизован через телефон
    // if (user.allowedPhones.length === 0) {
    //   throw new UnauthorizedException('User must authorize through phone number in bot first');
    // }

    // 7) Проверяем, что пользователь не заблокирован (если роль получена)
    // if (userWithRole.role === 'BLOCKED') {
    //   throw new UnauthorizedException('User is blocked')
    // }

    // console.log('user telegram', user);
    // 8) Кладём пользователя в request.user

    req.user = userWithRole
    return true
  }
}
