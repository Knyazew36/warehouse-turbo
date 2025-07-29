// src/auth/guards/telegram-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'nestjs-prisma'
import { validate, parse, User } from '@telegram-apps/init-data-node'
import { RequestWithOrganization } from '../../organization/types/request.types'

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private cachedBotToken: string | null = null
  private cachedDevToken: string | null = null
  private cachedProdToken: string | null = null

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  private getBotToken(): string {
    const nodeEnv = this.config.get<string>('NODE_ENV') || 'development'
    const isDev = nodeEnv === 'development'

    if (isDev) {
      if (!this.cachedDevToken) {
        this.cachedDevToken = this.config.get<string>('TG_BOT_TOKEN_DEV')
      }
      return this.cachedDevToken
    } else {
      if (!this.cachedProdToken) {
        this.cachedProdToken = this.config.get<string>('TG_BOT_TOKEN')
      }
      return this.cachedProdToken
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithOrganization>()
    const authHeader = String(req.header('authorization') || '')

    // 1) Разбираем "tma <initDataRaw>"
    const [authType, initDataRaw = ''] = authHeader.split(' ')
    if (authType !== 'tma' || !initDataRaw) {
      throw new UnauthorizedException('Invalid authorization header')
    }

    // 2) Проверяем подпись и срок жизни (по умолчанию 3600 сек)
    const botToken = this.getBotToken()
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

    // 4) Валидируем organizationId если он передан
    const organizationId = req.headers['x-organization-id'] as string
    if (organizationId && isNaN(parseInt(organizationId))) {
      throw new UnauthorizedException('Invalid organization ID')
    }

    // 5) Апсертим пользователя в БД и получаем роль в организации за один запрос
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
        allowedPhone: true,
        userOrganizations: organizationId
          ? {
              where: {
                organizationId: parseInt(organizationId)
              },
              select: {
                role: true
              }
            }
          : false
      }
    })

    // 6) Обрабатываем роль пользователя
    let userWithRole = user

    if (organizationId) {
      const userOrganization = user.userOrganizations?.[0]

      if (userOrganization) {
        // Добавляем роль к объекту пользователя
        userWithRole = {
          ...user,
          role: userOrganization.role,
          //@ts-ignore
          username: user.data.username
        } as any
      } else {
        throw new UnauthorizedException('User not found in organization')
      }
    }

    req.user = userWithRole
    return true
  }
}
