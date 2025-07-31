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
                      <h2 className='font-medium text-xl text-gray-800 dark:text-neutral-200'>Мои склады</h2>
                    </div>
                  )}

                  {allOrganizations.length === 0 && (
                    <div className='text-center'>
                      <h2 className='font-medium text-xl text-gray-800 dark:text-neutral-200'>У вас нет складов</h2>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500'>
                        Создайте свой первый склад для управления.
                      </p>
                    </div>
                  )}

                  {invitedOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>Приглашения</p>
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
                        ))}
                      </div>
                      <div className='w-28 h-px mx-auto bg-gray-300 dark:bg-neutral-700' />
                    </>
                  )}
                </div>

                <div className='sticky bottom-4'>
                  <Link
                    onClick={() => hapticFeedback.impactOccurred('light')}
                    to='/organization-create'
                    className='py-3 transition-transform duration-150 ease-in-out active:scale-95 select-none px-4 w-full inline-flex justify-center items-center gap-x-2 sm:text-sm font-medium rounded-lg border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-indigo-700'
                  >
                    Создать новый склад
                  </Link>
                </div>

                {allOrganizations.length === 0 && (
                  <>
                    <div className='w-28 h-px mx-auto bg-gray-300 dark:bg-neutral-700 mt-8' />
                    <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>
                      Если вы только что авторизовались, и вы ожидаете приглашения в склад, то необходимо дождаться
                      уведомления в боте об успешной авторизации и обновить страницу.
                    </p>

                    <button
                      onClick={() => {
                        hapticFeedback.impactOccurred('light')
                        window.location.reload()
                      }}
                      className='py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 sm:text-sm font-medium rounded-lg border border-transparent bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-yellow-700'
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
