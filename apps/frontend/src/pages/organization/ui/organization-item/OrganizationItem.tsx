import React, { useState } from 'react'
import { IUserOrganization } from '@/entitites/organization/model/organization.type'
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
  data: IUserOrganization
  handleSelectOrganization: (data: IUserOrganization) => void
  variant?: 'default' | 'change' | 'invite'
  disableChange?: boolean

  role: Role
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({
  data,
  handleSelectOrganization,
  variant,
  role
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { currentOrganization, organizationId } = useOrganizationStore()
  const queryClient = useQueryClient()

  return (
    <button
      className='py-3 px-3  relative w-full inline-flex  items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
      onClick={() => {
        hapticFeedback.impactOccurred('light')
        handleSelectOrganization(data)
      }}
    >
      <div className='absolute -top-3 right-0 flex gap-x-1'>
        {organizationId && +organizationId === data.organizationId && (
          <span className='inline-flex  bg-blue-600 text-white  items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
            Текущий склад
          </span>
        )}
        {data.isOwner && variant === 'change' && (
          <span className='inline-flex  bg-blue-600 text-white items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium  '>
            Владелец
          </span>
        )}
      </div>

      {isLoading && <LoaderSection className='rounded-lg ' />}
      <div className='flex gap-x-3  flex-1 relative'>
        <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
          <Warehouse
            className='shrink-0 size-5'
            strokeWidth={1.5}
          />
        </span>

        <div className='grow flex-1'>
          <div className='font-medium w-[36%] truncate text-gray-800 hover:text-blue-600 text-start focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
            {data.organization.name}
          </div>

          {data.organization.description && (
            <p className='text-xs text-gray-500 text-start dark:text-neutral-500 max-w-[180px] wrap-break-word  text-wrap '>
              {data.organization.description}
            </p>
          )}
        </div>
      </div>
      {data.isOwner && variant !== 'change' && (
        <span className='inline-flex absolute top-3 right-3 items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500'>
          Владелец
        </span>
      )}
      {variant === 'change' && (
        <div
          className='absolute top-3 ml-2 end-3 group-hover:opacity-100 lg:opacity-0 '
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <div className='p-0.5 sm:p-1 inline-flex items-center bg-white border border-gray-200 lg:shadow-xs rounded-lg dark:bg-neutral-800 dark:border-neutral-700'>
            {data.isOwner && (
              <>
                <div className='hs-tooltip inline-block'>
                  <Link
                    className={clsx(
                      'hs-tooltip-toggle size-7.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                    )}
                    to={`/organization/${data.organizationId}/edit`}
                  >
                    <SquarePen className='shrink-0 size-4' />
                  </Link>
                  <span
                    className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700 hidden'
                    role='tooltip'
                    style={{ position: 'fixed', left: 160, top: 51 }}
                    data-placement='bottom'
                  >
                    Изменить
                  </span>
                </div>

                {organizationId && +organizationId !== data.organizationId && (
                  <div className='w-px h-5 mx-1 bg-gray-200 dark:bg-neutral-700' />
                )}
              </>
            )}

            {data.isOwner && organizationId && +organizationId !== data.organizationId && (
              <OrganizationDeleteModal
                organizationId={data.organizationId}
                onStartDelete={() => setIsLoading(true)}
                onSuccess={() => {
                  // Оптимистично обновляем кэш
                  queryClient.setQueryData(
                    [...['organizations'], 'my', 'available'],
                    (oldData: any) => {
                      if (!oldData) return oldData
                      return {
                        ...oldData,
                        data: {
                          ...oldData.data,
                          myOrganizations: oldData.data.myOrganizations.filter(
                            (org: any) => org.organizationId !== data.organizationId
                          )
                        }
                      }
                    }
                  )
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 600)
                  hapticFeedback.notificationOccurred('success')
                }}
              />
            )}
            {!data.isOwner && organizationId && +organizationId !== data.organizationId && (
              <OrganizationUserDeleteModal
                organizationId={data.organizationId}
                userId={data.userId}
                onStartDelete={() => setIsLoading(true)}
                onSuccess={() => {
                  // Оптимистично обновляем кэш
                  queryClient.setQueryData(
                    [...['organizations'], 'my', 'available'],
                    (oldData: any) => {
                      if (!oldData) return oldData
                      return {
                        ...oldData,
                        data: {
                          ...oldData.data,
                          myOrganizations: oldData.data.myOrganizations.filter(
                            (org: any) => org.organizationId !== data.organizationId
                          )
                        }
                      }
                    }
                  )
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 600)
                  hapticFeedback.notificationOccurred('success')
                }}
              />
            )}
          </div>
        </div>
      )}
    </button>
  )
}

export default OrganizationItem
