import React from 'react'
import { useMyOrganizations } from '../../api/organization.api'
import { useOrganizationStore } from '../../model/organization.store'
import { IUserOrganization } from '../../model/organization.type'
import { ChevronDown, Building2 } from 'lucide-react'

const OrganizationSelector: React.FC = () => {
  const { data: organizations = [], isLoading } = useMyOrganizations()
  const { currentOrganization, setCurrentOrganization } = useOrganizationStore()
  const [isOpen, setIsOpen] = React.useState(false)

  console.info('organizations', organizations)
  const handleSelectOrganization = (organization: IUserOrganization) => {
    setCurrentOrganization(organization)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className='flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg dark:bg-neutral-800'>
        <div className='w-4 h-4 bg-gray-300 rounded animate-pulse'></div>
        <div className='w-24 h-4 bg-gray-300 rounded animate-pulse'></div>
      </div>
    )
  }

  if (organizations.length === 0) {
    return null
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors'
      >
        <Building2 className='w-4 h-4 text-gray-600 dark:text-neutral-400' />
        <span className='text-sm font-medium text-gray-700 dark:text-neutral-300'>
          {currentOrganization?.organization.name || 'Выберите организацию'}
        </span>
        <ChevronDown className='w-4 h-4 text-gray-600 dark:text-neutral-400' />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-neutral-900 dark:border-neutral-700'>
          {organizations.data.map(org => (
            <button
              key={org.id}
              onClick={() => handleSelectOrganization(org)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${
                currentOrganization?.id === org.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className='text-sm font-medium text-gray-700 dark:text-neutral-300'>{org.organization.name}</div>
              <div className='text-xs text-gray-500 dark:text-neutral-500'>
                {org.role} {org.isOwner && '(Владелец)'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrganizationSelector
