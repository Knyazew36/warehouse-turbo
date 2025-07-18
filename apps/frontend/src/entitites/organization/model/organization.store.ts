import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IUserOrganization } from '../model/organization.type'
import { useMyOrganizations } from '../api/organization.api'
import { useEffect } from 'react'

interface OrganizationStore {
  currentOrganization: IUserOrganization | null
  organizationId: number | null
  setCurrentOrganization: (organization: IUserOrganization | null) => void
  setOrganizationId: (id: number | null) => void
  clearCurrentOrganization: () => void
}

export const useOrganizationStore = create<OrganizationStore>()(
  devtools(
    set => ({
      currentOrganization: null,
      organizationId: null,
      setCurrentOrganization: organization =>
        set(
          {
            currentOrganization: organization,
            organizationId: organization?.organizationId || null
          },
          false,
          'setCurrentOrganization'
        ),
      setOrganizationId: id => set({ organizationId: id }, false, 'setOrganizationId'),
      clearCurrentOrganization: () =>
        set(
          {
            currentOrganization: null,
            organizationId: null
          },
          false,
          'clearCurrentOrganization'
        )
    }),
    {
      name: 'organization-store'
    }
  )
)

// Хук для автоматической инициализации организации
export const useOrganizationInit = () => {
  const { data: organizations = [], isLoading } = useMyOrganizations()
  const { currentOrganization, setCurrentOrganization } = useOrganizationStore()

  useEffect(() => {
    // Если у пользователя есть организации и текущая организация не выбрана
    if (organizations.length > 0 && !currentOrganization) {
      // Выбираем первую организацию по умолчанию
      setCurrentOrganization(organizations[0])
    }
  }, [organizations, currentOrganization, setCurrentOrganization])

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
