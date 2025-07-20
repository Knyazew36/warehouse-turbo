import React, { useState } from 'react'
import { Page } from '@/components/Page'
import { useMyOrganizations, useCreateOrganization } from '@/entitites/organization/api/organization.api'
import { ICreateOrganization, IUserOrganization } from '@/entitites/organization/model/organization.type'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Users, Settings } from 'lucide-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import Empty from '@/shared/empty/ui/Empty'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import OrganizationSelector from '@/entitites/organization/ui/organization-selector/OrganizationSelector'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { useNavigate } from 'react-router-dom'

const OrganizationManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: organizations = [], isLoading } = useMyOrganizations()
  const { mutate: createOrganization, isPending } = useCreateOrganization()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { currentOrganization, setCurrentOrganization, setOrganizationId } = useOrganizationStore()

  const [formData, setFormData] = useState<ICreateOrganization>({
    name: '',
    description: ''
  })

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
    setOrganizationId(organization.id)
    navigate('/menu')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back>
      <PageHeader title='Управление организациями' />

      <div className='space-y-4'>
        {/* Кнопка создания новой организации */}
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

        {/* Форма создания организации */}
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
                  disabled={isPending || !formData.name.trim()}
                  className='flex-1'
                >
                  {isPending ? 'Создание...' : 'Создать'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setShowCreateForm(false)}
                  disabled={isPending}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Список организаций */}
        {organizations.length > 0 ? (
          <div className='grid gap-4'>
            {organizations.map(userOrg => (
              <div
                onClick={() => handleSelectOrganization(userOrg)}
                key={userOrg.id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-700'
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
                  <div className='flex space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        hapticFeedback.impactOccurred('light')
                        // TODO: Навигация к управлению пользователями
                      }}
                    >
                      <Users className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        hapticFeedback.impactOccurred('light')
                        // TODO: Навигация к настройкам
                      }}
                    >
                      <Settings className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title='У вас пока нет организаций' />
        )}
      </div>
    </Page>
  )
}

export default OrganizationManagementPage
