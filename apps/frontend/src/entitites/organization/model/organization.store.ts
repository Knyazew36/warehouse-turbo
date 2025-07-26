import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IUserOrganization } from '../model/organization.type'
import { useMyOrganizations } from '../api/organization.api'
import { useEffect } from 'react'

interface OrganizationStore {
  currentOrganization: IUserOrganization | null
  organizationId: number | null
  isOrganizationLoading: boolean
  setCurrentOrganization: (organization: IUserOrganization | null) => void
  setOrganizationId: (id: number | null) => void
  setOrganizationLoading: (loading: boolean) => void
  clearCurrentOrganization: () => void
  clearCache: () => void
}

export const useOrganizationStore = create<OrganizationStore>()(
  devtools(
    set => ({
      currentOrganization: null,
      organizationId: null,
      isOrganizationLoading: false,
      setCurrentOrganization: organization => {
        const newOrganizationId = organization?.organizationId || null
        set(
          {
            currentOrganization: organization,
            organizationId: newOrganizationId
          },
          false,
          'setCurrentOrganization'
        )
      },
      setOrganizationId: id => {
        set({ organizationId: id }, false, 'setOrganizationId')
      },
      setOrganizationLoading: loading => {
        set({ isOrganizationLoading: loading }, false, 'setOrganizationLoading')
      },
      clearCurrentOrganization: () => {
        set(
          {
            currentOrganization: null,
            organizationId: null
          },
          false,
          'clearCurrentOrganization'
        )
      },
      clearCache: () => {
        // Эта функция будет переопределена при инициализации
      }
    }),
    {
      name: 'organization-store'
    }
  )
)

// Функция для установки функции очистки кэша
export const setClearCacheFunction = (clearCacheFn: () => void) => {
  useOrganizationStore.setState({ clearCache: clearCacheFn })
}

// Хук для инициализации функции очистки кэша
export const useInitializeCacheClear = () => {
  // Устанавливаем функцию очистки кэша
  setClearCacheFunction(() => {
    // Получаем queryClient из window объекта или используем другой способ
    const queryClient = (window as any).__REACT_QUERY_CLIENT__
    if (queryClient) {
      // Очищаем кэш продуктов
      queryClient.removeQueries({ queryKey: ['products'] })
      queryClient.removeQueries({ queryKey: ['product'] })

      // Очищаем кэш чеков
      queryClient.removeQueries({ queryKey: ['receipts'] })

      // Очищаем кэш смен
      queryClient.removeQueries({ queryKey: ['shifts'] })

      // Очищаем кэш пользователей
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['employees'] })
      queryClient.removeQueries({ queryKey: ['user-role'] })

      // Очищаем кэш организаций
      queryClient.removeQueries({ queryKey: ['organizations'] })
    }
  })
}

// Хук для инициализации организации (можно использовать в компонентах)
export const useOrganizationInit = () => {
  const { data: organizations = [], isLoading } = useMyOrganizations()
  const { currentOrganization, setCurrentOrganization, clearCache } = useOrganizationStore()

  useEffect(() => {
    // Если у пользователя есть организации и текущая организация не выбрана
    if (organizations.length > 0 && !currentOrganization) {
      // Очищаем кэш перед установкой первой организации
      clearCache()
      // Выбираем первую организацию по умолчанию
      setCurrentOrganization(organizations[0])
    } else if (organizations.length === 0 && currentOrganization) {
      // Если у пользователя нет организаций, но есть выбранная организация, очищаем её
      clearCache()
      setCurrentOrganization(null)
    }
  }, [organizations, currentOrganization, setCurrentOrganization, clearCache])

  return { isLoading }
}

// Хук для удобного получения organizationId
export const useOrganizationId = () => {
  const { organizationId } = useOrganizationStore()
  return organizationId
}

// Хук для проверки, выбрана ли организация
export const useHasOrganization = () => {
  const { organizationId } = useOrganizationStore()
  return !!organizationId
}
