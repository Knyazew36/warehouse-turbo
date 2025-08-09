import { Page } from '@/components/Page'
import { Checkbox } from '@/components/ui/checkbox'
import { Role } from '@/entitites/user/model/user.type'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { getRole } from '@/shared/utils/getRole'
import React, { useState, useEffect } from 'react'
import { useUpdateNotificationSettings } from '@/entitites/organization/api/organization.api'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { hapticFeedback } from '@telegram-apps/sdk-react'

const NotificationsSettingPage = () => {
  const { organizationId } = useOrganizationStore()
  const { mutate: updateNotificationSettings, isPending } = useUpdateNotificationSettings()

  const [enabled, setEnabled] = useState(true)
  const [notificationTime, setNotificationTime] = useState('09:00')
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([Role.OWNER, Role.ADMIN])
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]) // понедельник - пятница
  const [notifyOnNewArrivals, setNotifyOnNewArrivals] = useState(false)

  const daysOfWeek = [
    { value: 0, label: 'Воскресенье', short: 'Вс' },
    { value: 1, label: 'Понедельник', short: 'Пн' },
    { value: 2, label: 'Вторник', short: 'Вт' },
    { value: 3, label: 'Среда', short: 'Ср' },
    { value: 4, label: 'Четверг', short: 'Чт' },
    { value: 5, label: 'Пятница', short: 'Пт' },
    { value: 6, label: 'Суббота', short: 'Сб' }
  ]

  const handleRoleToggle = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleDayToggle = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const handleSave = () => {
    if (!organizationId) {
      hapticFeedback.notificationOccurred('error')
      return
    }

    const settings = {
      enabled,
      notificationTime,
      notificationRoles: selectedRoles,
      daysOfWeek: selectedDays,
      notifyOnNewArrivals
    }

    updateNotificationSettings(
      { id: organizationId, data: settings },
      {
        onSuccess: () => {
          hapticFeedback.notificationOccurred('success')
        },
        onError: () => {
          hapticFeedback.notificationOccurred('error')
        }
      }
    )
  }

  return (
    <Page back>
      <PageHeader title='Настройки уведомлений' />
      <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-2xs md:p-8 dark:border-neutral-700 dark:bg-neutral-800'>
        {/* Title */}
        <div className='mb-4 xl:mb-8'>
          <p className='text-sm text-gray-500 dark:text-neutral-500'>
            Настройте уведомления для вашего склада.
          </p>
        </div>
        {/* End Title */}
        {/* Notifications */}
        <div className='space-y-8'>
          {/* Основные настройки */}
          <div className='space-y-5'>
            {/* Включение/отключение уведомлений */}
            <div className='flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-neutral-700'>
              <div>
                <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>Уведомления</h3>
                <p className='text-sm text-gray-500 dark:text-neutral-500'>
                  Включить или отключить все уведомления
                </p>
              </div>
              <label className='relative inline-block h-6 w-11 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={enabled}
                  onChange={e => setEnabled(e.target.checked)}
                  className='peer sr-only'
                />
                <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
              </label>
            </div>

            {/* Время уведомлений */}
            <div className='space-y-3'>
              <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>
                Время уведомлений
              </h3>
              <div className='flex items-center gap-2'>
                <label className='text-sm text-gray-500 dark:text-neutral-500'>
                  Отправлять уведомления в:
                </label>
                <input
                  type='time'
                  value={notificationTime}
                  onChange={e => setNotificationTime(e.target.value)}
                  className='rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300'
                />
              </div>
            </div>

            {/* Дни недели */}
            <div className='space-y-3'>
              <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>Дни недели</h3>
              <div className='grid grid-cols-7 gap-2'>
                {daysOfWeek.map(day => (
                  <button
                    key={day.value}
                    type='button'
                    onClick={() => handleDayToggle(day.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      selectedDays.includes(day.value)
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Новые поступления */}
            <div className='flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-neutral-700'>
              <div>
                <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>
                  Уведомления о новых поступлениях
                </h3>
                <p className='text-sm text-gray-500 dark:text-neutral-500'>
                  Получать уведомления о новых товарах, добавленных за последние 24 часа
                </p>
              </div>
              <label className='relative inline-block h-6 w-11 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={notifyOnNewArrivals}
                  onChange={e => setNotifyOnNewArrivals(e.target.checked)}
                  className='peer sr-only'
                />
                <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
              </label>
            </div>
          </div>

          {/* Роли для уведомлений */}
          <div className='space-y-5'>
            <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>
              Роли для уведомлений
            </h3>
            <ul className='grid gap-1.5 px-3 md:grid-cols-5 md:items-center md:gap-6 md:px-5'>
              <li className='md:col-span-2'>
                <p className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
                  Уведомления о минимальном остатке товара:
                </p>
                <p className='text-sm text-gray-500 dark:text-neutral-500'>
                  Уведомление о минимальном остатке товара будет отправлено в Telegram бот.
                  Указанным ниже сотрудникам:
                </p>
              </li>

              {Object.values(Role).map(role => {
                if (role === Role.BLOCKED || role === Role.IT || role === Role.GUEST) return null

                return (
                  <li
                    key={role}
                    className='col-span-1'
                  >
                    <label className='flex items-center justify-between md:block'>
                      <span className='text-sm text-gray-500 md:hidden dark:text-neutral-200'>
                        {getRole(role)}
                      </span>
                      <Checkbox
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() => handleRoleToggle(role)}
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Кнопки действий */}
          <div className='flex gap-x-3'>
            <button
              type='button'
              onClick={handleSave}
              disabled={isPending}
              className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
            >
              {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button
              type='button'
              className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
            >
              Отмена
            </button>
          </div>
        </div>
        {/* End Notifications */}
      </div>
    </Page>
  )
}

export default NotificationsSettingPage
