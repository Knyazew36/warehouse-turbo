import { Role } from '@/entitites/user/model/user.type'
import { create } from 'zustand'

type Store = {
  role: Role
  setRole: (role: Role) => void
  isAdmin: boolean
  isOwner: boolean
  isOperator: boolean
  isIT: boolean
}

const useAuthStore = create<Store>()(set => ({
  role: Role.GUEST,
  setRole: (role: Role) =>
    set({ role, isAdmin: role === Role.ADMIN, isOwner: role === Role.OWNER, isOperator: role === Role.OPERATOR, isIT: role === Role.IT }),
  isAdmin: false,
  isOwner: false,
  isOperator: false,
  isIT: false
}))

export { useAuthStore }
