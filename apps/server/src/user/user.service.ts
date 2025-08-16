import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { User, Role } from '@prisma/client'
import { GetUsersDto } from './dto/get-users.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { OrganizationService } from 'src/organization/organization.service'
import { CreateUserDto } from './dto/create-user.dto'

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

    if (!userOrg) {
      throw new NotFoundException('User not found in organization')
    }

    return { role: userOrg.role }
  }
}
