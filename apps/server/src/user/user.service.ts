import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { User, Role } from '@prisma/client'
import { GetUsersDto } from './dto/get-users.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { OrganizationService } from 'src/organization/organization.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService
  ) {
    console.log('🟢 UsersService создан', new Date().toISOString())
  }

  async findAll(query: GetUsersDto = {}, organizationId?: number): Promise<User[]> {
    const { onlyEmployees, includeDeleted } = query

    let whereClause: any = {}

    // Если указан organizationId, фильтруем пользователей по организации
    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId
        }
      }
    }

    // Если запрошены только сотрудники, фильтруем по ролям OPERATOR и ADMIN
    if (onlyEmployees) {
      if (organizationId) {
        whereClause.userOrganizations.some.role = {
          not: [Role.GUEST, Role.BLOCKED]
        }
      } else {
        whereClause.userOrganizations = {
          some: {
            role: {
              not: [Role.GUEST, Role.BLOCKED]
            }
          }
        }
      }
    }

    // По умолчанию показываем только активных пользователей
    if (!includeDeleted) {
      whereClause.active = true
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: organizationId
        ? {
            userOrganizations: {
              where: { organizationId }
            }
          }
        : undefined
    })
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User #${id} not found`)
    }
    return user
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { telegramId } })
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id)
    return this.prisma.user.update({
      where: { id },
      data: dto
    })
  }

  //   /**
  //  * Привязать номер к пользователю
  //  */
  //   async bindPhoneToUser(phone: string, userId: number) {
  //     return this.prisma.user.update({
  //       where: { id: userId },
  //       data: { phone }
  //     })
  //   }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id)

    // Проверяем, не пытаемся ли удалить владельца системы
    // Проверяем роль в организации (если есть)
    const userOrganizations = await this.prisma.userOrganization.findMany({
      where: { userId: id }
    })

    const isOwner = userOrganizations.some(uo => uo.role === Role.OWNER)
    if (isOwner) {
      throw new BadRequestException('Нельзя удалить владельца системы')
    }

    // Начинаем транзакцию для атомарного удаления
    return await this.prisma.$transaction(async prisma => {
      // 5. Мягкое удаление пользователя - помечаем как неактивного
      const deletedUser = await prisma.user.update({
        where: { id },
        data: {
          active: false,
          telegramId: `deleted_${user.telegramId}_${Date.now()}` // Уникальный ID для удаленного пользователя
        }
      })

      return deletedUser
    })
  }

  /**
   * Полное удаление пользователя (жесткое удаление)
   * Удаляет все связанные данные и самого пользователя
   */
  async hardRemove(id: number): Promise<void> {
    const user = await this.findOne(id)

    // Проверяем, не пытаемся ли удалить владельца системы
    // Проверяем роль в организации (если есть)
    const userOrganizations = await this.prisma.userOrganization.findMany({
      where: { userId: id }
    })

    const isOwner = userOrganizations.some(uo => uo.role === Role.OWNER)
    if (isOwner) {
      throw new BadRequestException('Нельзя удалить владельца системы')
    }

    // Начинаем транзакцию для атомарного удаления
    await this.prisma.$transaction(async prisma => {
      // 1. Удаляем все связанные данные пользователя

      await prisma.shiftReport.deleteMany({ where: { userId: id } })
      await prisma.receipt.deleteMany({ where: { operatorId: id } })

      // 4. Удаляем самого пользователя
      await prisma.user.delete({ where: { id } })
    })
  }

  /**
   * Восстановить удаленного пользователя
   */
  async restore(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User #${id} not found`)
    }

    if (user.active) {
      throw new BadRequestException('Пользователь уже активен')
    }

    // Восстанавливаем пользователя
    return this.prisma.user.update({
      where: { id },
      data: {
        active: true,
        telegramId: user.telegramId.replace(/^deleted_.*_/, '') // Восстанавливаем оригинальный telegramId
      }
    })
  }

  /**
   * Получить список удаленных пользователей
   */
  async getDeletedUsers(organizationId?: number): Promise<User[]> {
    let whereClause: any = { active: false }

    // Если указан organizationId, фильтруем пользователей по организации
    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId
        }
      }
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: organizationId
        ? {
            userOrganizations: {
              where: { organizationId }
            }
          }
        : undefined
    })
  }

  async getEmployees(organizationId?: number): Promise<User[]> {
    let whereClause: any = {}

    // Если указан organizationId, фильтруем пользователей по организации и ролям
    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId,
          role: {
            in: [Role.OPERATOR, Role.ADMIN, Role.OWNER]
          }
        }
      }
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: organizationId
        ? {
            userOrganizations: {
              where: { organizationId }
            }
          }
        : undefined
    })

    return users.map(user => ({
      ...user,
      role: user.userOrganizations.find(uo => uo.organizationId === organizationId)?.role || null
    }))
  }

  async getUsersByRole(role: Role, organizationId?: number): Promise<User[]> {
    let whereClause: any = {
      userOrganizations: {
        some: {
          role: role
        }
      }
    }

    if (organizationId) {
      whereClause.userOrganizations.some.organizationId = organizationId
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        userOrganizations: {
          where: organizationId ? { organizationId } : undefined
        }
      }
    })
  }

  async getUserRole(telegramId: string, organizationId: number): Promise<{ role: Role }> {
    const userOrg = await this.prisma.userOrganization.findFirst({
      where: {
        user: { telegramId },
        organizationId
      }
    })

    console.info('userOrg', userOrg)
    console.info('telegramId', telegramId)
    console.info('organizationId', organizationId)

    if (!userOrg) {
      throw new NotFoundException('User not found in organization')
    }

    return { role: userOrg.role }
  }

  /**
   * Получить пользователя с информацией о разрешенном телефоне
   */
  async findOneWithAllowedPhone(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        allowedPhone: true,
        userOrganizations: {
          include: {
            organization: true
          }
        }
      }
    })

    if (!user) {
      throw new NotFoundException(`User #${id} not found`)
    }

    return user
  }

  /**
   * Получить всех пользователей с информацией о разрешенных телефонах
   */
  async findAllWithAllowedPhones(query: GetUsersDto = {}, organizationId?: number) {
    const { onlyEmployees, includeDeleted } = query

    let whereClause: any = {}

    // Если указан organizationId, фильтруем пользователей по организации
    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId
        }
      }
    }

    // Если запрошены только сотрудники, фильтруем по ролям OPERATOR и ADMIN
    if (onlyEmployees) {
      if (organizationId) {
        whereClause.userOrganizations.some.role = {
          not: [Role.GUEST, Role.BLOCKED]
        }
      } else {
        whereClause.userOrganizations = {
          some: {
            role: {
              not: [Role.GUEST, Role.BLOCKED]
            }
          }
        }
      }
    }

    // По умолчанию показываем только активных пользователей
    if (!includeDeleted) {
      whereClause.active = true
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        allowedPhone: true,
        ...(organizationId
          ? {
              userOrganizations: {
                where: { organizationId }
              }
            }
          : {
              userOrganizations: {
                include: {
                  organization: true
                }
              }
            })
      }
    })
  }

  /**
   * Получить пользователей, у которых есть привязанные разрешенные телефоны
   */
  async findUsersWithAllowedPhones(organizationId?: number) {
    let whereClause: any = {
      allowedPhone: {
        isNot: null
      }
    }

    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId
        }
      }
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        allowedPhone: true,
        userOrganizations: {
          include: {
            organization: true
          }
        }
      }
    })
  }

  /**
   * Получить пользователей без привязанных разрешенных телефонов
   */
  async findUsersWithoutAllowedPhones(organizationId?: number) {
    let whereClause: any = {
      allowedPhone: null
    }

    if (organizationId) {
      whereClause.userOrganizations = {
        some: {
          organizationId: organizationId
        }
      }
    }

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        userOrganizations: {
          include: {
            organization: true
          }
        }
      }
    })
  }
}
