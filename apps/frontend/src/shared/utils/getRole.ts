import { Role } from '@/entitites/user/model/user.type'

export const getRole = (role: Role) => {
  if (!role) return 'Неизвестная роль'

  switch (role) {
    case Role.ADMIN:
      return 'Администратор'
    case Role.OWNER:
      return 'Владелец'
    case Role.IT:
      return 'IT'
    case Role.OPERATOR:
      return 'Оператор'
    case Role.GUEST:
      return 'Гость'
  }
}
