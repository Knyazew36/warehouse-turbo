import { apiDomain } from './model/constants'
import $api from './model/request'

// Экспорт основного API клиента и констант
export { $api, apiDomain }
export * from './model/constants'
export * from './model/type'

// Экспорт middleware
export { createOrganizationMiddleware, getOrganizationIdFromStore } from './middleware/organization.middleware'

// Экспорт хуков
export { useOrganizationHeaders, useOrganizationId } from './hooks/useOrganizationHeaders'
