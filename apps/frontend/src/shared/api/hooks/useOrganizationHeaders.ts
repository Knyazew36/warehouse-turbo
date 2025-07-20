import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

// Хук для получения заголовков с organizationId
export const useOrganizationHeaders = () => {
  const { organizationId } = useOrganizationStore()

  const headers: Record<string, string> = {}

  if (organizationId) {
    headers['x-organization-id'] = organizationId.toString()
  }

  return headers
}

// Хук для получения только organizationId
export const useOrganizationId = () => {
  const { organizationId } = useOrganizationStore()
  return organizationId
}
