import React from 'react'
import { useAvailableOrganizations, useJoinOrganization } from '../../api/organization.api'
import { useOrganizationStore, useOrganizationId } from '../../model/organization.store'
import { IUserOrganization, IOrganization } from '../../model/organization.type'
import { ChevronDown, Building2, Plus, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useQueryClient } from '@tanstack/react-query'

const OrganizationSelector: React.FC = () => {
  const { data, isLoading } = useAvailableOrganizations()
  const { currentOrganization, setCurrentOrganization, clearCache } = useOrganizationStore()
  const organizationId = useOrganizationId()
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'my' | 'invited'>('my')
  const [isChangingOrganization, setIsChangingOrganization] = React.useState(false)
  const queryClient = useQueryClient()

  const navigate = useNavigate()
  const joinOrganization = useJoinOrganization()

  const myOrganizations = data?.myOrganizations || []
  const invitedOrganizations = data?.invitedOrganizations || []

  const handleSelectOrganization = async (organization: IUserOrganization) => {
    setIsChangingOrganization(true)

    // Очищаем кэш всех данных, которые зависят от организации
    clearCache()

    setCurrentOrganization(organization)
    setIsOpen(false)

    // Небольшая задержка для показа состояния загрузки
    await new Promise(resolve => setTimeout(resolve, 100))

    navigate(`/menu`)
    setIsChangingOrganization(false)
  }

  const handleJoinOrganization = async (organization: IOrganization) => {
    try {
      setIsChangingOrganization(true)
      await joinOrganization.mutateAsync(organization.id)
      hapticFeedback.notificationOccurred('success')
      setIsOpen(false)

      // Очищаем кэш после присоединения к организации
      clearCache()

      // Небольшая задержка для показа состояния загрузки
      await new Promise(resolve => setTimeout(resolve, 100))

      // После присоединения перенаправляем в меню
      navigate(`/menu`)
    } catch (error) {
      hapticFeedback.notificationOccurred('error')
      console.error('Error joining organization:', error)
    } finally {
      setIsChangingOrganization(false)
    }
  }

  if (isLoading || isChangingOrganization) {
    return (
      <div className='flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg dark:bg-neutral-800'>
        <div className='w-4 h-4 bg-gray-300 rounded animate-pulse'></div>
        <div className='w-24 h-4 bg-gray-300 rounded animate-pulse'></div>
        {isChangingOrganization && (
          <div className='text-xs text-gray-500 dark:text-neutral-400 ml-2'>Смена организации...</div>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Заголовок */}
      <div className='text-sm font-medium text-gray-700 dark:text-neutral-300'>Выберите склад</div>

      {/* Селектор организаций */}
      {(myOrganizations.length > 0 || invitedOrganizations.length > 0) && (
        <div className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isChangingOrganization}
            className='flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Building2 className='w-4 h-4 text-gray-600 dark:text-neutral-400' />
            <span className='text-sm font-medium text-gray-700 dark:text-neutral-300 flex-1 text-left'>
              {currentOrganization?.organization.name || 'Выберите организацию'}
            </span>
            <ChevronDown className='w-4 h-4 text-gray-600 dark:text-neutral-400' />
          </button>

          {isOpen && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-neutral-900 dark:border-neutral-700 max-h-80 overflow-hidden'>
              {/* Табы */}
              <div className='flex border-b border-gray-200 dark:border-neutral-700'>
                <button
                  onClick={() => setActiveTab('my')}
                  disabled={isChangingOrganization}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'my'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <div className='flex items-center space-x-1'>
                    <Building2 className='w-3 h-3' />
                    <span>Мои склады ({myOrganizations.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('invited')}
                  disabled={isChangingOrganization}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'invited'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <div className='flex items-center space-x-1'>
                    <Users className='w-3 h-3' />
                    <span>Приглашения ({invitedOrganizations.length})</span>
                  </div>
                </button>
              </div>

              {/* Контент табов */}
              <div className='max-h-60 overflow-y-auto'>
                {activeTab === 'my' && (
                  <div>
                    {myOrganizations.length === 0 ? (
                      <div className='px-3 py-4 text-center text-sm text-gray-500 dark:text-neutral-400'>
                        У вас пока нет созданных складов
                      </div>
                    ) : (
                      myOrganizations.map((org: IUserOrganization) => (
                        <button
                          key={org.id}
                          onClick={() => handleSelectOrganization(org)}
                          disabled={isChangingOrganization}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            organizationId === org.organizationId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className='text-sm font-medium text-gray-700 dark:text-neutral-300'>
                            {org.organization.name}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-neutral-500'>
                            {org.role} {org.isOwner && '(Владелец)'}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'invited' && (
                  <div>
                    {invitedOrganizations.length === 0 ? (
                      <div className='px-3 py-4 text-center text-sm text-gray-500 dark:text-neutral-400'>
                        У вас нет приглашений в склады
                      </div>
                    ) : (
                      invitedOrganizations.map((org: IOrganization) => (
                        <div
                          key={org.id}
                          className='px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='text-sm font-medium text-gray-700 dark:text-neutral-300'>{org.name}</div>
                              <div className='text-xs text-gray-500 dark:text-neutral-500'>Приглашение</div>
                            </div>
                            <button
                              onClick={() => handleJoinOrganization(org)}
                              disabled={joinOrganization.isPending || isChangingOrganization}
                              className='flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                              <Plus className='w-3 h-3' />
                              <span>Присоединиться</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Сообщение если нет организаций */}
      {myOrganizations.length === 0 && invitedOrganizations.length === 0 && (
        <div className='text-center py-8'>
          <Building2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <div className='text-sm text-gray-500 dark:text-neutral-400'>У вас пока нет доступных складов</div>
          <div className='text-xs text-gray-400 dark:text-neutral-500 mt-1'>
            Создайте новый склад или дождитесь приглашения
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationSelector
