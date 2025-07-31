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

const OrganizationItem: React.FC<OrganizationItemProps> = ({ data, handleSelectOrganization, variant, role }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { currentOrganization, organizationId } = useOrganizationStore()
  const queryClient = useQueryClient()

  return (
    <button
      className='relative inline-flex w-full items-center gap-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-3 font-medium text-gray-800 shadow-2xs transition-transform duration-150 ease-in-out select-none hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
      onClick={() => {
        hapticFeedback.impactOccurred('light')
        handleSelectOrganization(data)
      }}
    >
      <div className='absolute -top-3 right-0 flex gap-x-1'>
        {organizationId && +organizationId === data.organizationId && (
          <span className='inline-flex items-center gap-x-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white'>
            Текущий склад
          </span>
        )}
        {data.isOwner && (
          <span className='inline-flex items-center gap-x-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white'>
            Владелец
          </span>
        )}
      </div>

      {isLoading && <LoaderSection className='rounded-lg' />}
      <div className='relative flex w-full min-w-0 gap-x-3'>
        <span className='flex size-9.5 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
          <Warehouse
            className='size-5 shrink-0'
            strokeWidth={1.5}
          />
        </span>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='text-ellipsis-2 text-start font-medium break-words text-gray-800 hover:text-blue-600 focus:text-blue-600 focus:outline-hidden dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
            {data.organization.name}
          </div>

          {data.organization.description && (
            <p className='text-ellipsis-2 text-start text-xs break-words text-gray-500 dark:text-neutral-500'>
              {data.organization.description}
            </p>
          )}
        </div>

        {variant === 'change' && (
          <div
            className='ml-auto shrink-0 group-hover:opacity-100 lg:opacity-0'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <div className='inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 sm:p-1 lg:shadow-xs dark:border-neutral-700 dark:bg-neutral-800'>
              {data.isOwner && (
                <>
                  <div className='hs-tooltip inline-block'>
                    <Link
                      className={clsx(
                        'hs-tooltip-toggle inline-flex size-7.5 items-center justify-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                      )}
                      to={`/organization/${data.organizationId}/edit`}
                    >
                      <SquarePen className='size-4 shrink-0' />
                    </Link>
                    <span
                      className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible invisible absolute z-20 hidden inline-block rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 dark:bg-neutral-700'
                      role='tooltip'
                      style={{ position: 'fixed', left: 160, top: 51 }}
                      data-placement='bottom'
                    >
                      Изменить
                    </span>
                  </div>

                  {organizationId && +organizationId !== data.organizationId && (
                    <div className='mx-1 h-5 w-px bg-gray-200 dark:bg-neutral-700' />
                  )}
                </>
              )}

              {data.isOwner && organizationId && +organizationId !== data.organizationId && (
                <OrganizationDeleteModal
                  organizationId={data.organizationId}
                  onStartDelete={() => setIsLoading(true)}
                  onSuccess={() => {
                    // Оптимистично обновляем кэш
                    queryClient.setQueryData([...['organizations'], 'my', 'available'], (oldData: any) => {
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
                    })
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
                    queryClient.setQueryData([...['organizations'], 'my', 'available'], (oldData: any) => {
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
                    })
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
      </div>
    </button>
  )
}

export default OrganizationItem
