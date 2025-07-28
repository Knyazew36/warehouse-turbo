import React, { useState } from 'react'
import { IOrganization, IUserOrganization } from '@/entitites/organization/model/organization.type'
import { LogOut, SquarePen, Warehouse } from 'lucide-react'
import OrganizationDeleteModal from '../organization-delete/OrganizationDelete.modal'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import OrganizationUserDeleteModal from '../organization-user-delete/OrganizationUserDelete.modal'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Role } from '@/entitites/user/model/user.type'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { useQueryClient } from '@tanstack/react-query'

interface OrganizationItemProps {
  data: IOrganization
  disableChange?: boolean
  onClick: () => void
  role: Role
}

const OrganizationItemInvite: React.FC<OrganizationItemProps> = ({ data, role, onClick }) => {
  return (
    <button
      className='py-3 px-3 relative w-full inline-flex  items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-green-700 dark:text-neutral-300'
      onClick={() => {
        hapticFeedback.impactOccurred('light')
        onClick()
      }}
    >
      {/* {isLoading && <LoaderSection className='rounded-lg ' />} */}
      <div className='flex gap-x-3  flex-1 relative'>
        <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
          <Warehouse
            className='shrink-0 size-5'
            strokeWidth={1.5}
          />
        </span>

        <div className='grow flex-1 max-w-[180px]'>
          <div className='font-medium  truncate text-gray-800 hover:text-blue-600 text-start focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
            {data.name}
          </div>

          {data.description && (
            <p className='text-xs text-gray-500 text-start dark:text-neutral-500 max-w-[180px] wrap-break-word  text-wrap '>
              {data.description}
            </p>
          )}
        </div>
      </div>
      <span className='inline-flex  top-3 right-3 items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500'>
        Приглашение
      </span>
    </button>
  )
}

export default OrganizationItemInvite
