import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AllowedPhoneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Добавить телефон в список разрешенных для организации
   */
  async addPhoneToOrganization(phone: string, organizationId: number, comment?: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    // Создаем или находим существующий телефон
    const allowedPhone = await this.prisma.allowedPhone.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        comment,
      },
    });

    // Проверяем, не добавлен ли уже этот телефон в организацию
    const existingRelation = await this.prisma.allowedPhoneOrganization.findUnique({
      where: {
        allowedPhoneId_organizationId: {
          allowedPhoneId: allowedPhone.id,
          organizationId,
        },
      },
    });

    if (existingRelation) {
      return {
        success: true,
        message: 'Этот телефон уже добавлен в список разрешенных для данной организации',
      };
    }

    // Создаем связь между телефоном и организацией
    await this.prisma.allowedPhoneOrganization.create({
      data: {
        allowedPhoneId: allowedPhone.id,
        organizationId,
      },
    });

    return allowedPhone;
  }

  /**
   * Получить все разрешённые номера организации
   */
  async getAllPhonesForOrganization(organizationId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        allowedPhones: {
          include: {
            allowedPhone: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    return organization.allowedPhones.map((relation) => ({
      id: relation.allowedPhone.id,
      phone: relation.allowedPhone.phone,
      comment: relation.allowedPhone.comment,
      createdAt: relation.allowedPhone.createdAt,
      addedToOrganizationAt: relation.createdAt,
    }));
  }

  /**
   * Удалить телефон из списка разрешенных организации
   */
  async removePhoneFromOrganization(id: number, organizationId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { id },
    });

    if (!allowedPhone) {
      throw new Error('Телефон не найден в списке разрешенных');
    }

    // Удаляем связь между телефоном и организацией
    const deletedRelation = await this.prisma.allowedPhoneOrganization.deleteMany({
      where: {
        allowedPhoneId: allowedPhone.id,
        organizationId,
      },
    });

    if (deletedRelation.count === 0) {
      throw new Error('Этот телефон не найден в списке разрешенных для данной организации');
    }

    // Если телефон больше не связан ни с одной организацией, удаляем его
    const remainingRelations = await this.prisma.allowedPhoneOrganization.count({
      where: { allowedPhoneId: allowedPhone.id },
    });

    if (remainingRelations === 0) {
      await this.prisma.allowedPhone.delete({
        where: { id: allowedPhone.id },
      });
    }

    return { success: true };
  }

  /**
   * Проверить, разрешен ли телефон в организации
   */
  async isPhoneAllowedInOrganization(phone: string, organizationId: number): Promise<boolean> {
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone },
      include: {
        organizations: {
          where: { organizationId },
        },
      },
    });

    if (!allowedPhone) {
      return false;
    }

    return allowedPhone.organizations.length > 0;
  }

  /**
   * Получить все организации, где разрешен телефон
   */
  async getOrganizationsForPhone(phone: string) {
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!allowedPhone) {
      return [];
    }

    return allowedPhone.organizations.map((relation) => ({
      id: relation.organization.id,
      name: relation.organization.name,
      description: relation.organization.description,
      addedAt: relation.createdAt,
    }));
  }

  /**
   * Получить все разрешенные телефоны (глобально)
   */
  async getAllAllowedPhones() {
    return await this.prisma.allowedPhone.findMany({
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  /**
   * Эффективно получить все организации, к которым у пользователя есть доступ
   * Это ключевой метод для решения проблемы производительности
   */
  async getUserAccessibleOrganizations(userPhone: string) {
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone: userPhone },
      include: {
        organizations: {
          include: {
            organization: {
              include: {
                userOrganizations: {
                  where: {
                    user: {
                      allowedPhone: {
                        phone: userPhone,
                      },
                    },
                  },
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!allowedPhone) {
      return [];
    }

    return allowedPhone.organizations.map((relation) => ({
      organization: relation.organization,
      userRole: relation.organization.userOrganizations[0]?.role || null,
      isOwner: relation.organization.userOrganizations[0]?.isOwner || false,
      addedAt: relation.createdAt,
    }));
  }

  /**
   * Проверить, есть ли у пользователя доступ к конкретной организации
   * Оптимизированная версия для частых проверок
   */
  async hasUserAccessToOrganization(userPhone: string, organizationId: number): Promise<boolean> {
    const result = await this.prisma.allowedPhoneOrganization.findFirst({
      where: {
        allowedPhone: {
          phone: userPhone,
        },
        organizationId,
      },
    });

    return !!result;
  }

  /**
   * Получить роль пользователя в организации (если есть доступ)
   */
  async getUserRoleInOrganization(userPhone: string, organizationId: number) {
    const userOrg = await this.prisma.userOrganization.findFirst({
      where: {
        user: {
          allowedPhone: {
            phone: userPhone,
          },
        },
        organizationId,
      },
    });

    return userOrg
      ? {
          role: userOrg.role,
          isOwner: userOrg.isOwner,
        }
      : null;
  }

  /**
   * Привязать разрешенный телефон к пользователю
   */
  async bindPhoneToUser(phone: string, userId: number) {
    // Проверяем существование пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем существование разрешенного телефона
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone },
    });

    if (!allowedPhone) {
      throw new NotFoundException('Разрешенный телефон не найден');
    }

    // Проверяем, не привязан ли уже этот телефон к другому пользователю
    if (allowedPhone.userId && allowedPhone.userId !== userId) {
      throw new Error('Этот телефон уже привязан к другому пользователю');
    }

    // Проверяем, не привязан ли уже пользователь к другому телефону
    const existingUserPhone = await this.prisma.allowedPhone.findUnique({
      where: { userId },
    });

    if (existingUserPhone && existingUserPhone.phone !== phone) {
      throw new Error('Пользователь уже привязан к другому телефону');
    }

    // Привязываем телефон к пользователю
    const updatedPhone = await this.prisma.allowedPhone.update({
      where: { phone },
      data: { userId },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
          },
        },
      },
    });

    return updatedPhone;
  }

  // /**
  //  * Отвязать телефон от пользователя
  //  */
  // async unbindPhoneFromUser(phone: string) {
  //   const allowedPhone = await this.prisma.allowedPhone.findUnique({
  //     where: { phone }
  //   })

  //   if (!allowedPhone) {
  //     throw new NotFoundException('Разрешенный телефон не найден')
  //   }

  //   if (!allowedPhone.userId) {
  //     throw new Error('Телефон не привязан к пользователю')
  //   }

  //   // Отвязываем телефон от пользователя
  //   const updatedPhone = await this.prisma.allowedPhone.update({
  //     where: { phone },
  //     data: { userId: null }
  //   })

  //   return updatedPhone
  // }

  /**
   * Получить пользователя по разрешенному телефону
   */
  async getUserByAllowedPhone(phone: string) {
    const allowedPhone = await this.prisma.allowedPhone.findUnique({
      where: { phone },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            createdAt: true,
            active: true,
          },
        },
      },
    });

    if (!allowedPhone) {
      throw new NotFoundException('Разрешенный телефон не найден');
    }

    return allowedPhone.user;
  }

  /**
   * Получить разрешенный телефон пользователя
   */
  async getAllowedPhoneByUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        allowedPhone: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.allowedPhone;
  }
}
