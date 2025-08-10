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

      // Если есть разрешенные телефоны, добавляем их
      if (createOrganizationDto.allowedPhones && createOrganizationDto.allowedPhones.length > 0) {
        for (const phone of createOrganizationDto.allowedPhones) {
          // Создаем или находим существующий телефон
          const allowedPhone = await prisma.allowedPhone.upsert({
            where: { phone },
            update: {},
            create: {
              phone,
              comment: ''
            }
          })

          // Создаем связь с организацией
          await prisma.allowedPhoneOrganization.create({
            data: {
              allowedPhoneId: allowedPhone.id,
              organizationId: organization.id
            }
          })
        }
      }

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
        },
        allowedPhones: {
          include: {
            allowedPhone: true
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

    // Извлекаем allowedPhones из DTO, так как это поле больше не существует в модели
    const { allowedPhones, ...updateData } = updateOrganizationDto

    return this.prisma.organization.update({
      where: { id },
      data: updateData
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
    const organization = await this.findOne(organizationId)

    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: addUserDto.userId }
    })

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${addUserDto.userId} не найден`)
    }

    // Проверяем, не добавлен ли уже пользователь в эту организацию
    const existingUserOrg = await this.prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: addUserDto.userId,
          organizationId: organizationId
        }
      }
    })

    if (existingUserOrg) {
      throw new BadRequestException('Пользователь уже добавлен в эту организацию')
    }

    return this.prisma.userOrganization.create({
      data: {
        userId: addUserDto.userId,
        organizationId: organizationId,
        role: addUserDto.role,
        isOwner: addUserDto.isOwner || false
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

    // Получаем пользователя с его allowedPhone
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { allowedPhone: true }
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

    // Если у пользователя есть allowedPhone, удаляем связь с организацией
    if (user?.allowedPhone) {
      await this.prisma.allowedPhoneOrganization.deleteMany({
        where: {
          allowedPhoneId: user.allowedPhone.id,
          organizationId: organizationId
        }
      })
    }
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

    // Получаем пользователя с его разрешенным телефоном
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        allowedPhone: true
      }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Получаем ID организаций, где пользователь уже состоит
    const userOrganizationIds = myOrganizations.map(org => org.organizationId)

    // Получаем организации, где есть разрешенные телефоны пользователя, но он еще не состоит
    // Если у пользователя нет разрешенного телефона, возвращаем пустой массив приглашений
    let invitedOrganizations: Organization[] = []

    if (user.allowedPhone) {
      invitedOrganizations = await this.prisma.organization.findMany({
        where: {
          active: true,

          allowedPhones: {
            some: {
              allowedPhone: {
                phone: user.allowedPhone.phone
              }
            }
          },
          id: {
            notIn: userOrganizationIds
          }
        },
        include: {
          allowedPhones: {
            include: {
              allowedPhone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    return {
      myOrganizations,
      invitedOrganizations
    }
  }

  async joinOrganization(organizationId: number, userId: number): Promise<UserOrganization> {
    // Проверяем, существует ли организация
    const organization = await this.findOne(organizationId)

    // Получаем пользователя с его разрешенным телефоном
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        allowedPhone: true
      }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Проверяем, есть ли у пользователя разрешенный телефон для этой организации
    let hasAccess = false

    if (user.allowedPhone) {
      hasAccess =
        (await this.prisma.allowedPhoneOrganization.findFirst({
          where: {
            allowedPhone: {
              phone: user.allowedPhone.phone
            },
            organizationId
          }
        })) !== null
    }

    if (!user.allowedPhone || !hasAccess) {
      throw new BadRequestException('У вас нет разрешения для присоединения к этой организации')
    }

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
        },
        allowedPhones: {
          include: {
            allowedPhone: true
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
