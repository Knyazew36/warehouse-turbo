// import { removeFromLocalStorage } from '@/shared/utils'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

export const logout = () => {
  // Очищаем состояние организации
  const { clearCurrentOrganization, clearCache } = useOrganizationStore.getState()
  clearCurrentOrganization()
  clearCache()

  // Сбрасываем роль пользователя
  const { setRole } = useAuthStore.getState()
  setRole('GUEST' as any)

  // removeFromLocalStorage('access_token')
}
