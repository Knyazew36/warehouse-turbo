import React, { FC } from 'react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { getRole } from '@/shared/utils/getRole'
import { Role } from '@/entitites/user/model/user.type'

interface IProps {
  role: Role
}

const Header: FC<IProps> = ({ role }) => {
  const { currentOrganization } = useOrganizationStore()

  return (
    <header className='relative top-0 z-10 group flex flex-col'>
      <div className='flex items-center  flex-col'>
        <div className='relative  flex items-center justify-center w-full'>
          {/* {currentOrganization?.role && (
            <span className='inline-flex absolute bg-blue-600 text-white  -top-3.5 right-0 items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
              {getRole(currentOrganization?.role)}
            </span>
          )} */}
          <span className='text-sm truncate max-w-[90%]  font-medium text-gray-800 dark:text-neutral-200  relative '>
            <span className='text-sm text-gray-500 dark:text-neutral-500 text-nowrap'>Текущий склад:</span>{' '}
            {currentOrganization?.organization?.name}
          </span>
        </div>
        {role && (
          <span className='inline-flex mt-1  bg-blue-600 text-white  items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
            Роль: {getRole(role)}
          </span>
        )}
      </div>
    </header>
  )
}

export default Header
