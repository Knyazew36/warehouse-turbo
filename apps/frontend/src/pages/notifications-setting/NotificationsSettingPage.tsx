import { Page } from '@/components/Page'
import { Checkbox } from '@/components/ui/checkbox'
import { Role } from '@/entitites/user/model/user.type'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { getRole } from '@/shared/utils/getRole'
import React, { useState, useEffect } from 'react'
import {
  useOrganizationById,
  useUpdateNotificationSettings
} from '@/entitites/organization/api/organization.api'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'
import Divide from '@/shared/ui/divide/ui/Divide'
import { Controller, useForm } from 'react-hook-form'

interface FormData {
  daysOfWeek: number[]
}

const NotificationsSettingPage = () => {
  const { organizationId } = useOrganizationStore()
  const { mutate: updateNotificationSettings, isPending } = useUpdateNotificationSettings()
  const { data, isFetching, isLoading } = useOrganizationById(Number(organizationId))

  const { control, reset, setValue } = useForm<FormData>({
    defaultValues: {
      daysOfWeek: data?.settings?.notifications?.daysOfWeek
    }
  })

  useEffect(() => {
    if (data?.settings?.notifications) {
      reset({ daysOfWeek: data?.settings?.notifications?.daysOfWeek })
    }
  }, [data])

  const [enabled, setEnabled] = useState(data?.settings?.notifications?.enabled)

  const handleEnabled = () => {
    setEnabled(prev => !prev)
  }

  const daysOfWeek = [
    { value: 1, label: 'Понедельник', short: 'Пн' },
    { value: 2, label: 'Вторник', short: 'Вт' },
    { value: 3, label: 'Среда', short: 'Ср' },
    { value: 4, label: 'Четверг', short: 'Чт' },
    { value: 5, label: 'Пятница', short: 'Пт' },
    { value: 6, label: 'Суббота', short: 'Сб' },
    { value: 0, label: 'Воскресенье', short: 'Вс' }
  ]

  return (
    <Page
      back
      isLoading={isLoading || isFetching}
    >
      <PageHeader title='Настройки уведомлений' />
      <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-2xs md:p-8 dark:border-neutral-700 dark:bg-neutral-800'>
        {/* Title */}
        <div className='mb-4 xl:mb-8'>
          <p className='text-sm text-gray-500 dark:text-neutral-500'>
            Вы можете настроить уведомления для различных событий.
          </p>
        </div>
        {/* End Title */}
        {/* Notifications */}
        <div className='space-y-8'>
          {/* Notifications */}
          <div className='space-y-5'>
            <div>
              <h4 className='font-medium text-gray-800 dark:text-neutral-200'>Не беспокоить</h4>
              <div className='mt-3'>
                {/* checked={enabled}
              onChange={e => setEnabled(e.target.checked)} */}
                <button
                  onClick={handleEnabled}
                  type='button'
                  className={clsx(
                    'inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
                    !enabled && '!bg-gray-50'
                  )}
                >
                  <svg
                    className='size-3.5 shrink-0'
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
                    <path d='M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5' />
                    <path d='M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7' />
                    <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
                    <path d='m2 2 20 20' />
                  </svg>
                  Отключить уведомления
                </button>
              </div>
            </div>
            <Divide />
            <ul className='grid rounded-lg bg-gray-100 p-3 md:grid-cols-5 md:gap-x-6 md:p-5 dark:bg-neutral-700'>
              {/* Item */}
              <li className='md:col-span-2'>
                <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>
                  Уведомление о минимальном остатке товара
                </h3>
              </li>
            </ul>
            {/* End List */}
            {/* List */}
            <ul className='grid gap-1.5 px-3 md:grid-cols-5 md:items-center md:gap-6 md:px-5'>
              {/* Item */}
              <li className='md:col-span-2'>
                <p className='text-sm text-gray-500 dark:text-neutral-500'>
                  Уведомление о минимальном остатке товара будет отправлено в Telegram бот.
                  Указанным ниже сотрудникам:
                </p>
              </li>

              <li className='col-span-1'>
                <div className='grid grid-cols-2 items-center md:block'>
                  <span className='text-sm text-gray-500 md:hidden dark:text-neutral-200'>
                    Email
                  </span>
                  <div className='text-end md:text-center'>
                    <input
                      type='checkbox'
                      className='shrink-0 rounded-sm border-gray-300 text-blue-600 checked:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800'
                      defaultChecked
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-medium text-gray-800 dark:text-neutral-200'>Время уведомлений</h4>
            <div className='mt-3'>
              {/* Input Group */}
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                {/* <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='size-3.5 shrink-0 rounded-sm border-gray-300 text-blue-600 checked:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800'
                    id='hs-pro-danscch'
                  />
                  <label
                    htmlFor='hs-pro-danscch'
                    className='ms-2 text-sm text-gray-500 dark:text-neutral-500'
                  >
                    Do not notify me from:
                  </label>
                </div> */}
                <div className='flex items-center gap-x-2'>
                  <input
                    type='text'
                    className='max-w-24 rounded-lg border-gray-200 px-3 py-1.5 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600'
                    defaultValue='5:00pm'
                  />
                  {/* <span className='text-sm text-gray-500 dark:text-neutral-500'>to:</span>
                  <input
                    type='text'
                    className='max-w-24 rounded-lg border-gray-200 px-3 py-1.5 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600'
                    defaultValue='9:00am'
                  /> */}
                </div>
              </div>
              {/* End Input Group */}
            </div>
          </div>
          <div>
            <h4 className='font-medium text-gray-800 dark:text-neutral-200'>
              Отправлять уведомления в следующие дни:
            </h4>
            <div className='mt-3'>
              <div className='grid gap-1 rounded-lg shadow-2xs sm:inline-flex'>
                {daysOfWeek.map(day => (
                  <Controller
                    name={`daysOfWeek.${day.value}`}
                    control={control}
                    render={({ field }) => (
                      <label
                        key={day.value}
                        className='relative flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-center text-[13px] text-gray-800 ring-1 ring-transparent hover:border-blue-600 hover:ring-blue-600 has-checked:border-blue-200 has-checked:bg-blue-100 has-checked:text-blue-800 has-checked:ring-blue-200 has-disabled:pointer-events-none has-disabled:text-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:ring-neutral-600 dark:has-checked:border-blue-800/50 dark:has-checked:bg-blue-800/30 dark:has-checked:text-blue-500 dark:has-checked:ring-blue-800/50 dark:has-disabled:text-neutral-700'
                      >
                        <input
                          type='checkbox'
                          className='peer hidden'
                          checked={Boolean(field.value)}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <span className='flex size-0 shrink-0 items-center justify-center rounded-full bg-blue-500 text-transparent transition-all duration-200 peer-checked:me-1.5 peer-checked:size-4 peer-checked:text-white'>
                          <svg
                            className='size-2.5 shrink-0'
                            xmlns='http://www.w3.org/2000/svg'
                            width={24}
                            height={24}
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={4}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M20 6 9 17l-5-5' />
                          </svg>
                        </span>
                        <span className='block'>{day.label}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default NotificationsSettingPage
