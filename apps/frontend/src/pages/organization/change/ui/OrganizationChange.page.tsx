import React, { useState, useEffect } from 'react'
import { Page } from '@/components/Page'
import {
  getOrganizationById,
  useUpdateOrganization
} from '@/entitites/organization/api/organization.api'
import {
  ICreateOrganization,
  IOrganization,
  IUpdateOrganization
} from '@/entitites/organization/model/organization.type'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { Building2, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import InfoMessage from '@/shared/ui/info/ui/Info'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import ButtonAction from '@/shared/button-action/ButtonAction'
import { apiDomain } from '@/shared/api/model/constants'
import { $api } from '@/shared/api'
import { useForm } from 'react-hook-form'
import Loader from '@/shared/loader/ui/Loader'

const OrganizationChangePage: React.FC = () => {
  const [data, setData] = useState<IOrganization | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: updateOrganization, isPending } = useUpdateOrganization()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ICreateOrganization>()

  const { id } = useParams()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setIsLoading(true)
    const res = await getOrganizationById({ id: Number(id) })
    setValue('name', res.name)
    setValue('description', res.description || '')
    setData(res)
    setIsLoading(false)
  }

  const onSubmit = (data: IUpdateOrganization) => {
    updateOrganization(
      { id: Number(id), data },
      {
        onSuccess: () => {
          hapticFeedback.notificationOccurred('success')
          navigate('/organization-management')
        },
        onError: () => {
          hapticFeedback.notificationOccurred('error')
        }
      }
    )
  }

  const handleCancel = () => {
    setValue('name', data?.name || '')
    setValue('description', data?.description || '')
  }
  if (isLoading) {
    return <Loader />
  }

  return (
    <Page>
      <PageHeader title='Изменить склад' />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {/* Форма создания */}
        <div className='bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg'>
              <Building2 className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <p className='text-sm text-gray-500 dark:text-neutral-400'>
                Вы можете изменить название и описание склада
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
                {...register('name')}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 transition-colors'
              />
            </div>

            {/* Описание */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2'>
                Описание
              </label>
              <textarea
                placeholder='Краткое описание склада (необязательно)'
                {...register('description')}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 transition-colors resize-none'
                rows={4}
                // disabled={isPending}
              />
            </div>
          </div>
        </div>
      </form>
      <ButtonAction
        isLoading={isPending}
        onSuccessClick={handleSubmit(onSubmit)}
        onCancelClick={handleCancel}
      />
    </Page>
  )
}

export default OrganizationChangePage
