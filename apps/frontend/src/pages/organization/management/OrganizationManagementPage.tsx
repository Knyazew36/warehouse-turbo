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

  console.info('availableData', availableData)
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
  console.info('allOrganizations', allOrganizations)
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
          <div className='mx-auto w-full max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-20'>
            <div className='mx-auto w-full max-w-sm'>
              <div className='space-y-10'>
                {/* Guest Checkout Details */}
                <div className='space-y-6'>
                  {allOrganizations.length > 0 && (
                    <div className='text-center'>
                      <h2 className='text-xl font-medium text-gray-800 dark:text-neutral-200'>
                        Мои склады
                      </h2>
                    </div>
                  )}

                  {allOrganizations.length === 0 && (
                    <div className='text-center'>
                      <h2 className='text-xl font-medium text-gray-800 dark:text-neutral-200'>
                        У вас нет складов
                      </h2>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500'>
                        Создайте свой первый склад для управления.
                      </p>
                    </div>
                  )}

                  {invitedOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-center text-sm text-gray-500 dark:text-neutral-500'>
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
                      <p className='mt-1 text-center text-sm text-gray-500 dark:text-neutral-500'>
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
                        ))}
                      </div>
                      <div className='mx-auto h-px w-28 bg-gray-300 dark:bg-neutral-700' />
                    </>
                  )}
                </div>

                <div className='sticky bottom-4'>
                  <Link
                    onClick={() => hapticFeedback.impactOccurred('light')}
                    to='/organization-create'
                    className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white transition-transform duration-150 ease-in-out select-none hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-sm'
                  >
                    Создать новый склад
                  </Link>
                </div>

                {allOrganizations.length === 0 && (
                  <>
                    <div className='mx-auto mt-8 h-px w-28 bg-gray-300 dark:bg-neutral-700' />
                    <p className='mt-1 text-center text-sm text-gray-500 dark:text-neutral-500'>
                      Если вы только что авторизовались, и вы ожидаете приглашения в склад, то
                      необходимо дождаться уведомления в боте об успешной авторизации и обновить
                      страницу.
                    </p>

                    <button
                      onClick={() => {
                        hapticFeedback.impactOccurred('light')
                        window.location.reload()
                      }}
                      className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-yellow-600 px-4 py-3 font-medium text-white hover:bg-yellow-700 focus:bg-yellow-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:text-sm'
                    >
                      Обновить
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    </Page>
  )
}

export default OrganizationManagementPage
