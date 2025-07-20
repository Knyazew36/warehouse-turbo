import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

// Middleware для автоматического добавления organizationId в заголовки
export const createOrganizationMiddleware = () => {
  return (config: any) => {
    // Получаем текущий organizationId из store
    const organizationId = useOrganizationStore.getState().organizationId

    // Добавляем organizationId в заголовки, если он есть
    if (organizationId) {
      config.headers = config.headers || {}
      config.headers['x-organization-id'] = organizationId.toString()
    }

    return config
  }
}

// Функция для получения organizationId напрямую из store
export const getOrganizationIdFromStore = (): number | null => {
  return useOrganizationStore.getState().organizationId
}
