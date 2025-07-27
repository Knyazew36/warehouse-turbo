import React, { useState } from 'react'
import { IUserOrganization } from '@/entitites/organization/model/organization.type'
import { LogOut, SquarePen, Warehouse } from 'lucide-react'
import OrganizationDeleteModal from '../organization-delete/OrganizationDelete.modal'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import OrganizationUserDeleteModal from '../organization-user-delete/OrganizationUserDelete.modal'

interface OrganizationItemProps {
  data: IUserOrganization
  handleSelectOrganization: (data: IUserOrganization) => void
  variant?: 'default' | 'change' | 'invite'
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({
  data,
  handleSelectOrganization,
  variant
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <button
      className='py-3 px-3 overflow-hidden relative w-full inline-flex  items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
      onClick={() => {
        handleSelectOrganization(data)
      }}
    >
      {isLoading && <LoaderSection />}
      <div className='flex gap-x-3'>
        <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
          <Warehouse
            className='shrink-0 size-5'
            strokeWidth={1.5}
          />
        </span>

        <div className='grow'>
          <div className='font-medium text-gray-800 hover:text-blue-600 text-start focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
            {data.organization.name}
          </div>
          {data.organization.description && (
            <p className='text-xs text-gray-500 dark:text-neutral-500  text-start'>
              {data.organization.description}
            </p>
          )}
        </div>
      </div>
      {data.isOwner && (
        <span className='inline-flex absolute top-3 right-3 items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500'>
          Владелец
        </span>
      )}

      <div
        className='absolute top-3 end-3 group-hover:opacity-100 lg:opacity-0'
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className='p-0.5 sm:p-1 inline-flex items-center bg-white border border-gray-200 lg:shadow-xs rounded-lg dark:bg-neutral-800 dark:border-neutral-700'>
          {/* Button Icon */}
          <div className='hs-tooltip inline-block'>
            <a
              className='hs-tooltip-toggle size-7.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
              href='https://images.unsplash.com/photo-1635776062360-af423602aff3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
              target='_blank'
              download
            >
              <SquarePen className='shrink-0 size-4' />
            </a>
            <span
              className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700 hidden'
              role='tooltip'
              style={{ position: 'fixed', left: 160, top: 51 }}
              data-placement='bottom'
            >
              Изменить
            </span>
          </div>
          {/* End Button Icon */}

          <div className='w-px h-5 mx-1 bg-gray-200 dark:bg-neutral-700' />

          {data.isOwner && (
            <OrganizationDeleteModal
              organizationId={data.organizationId}
              onStartDelete={() => setIsLoading(true)}
              onSuccess={() => {
                setTimeout(() => {
                  setIsLoading(false)
                }, 600)
                hapticFeedback.notificationOccurred('success')
              }}
            />
          )}
          {!data.isOwner && (
            <OrganizationUserDeleteModal
              organizationId={data.organizationId}
              userId={data.userId}
              onStartDelete={() => setIsLoading(true)}
              onSuccess={() => {
                setTimeout(() => {
                  setIsLoading(false)
                }, 600)
                hapticFeedback.notificationOccurred('success')
              }}
            />
          )}
        </div>
      </div>
    </button>
  )
}

export default OrganizationItem
