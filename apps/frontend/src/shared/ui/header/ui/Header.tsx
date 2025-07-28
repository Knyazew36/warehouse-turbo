import React from 'react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { getRole } from '@/shared/utils/getRole'

const Header = () => {
  const { currentOrganization } = useOrganizationStore()

  return (
    <header className='relative top-0 z-10 group flex flex-col'>
      <div className='flex items-center  flex-col'>
        <span className='text-sm text-gray-500 dark:text-neutral-500 text-nowrap'>
          Текущий склад:
        </span>
        <div className='relative  flex items-center justify-center w-full'>
          {/* {currentOrganization?.role && (
            <span className='inline-flex absolute bg-blue-600 text-white  -top-3.5 right-0 items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
              {getRole(currentOrganization?.role)}
            </span>
          )} */}
          <span className='text-sm truncate max-w-[60%]  font-medium text-gray-800 dark:text-neutral-200  relative '>
            {currentOrganization?.organization?.name}
          </span>
        </div>
        {currentOrganization?.role && (
          <span className='inline-flex mt-1  bg-blue-600 text-white  items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
            {getRole(currentOrganization?.role)}
          </span>
        )}
      </div>
    </header>
  )
}

export default Header
