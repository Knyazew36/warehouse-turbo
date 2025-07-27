import React, { useState, useEffect } from 'react'
import { Page } from '@/components/Page'
import { useCreateOrganization } from '@/entitites/organization/api/organization.api'
import { ICreateOrganization } from '@/entitites/organization/model/organization.type'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { Building2, ArrowLeft, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import InfoMessage from '@/shared/ui/info/ui/Info'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

const OrganizationCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: createOrganization, isPending } = useCreateOrganization()
  const { setOrganizationLoading, clearCache } = useOrganizationStore()
  const [formData, setFormData] = useState<ICreateOrganization>({
    name: '',
    description: ''
  })

  // Сбрасываем состояние загрузки при монтировании компонента
  useEffect(() => {
    setOrganizationLoading(false)
  }, [setOrganizationLoading])

  const handleCreateOrganization = () => {
    if (!formData.name.trim()) {
      hapticFeedback.notificationOccurred('error')
      return
    }

    setOrganizationLoading(true)
    createOrganization(formData, {
      onSuccess: () => {
        setFormData({ name: '', description: '' })
        clearCache() // Очищаем кэш для обновления данных
        hapticFeedback.notificationOccurred('success')
        navigate('/organization-management')
      },
      onError: () => {
        setOrganizationLoading(false)
        hapticFeedback.notificationOccurred('error')
      }
    })
  }

  const handleBack = () => {
    setOrganizationLoading(false)
    navigate('/organization-management')
  }

  return (
    <Page>
      <div className='flex items-center space-x-3 border-b border-gray-200 dark:border-neutral-700 pb-4 mb-8'>
        <button
          onClick={handleBack}
          className='p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors'
        >
          <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-neutral-400' />
        </button>
        <h2 className='font-bold text-lg sm:text-xl text-gray-800 dark:text-neutral-200'>Создать склад</h2>
      </div>

      <div className='space-y-6'>
        {/* Форма создания */}
        <div className='bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg'>
              <Building2 className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-neutral-100'>Новый склад</h2>
              <p className='text-sm text-gray-500 dark:text-neutral-400'>
                Создайте новый склад для управления товарами
              </p>
            </div>
          </div>

          <div className='space-y-4'>
            {/* Название */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2'>
                Название склада *
              </label>
              <input
                type='text'
                placeholder='Введите название склада'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 transition-colors'
                disabled={isPending}
              />
            </div>

            {/* Описание */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2'>Описание</label>
              <textarea
                placeholder='Краткое описание склада (необязательно)'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 transition-colors resize-none'
                rows={4}
                disabled={isPending}
              />
            </div>

            {/* Кнопки */}
            <div className='flex space-x-3 pt-4'>
              <button
                onClick={handleCreateOrganization}
                disabled={isPending || !formData.name.trim()}
                className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
              >
                {isPending ? 'Создание...' : 'Создать склад'}
              </button>
              <button
                onClick={handleBack}
                disabled={isPending}
                className='px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
              >
                Отмена
              </button>
            </div>
          </div>
        </div>

        {/* Информация */}
        <InfoMessage
          title='Что происходит после создания?'
          items={[
            'Вы станете владельцем склада',
            'Сможете добавлять товары и управлять ими',
            'Сможете приглашать других пользователей',
            'Получите полный доступ к настройкам'
          ]}
        />
      </div>
    </Page>
  )
}

export default OrganizationCreatePage
