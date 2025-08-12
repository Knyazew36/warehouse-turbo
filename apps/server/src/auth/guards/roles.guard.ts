import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { ROLES_KEY, ROLES_BLOCKED_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // Проверяем новые заблокированные роли
    const blockedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_BLOCKED_KEY, [
      ctx.getHandler(),
      ctx.getClass()
    ])

    // Проверяем старые разрешенные роли (для обратной совместимости)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass()
    ])

    const req = ctx.switchToHttp().getRequest()
    const user = req.user // заполняется TelegramAuthGuard

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован')
    }

    // Если указаны заблокированные роли - проверяем, что пользователь НЕ имеет такую роль
    if (blockedRoles && blockedRoles.length > 0) {
      if (blockedRoles.includes(user.role)) {
        throw new ForbiddenException('Недостаточно прав')
      }
      return true // Роль не заблокирована - пропускаем
    }

    // Если указаны разрешенные роли (старая логика) - проверяем, что пользователь ИМЕЕТ такую роль
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Недостаточно прав')
      }
      return true
    }

    // Если ничего не указано - по умолчанию все имеют доступ
    return true
  }
}
