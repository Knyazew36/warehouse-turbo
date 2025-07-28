import React, { useEffect, useState } from 'react'
import { Page } from '@/components/Page'
import {
  useAvailableOrganizations,
  useCreateOrganization,
  useJoinOrganization
} from '@/entitites/organization/api/organization.api'
import {
  ICreateOrganization,
  IUserOrganization,
  IOrganization,
  Role
} from '@/entitites/organization/model/organization.type'
import { Warehouse } from 'lucide-react'
import Loader from '@/shared/loader/ui/Loader'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { Link, useNavigate } from 'react-router-dom'
import OrganizationItem from '../ui/organization-item/OrganizationItem'
import OrganizationItemInvite from '../ui/organization-item/OrganizationItemInvite'

const OrganizationManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    data: { data: availableData, user: availableUser } = {
      data: {
        myOrganizations: [],
        invitedOrganizations: []
      },
      user: undefined
    },
    isLoading,
    isPending,
    isFetching
  } = useAvailableOrganizations()
  const { mutate: joinOrganization, isPending: isJoining } = useJoinOrganization()

  const {
    currentOrganization,
    setCurrentOrganization,
    setOrganizationId,
    organizationId,
    setOrganizationLoading,
    clearCache
  } = useOrganizationStore()

  // Сбрасываем состояние загрузки при монтировании компонента
  useEffect(() => {
    setOrganizationLoading(false)
  }, [setOrganizationLoading])

  const [formData, setFormData] = useState<ICreateOrganization>({
    name: '',
    description: ''
  })

  // Извлекаем данные из ответа API
  const myOrganizations = availableData?.myOrganizations || []
  const invitedOrganizations = availableData?.invitedOrganizations || []
  const allOrganizations = [...myOrganizations, ...invitedOrganizations]

  const handleSelectOrganization = (organization: IUserOrganization) => {
    hapticFeedback.impactOccurred('light')
    setOrganizationLoading(true)
    clearCache() // Очищаем кэш для обновления данных
    setCurrentOrganization(organization)
    setOrganizationId(organization.organizationId)
    navigate('/menu')
  }

  const handleJoinOrganization = (organization: IOrganization) => {
    hapticFeedback.impactOccurred('light')
    setOrganizationLoading(true)

    joinOrganization(organization.organizationId || organization.id, {
      onSuccess: userOrg => {
        hapticFeedback.notificationOccurred('success')
        clearCache() // Очищаем кэш для обновления данных
        // После присоединения автоматически выбираем эту организацию
        setCurrentOrganization(userOrg)
        setOrganizationId(userOrg.organizationId || organization.id)
        navigate('/menu')
      },
      onError: () => {
        hapticFeedback.notificationOccurred('error')
        setOrganizationLoading(false)
      }
    })
  }

  if (isLoading || isPending || isJoining || isFetching) {
    return <Loader />
  }

  return (
    <Page
      className='!p-0'
      back={false}
    >
      <>
        <main
          id='content'
          className='pb-23 sm:pb-16'
        >
          <div className='py-10 lg:py-20 w-full max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto'>
            <div className='w-full max-w-sm mx-auto'>
              <div className='space-y-10'>
                {/* Guest Checkout Details */}
                <div className='space-y-6'>
                  {allOrganizations.length > 0 && (
                    <div className='text-center'>
                      <h2 className='font-medium text-xl text-gray-800 dark:text-neutral-200'>
                        Мои склады
                      </h2>
                    </div>
                  )}

                  {allOrganizations.length === 0 && (
                    <div className='text-center'>
                      <h2 className='font-medium text-xl text-gray-800 dark:text-neutral-200'>
                        У вас нет складов
                      </h2>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500'>
                        Создайте свой первый склад для управления
                      </p>
                    </div>
                  )}

                  {invitedOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>
                        Приглашения
                      </p>
                      {invitedOrganizations.map(organization => (
                        <OrganizationItemInvite
                          role={availableUser?.role as Role}
                          key={organization.id}
                          onClick={() => handleJoinOrganization(organization)}
                          data={organization}
                        />
                      ))}
                    </>
                  )}

                  {myOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>
                        Выбери склад для просмотра и управления или создай новый
                      </p>
                      <div className='flex flex-col gap-2'>
                        {myOrganizations.map(userOrg => (
                          <OrganizationItem
                            role={availableUser?.role as Role}
                            key={userOrg.organizationId}
                            data={userOrg}
                            variant='default'
                            handleSelectOrganization={handleSelectOrganization}
                          />

                          // <button
                          //   className='py-3 px-3 relative w-full inline-flex  items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
                          //   onClick={() => handleSelectOrganization(userOrg)}
                          // >
                          //   <div className='flex gap-x-3'>
                          //     <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
                          //       <Warehouse
                          //         className='shrink-0 size-5'
                          //         strokeWidth={1.5}
                          //       />
                          //     </span>

                          //     <div className='grow'>
                          //       <div className='font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
                          //         {userOrg.organization.name}
                          //       </div>
                          //       {userOrg.organization.description && (
                          //         <p className='text-xs text-gray-500 dark:text-neutral-500 text-a'>
                          //           {userOrg.organization.description}
                          //         </p>
                          //       )}
                          //     </div>
                          //   </div>
                          //   {userOrg.isOwner && (
                          //     <span className='inline-flex absolute top-3 right-3 items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500'>
                          //       Владелец
                          //     </span>
                          //   )}
                          // </button>
                        ))}
                      </div>
                      <div className='w-28 h-px mx-auto bg-gray-300 dark:bg-neutral-700' />
                    </>
                  )}
                </div>

                <Link
                  onClick={() => hapticFeedback.impactOccurred('light')}
                  to='/organization-create'
                  className='py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 sm:text-sm font-medium rounded-lg border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-indigo-700'
                >
                  Создать новый склад
                </Link>
              </div>
            </div>
          </div>
        </main>
        {/* ========== END MAIN CONTENT ========== */}
        {/* <footer className='mt-auto h-23 sm:h-16 absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 dark:bg-neutral-900 dark:border-neutral-700'>
          <div className='w-full max-w-5xl py-6 mx-auto px-4 sm:px-6 lg:px-8'>
            <ul className='flex flex-wrap justify-center items-center whitespace-nowrap gap-3'>
              <li className='inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600'>
                © 2025 Preline Labs.
              </li>
              <li className='inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600'>
                <a
                  className='text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200'
                  href='#'
                >
                  Terms
                </a>
              </li>
              <li className='inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600'>
                <a
                  className='text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200'
                  href='#'
                >
                  Privacy
                </a>
              </li>
              <li className='inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600'>
                <a
                  className='text-xs text-gray-500 underline-offset-4 hover:underline hover:text-gray-800 focus:outline-hidden focus:underline focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200'
                  href='#'
                >
                  Your Privacy Choices
                </a>
              </li>
              <li className='inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600'>
                <button
                  type='button'
                  className='hs-dark-mode-active:hidden flex hs-dark-mode items-center gap-x-1.5 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200'
                  data-hs-theme-click-value='dark'
                >
                  <svg
                    className='shrink-0 size-4'
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                  </svg>
                  <span className='sr-only'>Dark mode</span>
                </button>
                <button
                  type='button'
                  className='hs-dark-mode-active:flex hidden hs-dark-mode items-center gap-x-1.5 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200'
                  data-hs-theme-click-value='light'
                >
                  <svg
                    className='shrink-0 size-4'
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle
                      cx={12}
                      cy={12}
                      r={4}
                    />
                    <path d='M12 2v2' />
                    <path d='M12 20v2' />
                    <path d='m4.93 4.93 1.41 1.41' />
                    <path d='m17.66 17.66 1.41 1.41' />
                    <path d='M2 12h2' />
                    <path d='M20 12h2' />
                    <path d='m6.34 17.66-1.41 1.41' />
                    <path d='m19.07 4.93-1.41 1.41' />
                  </svg>
                  <span className='sr-only'>Light mode</span>
                </button>
              </li>
            </ul>
          </div>
        </footer> */}
      </>
    </Page>
  )
}

export default OrganizationManagementPage
