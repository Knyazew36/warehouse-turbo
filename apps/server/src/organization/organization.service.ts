import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Organization, UserOrganization, Role } from '@prisma/client'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {
    console.log('🟢 OrganizationService создан', new Date().toISOString())
  }

  async create(createOrganizationDto: CreateOrganizationDto, creatorUserId: number): Promise<Organization> {
    return await this.prisma.$transaction(async prisma => {
      // Создаем организацию
      const organization = await prisma.organization.create({
        data: {
          name: createOrganizationDto.name,
          description: createOrganizationDto.description,
          allowedPhones: createOrganizationDto.allowedPhones || [] // Используем переданные телефоны или пустой массив
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

      return organization
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
                phone: true, // Добавляем телефон пользователя
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

    // Мягкое удаление - помечаем как неактивную
    return this.prisma.organization.update({
      where: { id },
      data: { active: false }
    })
  }

  async addUserToOrganization(organizationId: number, addUserDto: AddUserToOrganizationDto): Promise<UserOrganization> {
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
            phone: true, // Добавляем телефон пользователя
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

    await this.prisma.userOrganization.delete({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId
        }
      }
    })
  }

  async getUserOrganizations(userId: number): Promise<UserOrganization[]> {
    return this.prisma.userOrganization.findMany({
      where: { userId },
      include: {
        organization: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getOrganizationUsers(organizationId: number): Promise<UserOrganization[]> {
    const organization = await this.findOne(organizationId)

    return this.prisma.userOrganization.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            data: true,
            phone: true, // Добавляем телефон пользователя
            active: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
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
            phone: true, // Добавляем телефон пользователя
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

    // Получаем пользователя с его телефоном
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Получаем ID организаций, где пользователь уже состоит
    const userOrganizationIds = myOrganizations.map(org => org.organizationId)

    // Получаем организации, где есть разрешенные телефоны пользователя, но он еще не состоит
    const invitedOrganizations = await this.prisma.organization.findMany({
      where: {
        active: true,
        allowedPhones: {
          has: user.phone // Проверяем, есть ли телефон пользователя в массиве разрешенных телефонов
        },
        id: {
          notIn: userOrganizationIds
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      myOrganizations,
      invitedOrganizations
    }
  }

  async joinOrganization(organizationId: number, userId: number): Promise<UserOrganization> {
    // Проверяем, существует ли организация
    const organization = await this.findOne(organizationId)

    // Получаем пользователя с его телефоном
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    // Проверяем, есть ли у пользователя разрешенный телефон для этой организации
    if (!user.phone || !organization.allowedPhones.includes(user.phone)) {
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

  /**
   * Добавить разрешенный телефон в организацию
   */
  async addAllowedPhone(organizationId: number, phone: string): Promise<Organization> {
    const organization = await this.findOne(organizationId)

    // Проверяем, не добавлен ли уже этот телефон
    if (organization.allowedPhones.includes(phone)) {
      throw new BadRequestException('Этот телефон уже добавлен в список разрешенных')
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        allowedPhones: {
          push: phone
        }
      }
    })
  }

  /**
   * Удалить разрешенный телефон из организации
   */
  async removeAllowedPhone(organizationId: number, phone: string): Promise<Organization> {
    const organization = await this.findOne(organizationId)

    // Проверяем, есть ли этот телефон в списке
    if (!organization.allowedPhones.includes(phone)) {
      throw new BadRequestException('Этот телефон не найден в списке разрешенных')
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        allowedPhones: {
          set: organization.allowedPhones.filter(p => p !== phone)
        }
      }
    })
  }

  /**
   * Получить все разрешенные телефоны организации
   */
  async getAllowedPhones(organizationId: number): Promise<string[]> {
    const organization = await this.findOne(organizationId)
    return organization.allowedPhones
  }

  /**
   * Проверить, может ли пользователь присоединиться к организации
   */
  async canUserJoinOrganization(organizationId: number, userId: number): Promise<boolean> {
    const organization = await this.findOne(organizationId)
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.phone) {
      return false
    }

    return organization.allowedPhones.includes(user.phone)
  }
}
