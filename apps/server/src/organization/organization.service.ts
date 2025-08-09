import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Organization, UserOrganization, Role } from '@prisma/client'
import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto'
import { UpdateNotificationSettingsDto } from '../products/dto/update-notification-settings.dto'

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

  async getUserOrganizations(userId: number): Promise<UserOrganization[]> {
    return this.prisma.userOrganization.findMany({
      where: { userId },
      include: {
        organization: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // async getOrganizationUsers(organizationId: number): Promise<UserOrganization[]> {
  //   return this.prisma.userOrganization.findMany({
  //     where: { organizationId },
  //     include: {
  //       user: {
  //         select: {
  //           id: true,
  //           telegramId: true,
  //           data: true,
  //           active: true
  //         }
  //       }
  //     },
  //     orderBy: { createdAt: 'desc' }
  //   })
  // }

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

  // /**
  //  * Добавить разрешенный телефон в организацию
  //  */
  // async addAllowedPhone(organizationId: number, phone: string): Promise<Organization> {
  //   const organization = await this.findOne(organizationId)

  //   // Создаем или находим существующий телефон
  //   const allowedPhone = await this.prisma.allowedPhone.upsert({
  //     where: { phone },
  //     update: {},
  //     create: {
  //       phone,
  //       comment: ''
  //     }
  //   })

  //   // Проверяем, не добавлен ли уже этот телефон в организацию
  //   const existingRelation = await this.prisma.allowedPhoneOrganization.findUnique({
  //     where: {
  //       allowedPhoneId_organizationId: {
  //         allowedPhoneId: allowedPhone.id,
  //         organizationId
  //       }
  //     }
  //   })

  //   if (existingRelation) {
  //     throw new BadRequestException('Этот телефон уже добавлен в список разрешенных')
  //   }

  //   // Создаем связь между телефоном и организацией
  //   await this.prisma.allowedPhoneOrganization.create({
  //     data: {
  //       allowedPhoneId: allowedPhone.id,
  //       organizationId
  //     }
  //   })

  //   return this.findOne(organizationId)
  // }

  // /**
  //  * Удалить разрешенный телефон из организации
  //  */
  // async removeAllowedPhone(organizationId: number, phone: string): Promise<Organization> {
  //   const organization = await this.findOne(organizationId)

  //   const allowedPhone = await this.prisma.allowedPhone.findUnique({
  //     where: { phone }
  //   })

  //   if (!allowedPhone) {
  //     throw new BadRequestException('Телефон не найден в списке разрешенных')
  //   }

  //   // Удаляем связь между телефоном и организацией
  //   const deletedRelation = await this.prisma.allowedPhoneOrganization.deleteMany({
  //     where: {
  //       allowedPhoneId: allowedPhone.id,
  //       organizationId
  //     }
  //   })

  //   if (deletedRelation.count === 0) {
  //     throw new BadRequestException(
  //       'Этот телефон не найден в списке разрешенных для данной организации'
  //     )
  //   }

  //   // Если телефон больше не связан ни с одной организацией, удаляем его
  //   const remainingRelations = await this.prisma.allowedPhoneOrganization.count({
  //     where: { allowedPhoneId: allowedPhone.id }
  //   })

  //   if (remainingRelations === 0) {
  //     await this.prisma.allowedPhone.delete({
  //       where: { id: allowedPhone.id }
  //     })
  //   }

  //   return this.findOne(organizationId)
  // }

  // /**
  //  * Получить все разрешенные телефоны организации
  //  */
  // async getAllowedPhones(
  //   organizationId: number
  // ): Promise<Array<{ id: number; phone: string; comment?: string; createdAt: Date }>> {
  //   const organization = await this.prisma.organization.findUnique({
  //     where: { id: organizationId },
  //     include: {
  //       allowedPhones: {
  //         include: {
  //           allowedPhone: true
  //         }
  //       }
  //     }
  //   })

  //   if (!organization) {
  //     throw new NotFoundException(`Организация с ID ${organizationId} не найдена`)
  //   }

  //   return organization.allowedPhones.map(relation => ({
  //     id: relation.allowedPhone.id,
  //     phone: relation.allowedPhone.phone,
  //     comment: relation.allowedPhone.comment,
  //     createdAt: relation.allowedPhone.createdAt
  //   }))
  // }

  // /**
  //  * Проверить, может ли пользователь присоединиться к организации
  //  */
  // async canUserJoinOrganization(organizationId: number, userId: number): Promise<boolean> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: {
  //       allowedPhone: true
  //     }
  //   })

  //   if (!user || !user.allowedPhone) {
  //     return false
  //   }

  //   const hasAccess = await this.prisma.allowedPhoneOrganization.findFirst({
  //     where: {
  //       allowedPhone: {
  //         phone: user.allowedPhone.phone
  //       },
  //       organizationId
  //     }
  //   })

  //   return !!hasAccess
  // }

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
}
