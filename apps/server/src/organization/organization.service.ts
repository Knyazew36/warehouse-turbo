import { Injectable, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Organization, UserOrganization, Role } from '@prisma/client'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'
import { UpdateNotificationSettingsDto } from '../products/dto/update-notification-settings.dto'
import { OrganizationStats } from './types/request.types'

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    creatorUserId: number
  ): Promise<Organization> {
    return await this.prisma.$transaction(async prisma => {
      // Создаем организацию
      const organization = await prisma.organization.create({
        data: {
          name: createOrganizationDto.name,
          description: createOrganizationDto.description,
          active: true
        }
      })

      // Добавляем создателя как владельца организации
      await prisma.userOrganization.create({
        data: {
          userId: creatorUserId,
          organizationId: organization.id,
          role: Role.OWNER,
          isOwner: true
        }
      })

      // Убрана логика allowedPhones. При создании организации телефоны больше не добавляем

      return organization
    })
  }

  async getStats(): Promise<OrganizationStats[]> {
    const organizations = await this.prisma.organization.findMany({
      include: {
        userOrganizations: {
          include: {
            user: {
              select: {
                id: true,
                telegramId: true,
                data: true
              }
            }
          }
        },
        products: {
          where: {
            active: true
          }
        }
      }
    })

    return organizations.map(org => {
      // Находим создателя (владельца) организации
      const creator = org.userOrganizations.find(uo => uo.isOwner)?.user || null

      // Подсчитываем количество активных продуктов
      const productsCount = org.products.length

      // Подсчитываем количество сотрудников
      const employeesCount = org.userOrganizations.length

      return {
        id: org.id,
        name: org.name,
        active: org.active,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
        creator,
        productsCount,
        employeesCount
      }
    })
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        userOrganizations: {
          include: {
            user: {
              select: {
                id: true,
                telegramId: true,
                data: true,
                active: true
              }
            }
          }
        }
      }
    })

    if (!organization) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`)
    }

    return organization
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id)

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto
    })
  }

  async remove(id: number): Promise<Organization> {
    const organization = await this.findOne(id)
    if (!organization) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`)
    }

    // Мягкое удаление - помечаем как неактивную
    return this.prisma.organization.delete({
      where: { id },
      include: {
        userOrganizations: true
      }
    })
  }

  async addUserToOrganization(
    organizationId: number,
    addUserDto: AddUserToOrganizationDto
  ): Promise<UserOrganization> {
    // const organization = await this.findOne(organizationId)

    // Находим/создаём пользователя: по ID или по телефону
    let userIdToUse: number | null = null

    if (addUserDto.userId) {
      const userById = await this.prisma.user.findUnique({ where: { id: addUserDto.userId } })
      if (!userById) {
        throw new NotFoundException(`Пользователь с ID ${addUserDto.userId} не найден`)
      }
      userIdToUse = userById.id
    } else if (addUserDto.phone) {
      // Ищем по телефону, если нет — создаём "пустого" пользователя с телефоном
      const existingByPhone = await this.prisma.user.findUnique({
        where: { phone: addUserDto.phone }
      })

      if (existingByPhone) {
        userIdToUse = existingByPhone.id
      } else {
        const created = await this.prisma.user.create({
          data: {
            phone: addUserDto.phone
          }
        })
        userIdToUse = created.id
      }
    } else {
      throw new BadRequestException('Необходимо передать userId или phone')
    }

    // Проверяем, не добавлен ли уже пользователь в эту организацию
    const existingUserOrg = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: userIdToUse,
          organizationId: organizationId
        }
      }
    })

    if (existingUserOrg) {
      throw new BadRequestException('Пользователь уже добавлен в эту организацию')
    }

    return this.prisma.userOrganization.create({
      data: {
        userId: userIdToUse,
        organizationId: organizationId,
        role: addUserDto.role || Role.OPERATOR
        // isOwner: addUserDto.isOwner || false
      },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            phone: true,
            data: true,
            active: true
          }
        }
      }
    })
  }

  async removeUserFromOrganization(organizationId: number, userId: number): Promise<void> {
    const userOrg = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      }
    })

    if (!userOrg) {
      throw new NotFoundException('Пользователь не найден в этой организации')
    }

    // Нельзя удалить владельца организации
    if (userOrg.isOwner) {
      throw new BadRequestException('Нельзя удалить владельца организации')
    }

    // Получаем пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    // Удаляем связь пользователя с организацией
    await this.prisma.userOrganization.delete({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      }
    })

    // Ранее удалялась связь allowedPhoneOrganization. Теперь не требуется.
  }

  async updateUserRole(
    organizationId: number,
    userId: number,
    role: Role,
    isOwner?: boolean
  ): Promise<UserOrganization> {
    const userOrg = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      }
    })

    if (!userOrg) {
      throw new NotFoundException('Пользователь не найден в этой организации')
    }

    return this.prisma.userOrganization.update({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      },
      data: {
        role,
        isOwner: isOwner !== undefined ? isOwner : userOrg.isOwner
      },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            data: true,
            active: true
          }
        }
      }
    })
  }

  async getAvailableOrganizations(userId: number): Promise<{
    myOrganizations: UserOrganization[]
    invitedOrganizations: Organization[]
  }> {
    // Получаем организации пользователя
    const myOrganizations = await this.getUserOrganizations(userId)

    // Получаем пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Получаем ID организаций, где пользователь уже состоит
    const userOrganizationIds = myOrganizations.map(org => org.organizationId)

    // Больше нет механизма приглашений по телефонам — возвращаем пустой список приглашений
    const invitedOrganizations: Organization[] = []

    return {
      myOrganizations,
      invitedOrganizations
    }
  }

  async joinOrganization(organizationId: number, userId: number): Promise<UserOrganization> {
    // Проверяем, существует ли организация
    const organization = await this.findOne(organizationId)

    // Получаем пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Ранее доступ проверялся через таблицы AllowedPhone*. Теперь пользователь может присоединиться напрямую из UI.

    // Проверяем, не состоит ли уже пользователь в этой организации
    const existingUserOrg = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      }
    })

    if (existingUserOrg) {
      throw new BadRequestException('Вы уже состоите в этой организации')
    }

    // Добавляем пользователя в организацию с ролью OPERATOR по умолчанию
    return this.prisma.userOrganization.create({
      data: {
        userId: userId,
        organizationId: organizationId,
        role: Role.OPERATOR,
        isOwner: false
      },
      include: {
        organization: true
      }
    })
  }

  async updateNotificationSettings(
    organizationId: number,
    updateNotificationSettingsDto: UpdateNotificationSettingsDto
  ): Promise<Organization> {
    // Проверяем, существует ли организация
    const organization = await this.findOne(organizationId)

    // Получаем текущие настройки
    const currentSettings = (organization.settings as any) || {}

    // Обновляем настройки уведомлений
    const updatedSettings = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...updateNotificationSettingsDto
      }
    }

    // Обновляем организацию
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        settings: updatedSettings
      },
      include: {
        userOrganizations: {
          include: {
            user: {
              select: {
                id: true,
                telegramId: true,
                data: true,
                active: true
              }
            }
          }
        }
      }
    })
  }

  private async getUserOrganizations(userId: number): Promise<UserOrganization[]> {
    return this.prisma.userOrganization.findMany({
      where: { userId },
      include: {
        organization: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
