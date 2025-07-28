import React from 'react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { getRole } from '@/shared/utils/getRole'

const Header = () => {
  const { currentOrganization } = useOrganizationStore()

  return (
    <>
      <header className='p-4 group relative  flex flex-col bg-white border border-gray-200 rounded-xl mb-4 focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700'>
        {currentOrganization?.role && (
          <span className='inline-flex absolute bg-blue-600 text-white -top-3.5 right-0 items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
            {getRole(currentOrganization?.role)}
          </span>
        )}
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500 dark:text-neutral-500 text-nowrap'>
            Выбранный склад:
          </span>
          <span className='text-sm font-medium text-gray-800 dark:text-neutral-200 truncate '>
            {currentOrganization?.organization?.name}
          </span>
        </div>
      </header>
    </>
  )
}

export default Header
