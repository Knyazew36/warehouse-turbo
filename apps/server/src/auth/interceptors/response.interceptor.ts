import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request } from 'express'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user // Пользователь добавляется TelegramAuthGuard

    return next.handle().pipe(
      map(data => {
        // Добавляем информацию о пользователе в ответ, если она есть
        if (user) {
          return {
            ...data,
            user: {
              id: user.id,
              telegramId: user.telegramId,
              role: user.role,
              allowedPhone: user.allowedPhone?.allowed || false,
              username: user.data?.username
            }
          }
        }
        return data
      })
    )
  }
}
