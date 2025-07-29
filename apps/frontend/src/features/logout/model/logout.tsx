// import { removeFromLocalStorage } from '@/shared/utils'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { useNavigate } from 'react-router-dom'

export const logout = () => {
  const navigate = useNavigate()
  // Очищаем состояние организации
  const { clearCurrentOrganization, clearCache } = useOrganizationStore.getState()
  clearCurrentOrganization()
  clearCache()

  // Сбрасываем роль пользователя
  const { clearAuth } = useAuthStore.getState()
  clearAuth()
  navigate('/')
  // removeFromLocalStorage('access_token')
}
