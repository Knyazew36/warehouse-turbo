import { Page } from '@/components/Page'
import { useUserDelete, useUsersEmployees } from '@/entitites/user/api/user.api'
import UserCard from '@/entitites/user/ui/user-card/UserCard'
import UserTable from '@/entitites/user/ui/user-table/UserTable'
import Empty from '@/shared/empty/ui/Empty'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import Loader from '@/shared/loader/ui/Loader'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

const StaffPage = () => {
  const { data: employees, isLoading } = useUsersEmployees()
  const { role } = useAuthStore()
  const { isPending } = useUserDelete()
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'tile' | 'table'>('tile')

  const handleViewChange = (view: 'tile' | 'table') => {
    setView(view)
  }
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return employees
    return employees?.filter(
      item =>
        item.data?.username?.toLowerCase().includes(term) ||
        item.data?.first_name?.toLowerCase().includes(term) ||
        item.data?.last_name?.toLowerCase().includes(term)
    )
  }, [employees, searchTerm, isPending])

  if (isLoading) return <Loader />

  return (
    <Page back>
      <PageHeader title='Сотрудники' />
      <div className=' space-y-3 mb-8'>
        <input
          type='text'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
          placeholder='Поиск сотрудника...'
        />
      </div>

      {filteredData && filteredData.length > 0 && (
        <div className='flex bg-gray-100 rounded-lg p-0.5 dark:bg-neutral-800 w-max mt-8 ml-auto mb-4'>
          <div className='flex gap-x-0.5 md:gap-x-1'>
            <button
              type='button'
              className={clsx(
                'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent text-xs md:text-[13px] text-gray-800 border border-transparent hover:border-gray-400 focus:outline-hidden focus:border-gray-400 font-medium rounded-md px-1.5 sm:px-2 py-2 dark:text-neutral-200 dark:hover:text-white dark:hover:border-neutral-500 dark:focus:text-white dark:focus:border-neutral-500 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent ',
                view === 'tile' && 'active'
              )}
              aria-selected='true'
              data-hs-tab='#example-tab-preview'
              aria-controls='example-tab-preview'
              role='tab'
              onClick={() => {
                handleViewChange('tile')
                hapticFeedback.selectionChanged()
              }}
            >
              Плитка
            </button>
            <button
              type='button'
              className={clsx(
                'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent text-xs md:text-[13px] text-gray-800 border border-transparent hover:border-gray-400 focus:outline-hidden focus:border-gray-400 font-medium rounded-md px-1.5 sm:px-2 py-2 dark:text-neutral-200 dark:hover:text-white dark:hover:border-neutral-500 dark:focus:text-white dark:focus:border-neutral-500 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent ',
                view === 'table' && 'active'
              )}
              id='example-tab-html-item'
              aria-selected='true'
              data-hs-tab='#example-tab-html'
              aria-controls='example-tab-html'
              role='tab'
              onClick={() => {
                handleViewChange('table')
                hapticFeedback.selectionChanged()
              }}
            >
              Таблица
            </button>
          </div>
        </div>
      )}

      {filteredData &&
        view === 'tile' &&
        filteredData.length > 0 &&
        filteredData.map(item => (
          <UserCard
            role={role}
            key={item.id}
            data={item}
          />
        ))}

      {filteredData && view === 'table' && filteredData.length > 0 && <UserTable data={filteredData} />}

      {filteredData && filteredData.length === 0 && <Empty title='Сотрудники не найдены' />}
    </Page>
  )
}

export default StaffPage
