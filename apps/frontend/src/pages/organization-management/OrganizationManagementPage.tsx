import React, { useEffect, useState } from 'react'
import { Page } from '@/components/Page'
import {
  useAvailableOrganizations,
  useCreateOrganization,
  useJoinOrganization
} from '@/entitites/organization/api/organization.api'
import { ICreateOrganization, IUserOrganization, IOrganization } from '@/entitites/organization/model/organization.type'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Users, Settings, UserPlus } from 'lucide-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import Empty from '@/shared/empty/ui/Empty'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import OrganizationSelector from '@/entitites/organization/ui/organization-selector/OrganizationSelector'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { useNavigate } from 'react-router-dom'

const OrganizationManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: availableData, isLoading } = useAvailableOrganizations()
  const { mutate: createOrganization, isPending: isCreating } = useCreateOrganization()
  const { mutate: joinOrganization, isPending: isJoining } = useJoinOrganization()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [autoJoining, setAutoJoining] = useState(false)
  const { currentOrganization, setCurrentOrganization, setOrganizationId, organizationId } = useOrganizationStore()

  const [formData, setFormData] = useState<ICreateOrganization>({
    name: '',
    description: ''
  })

  // Извлекаем данные из ответа API
  const myOrganizations = availableData?.myOrganizations || []
  const invitedOrganizations = availableData?.invitedOrganizations || []
  const allOrganizations = [...myOrganizations, ...invitedOrganizations]

  console.info('availableData', availableData)

  // useEffect(() => {
  //   // Если у пользователя только одна организация (созданная или приглашенная) и он еще не выбрал организацию, автоматически выбираем её
  //   if (allOrganizations.length === 1 && !organizationId) {
  //     if (myOrganizations.length === 1) {
  //       handleSelectOrganization(myOrganizations[0])
  //     } else if (invitedOrganizations.length === 1) {
  //       // Если есть только приглашение, автоматически присоединяемся
  //       setAutoJoining(true)
  //       setTimeout(() => {
  //         handleJoinOrganization(invitedOrganizations[0])
  //       }, 1000) // Небольшая задержка, чтобы пользователь увидел приглашение
  //     }
  //   }
  // }, [allOrganizations, myOrganizations, invitedOrganizations, organizationId])

  // Если пользователь уже выбрал организацию и у него только одна, перенаправляем на меню
  // useEffect(() => {
  //   if (organizationId && allOrganizations.length === 1 && !currentOrganization?.role) {
  //     navigate('/menu')
  //   }
  // }, [organizationId, allOrganizations.length, navigate])

  const handleCreateOrganization = () => {
    if (!formData.name.trim()) {
      return
    }

    createOrganization(formData, {
      onSuccess: () => {
        setFormData({ name: '', description: '' })
        setShowCreateForm(false)
        hapticFeedback.notificationOccurred('success')
      },
      onError: () => {
        hapticFeedback.notificationOccurred('error')
      }
    })
  }

  const handleSelectOrganization = (organization: IUserOrganization) => {
    setCurrentOrganization(organization)
    setOrganizationId(organization.organizationId)
    navigate('/menu')
  }

  const handleJoinOrganization = (organization: IOrganization) => {
    joinOrganization(organization.organizationId, {
      onSuccess: userOrg => {
        hapticFeedback.notificationOccurred('success')
        setAutoJoining(false)
        // После присоединения автоматически выбираем эту организацию
        setCurrentOrganization(userOrg)
        setOrganizationId(userOrg.organizationId)
        navigate('/menu')
      },
      onError: () => {
        hapticFeedback.notificationOccurred('error')
        setAutoJoining(false)
      }
    })
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back={!!currentOrganization}>
      <PageHeader title='Управление организациями' />

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-neutral-200'>Мои организации</h2>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className='flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Создать организацию</span>
          </Button>
        </div>

        {showCreateForm && (
          <div className='bg-white border border-gray-200 rounded-lg p-4 dark:bg-neutral-900 dark:border-neutral-700'>
            <h3 className='text-md font-medium text-gray-800 dark:text-neutral-200 mb-3'>Новая организация</h3>
            <div className='space-y-3'>
              <input
                type='text'
                placeholder='Название организации'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200'
              />
              <textarea
                placeholder='Описание (необязательно)'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200'
                rows={3}
              />
              <div className='flex space-x-2'>
                <Button
                  onClick={handleCreateOrganization}
                  disabled={isCreating || !formData.name.trim()}
                  className='flex-1'
                >
                  {isCreating ? 'Создание...' : 'Создать'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setShowCreateForm(false)}
                  disabled={isCreating}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Список организаций пользователя */}
        {myOrganizations.length > 0 && (
          <div className='space-y-4'>
            <h3 className='text-md font-medium text-gray-700 dark:text-neutral-300'>Ваши организации</h3>
            <div className='grid gap-4'>
              {myOrganizations.map(userOrg => (
                <div
                  onClick={() => handleSelectOrganization(userOrg)}
                  key={userOrg.id}
                  className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-neutral-900 dark:border-neutral-700'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <Building2 className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                        <h3 className='text-lg font-medium text-gray-800 dark:text-neutral-200'>
                          {userOrg.organization.name}
                        </h3>
                        {userOrg.isOwner && (
                          <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-400'>
                            Владелец
                          </span>
                        )}
                      </div>
                      {userOrg.organization.description && (
                        <p className='text-sm text-gray-600 dark:text-neutral-400 mb-2'>
                          {userOrg.organization.description}
                        </p>
                      )}
                      <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-neutral-500'>
                        <span>Роль: {userOrg.role}</span>
                        <span>Создана: {new Date(userOrg.organization.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Список приглашенных организаций */}
        {invitedOrganizations.length > 0 && (
          <div className='space-y-4'>
            <h3 className='text-md font-medium text-gray-700 dark:text-neutral-300'>
              Приглашения в организации
              {autoJoining && (
                <span className='ml-2 text-sm text-blue-600 dark:text-blue-400'>(Автоматическое присоединение...)</span>
              )}
            </h3>
            <div className='grid gap-4'>
              {invitedOrganizations.map(organization => (
                <div
                  key={organization.id}
                  className='bg-white border border-gray-200 rounded-lg p-4 dark:bg-neutral-900 dark:border-neutral-700'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <Building2 className='w-5 h-5 text-green-600 dark:text-green-400' />
                        <h3 className='text-lg font-medium text-gray-800 dark:text-neutral-200'>{organization.name}</h3>
                        <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400'>
                          Приглашение
                        </span>
                      </div>
                      {organization.description && (
                        <p className='text-sm text-gray-600 dark:text-neutral-400 mb-2'>{organization.description}</p>
                      )}
                      <div className='text-sm text-gray-500 dark:text-neutral-500'>
                        <span>Создана: {new Date(organization.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinOrganization(organization)}
                      disabled={isJoining || autoJoining}
                      className='flex items-center space-x-2'
                    >
                      <UserPlus className='w-4 h-4' />
                      <span>
                        {isJoining
                          ? 'Присоединение...'
                          : autoJoining
                            ? 'Автоматическое присоединение...'
                            : 'Присоединиться'}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {allOrganizations.length === 0 && <Empty title='У вас пока нет организаций' />}
      </div>
    </Page>
  )
}

export default OrganizationManagementPage
