import React from 'react'
import {
  useOrganizationStore,
  useOrganizationId,
  useHasOrganization
} from '@/entitites/organization/model/organization.store'

const OrganizationDebug: React.FC = () => {
  const { currentOrganization, organizationId } = useOrganizationStore()
  const orgId = useOrganizationId()
  const hasOrganization = useHasOrganization()

  if (import.meta.env.PROD) {
    return null // Скрываем в продакшене
  }

  return (
    <div className='fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-50 dark:bg-neutral-900 dark:border-neutral-700'>
      <h3 className='text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2'>Organization Debug</h3>
      <div className='text-xs space-y-1 text-gray-600 dark:text-neutral-400'>
        <div>Has Organization: {hasOrganization ? 'Yes' : 'No'}</div>
        <div>Organization ID: {organizationId || 'null'}</div>
        <div>Store Organization ID: {orgId || 'null'}</div>
        <div>Current Org Name: {currentOrganization?.organization.name || 'null'}</div>
        <div>User Role: {currentOrganization?.role || 'null'}</div>
      </div>
    </div>
  )
}

export default OrganizationDebug
