import React, { useEffect, useState } from 'react'
import { Page } from '@/components/Page'
import {
  useAvailableOrganizations,
  useCreateOrganization,
  useJoinOrganization
} from '@/entitites/organization/api/organization.api'
import { ICreateOrganization, IUserOrganization, IOrganization } from '@/entitites/organization/model/organization.type'
import { Warehouse } from 'lucide-react'
import Loader from '@/shared/loader/ui/Loader'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { Link, useNavigate } from 'react-router-dom'
import OrganizationItem from '../../ui/organization-item/OrganizationItem'

const OrganizationChangePage: React.FC = () => {
  const navigate = useNavigate()
  const { data: availableData, isLoading, isPending } = useAvailableOrganizations()
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

  if (isLoading || isPending || isJoining) {
    return <Loader />
  }

  return (
    <Page className='!p-0'>
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
                        Создайте свой первый склад для управления
                      </p>
                    </div>
                  )}

                  {invitedOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>Приглашения</p>
                      {invitedOrganizations.map(organization => (
                        <button
                          className='py-3 px-3 relative w-full inline-flex  items-center gap-x-1.5 sm:text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-green-700 dark:text-neutral-300'
                          onClick={() => handleJoinOrganization(organization)}
                        >
                          <span className='inline-flex absolute top-3 right-3 items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500'>
                            Приглашение
                          </span>
                          <div className='flex gap-x-3'>
                            <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
                              <Warehouse
                                className='shrink-0 size-5'
                                strokeWidth={1.5}
                              />
                            </span>

                            <div className='grow'>
                              <div className='font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500'>
                                {organization.name}
                              </div>
                              {organization.description && (
                                <p className='text-xs text-gray-500 dark:text-neutral-500 text-a'>
                                  {organization.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {myOrganizations?.length > 0 && (
                    <>
                      <p className='mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center'>
                        Выберите склад для просмотра и управления или создай новый
                      </p>
                      <div className='flex flex-col gap-2'>
                        {myOrganizations.map(userOrg => (
                          <OrganizationItem
                            key={userOrg.organizationId}
                            data={userOrg}
                            handleSelectOrganization={handleSelectOrganization}
                            variant='change'
                          />
                        ))}
                      </div>
                      <div className='w-28 h-px mx-auto bg-gray-300 dark:bg-neutral-700' />
                    </>
                  )}
                </div>
                {/* End Guest Checkout Details */}
                <div className='sticky bottom-4'>
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
          </div>
        </main>
      </>
    </Page>
  )
}

export default OrganizationChangePage
