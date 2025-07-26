import React from 'react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

const Header = () => {
  const { currentOrganization } = useOrganizationStore()

  return (
    <>
      <header className='p-4 group relative overflow-hidden flex flex-col bg-white border border-gray-200 rounded-xl mb-4 focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500 dark:text-neutral-500'>Выбранный склад:</span>
          <span className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
            {currentOrganization?.organization?.name}
          </span>
        </div>
      </header>
    </>
  )
}

export default Header
