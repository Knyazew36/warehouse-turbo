import { Page } from '@/components/Page'
import React, { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { hapticFeedback, initDataUser, openTelegramLink } from '@telegram-apps/sdk-react'
import AlertProductLowStock from '@/widgets/alert-product-low-stock/AlertProductLowStock'

import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { Role } from '@/entitites/user/model/user.type'

import MenuButton, { IMenuButton } from './menu-button/MenuButton'
import { useNavigate } from 'react-router-dom'
import { Info, MessageCircle, Package, Settings, UserPlus, WarehouseIcon } from 'lucide-react'
import { useUserRole } from '@/entitites/user/api/user.api'

import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import Loader from '@/shared/loader/ui/Loader'
import Header from '@/shared/ui/header/ui/Header'
import clsx from 'clsx'
import Divide from '@/shared/ui/divide/ui/Divide'

const MenuPage: FC = () => {
  const { isAdmin, isOwner, isIT, isOperator, role } = useAuthStore()
  const { currentOrganization, isOrganizationLoading, setOrganizationLoading } =
    useOrganizationStore()
  const user = initDataUser()
  const userId = user?.id?.toString()

  const {
    data: userRole,
    isLoading,
    isPending,
    error,
    isFetching
  } = useUserRole({ id: userId || '' })

  // Сбрасываем состояние загрузки организации после успешной загрузки роли или ошибки
  useEffect(() => {
    if ((!isLoading && !isPending && userRole) || error) {
      if (isOrganizationLoading) {
        setOrganizationLoading(false)
      }
    }
  }, [isLoading, isPending, userRole, error, isOrganizationLoading, setOrganizationLoading])

  // Если роль еще не загружена или организация загружается, показываем загрузку
  if (!role || isLoading || isPending || isOrganizationLoading) {
    return <Loader />
  }

  console.info(isAdmin, isOwner, isIT, isOperator, role)

  const menuButtons: IMenuButton[] = [
    {
      to: '/settings-warehouse',
      title: 'Товары',
      color: 'teal',
      isBlocked: isOperator,

      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='size-5 shrink-0 text-teal-600 xl:h-6 xl:w-6 dark:text-teal-500'
        >
          <path d='M14 17H5' />
          <path d='M19 7h-9' />
          <circle
            cx='17'
            cy='17'
            r='3'
          />
          <circle
            cx='7'
            cy='7'
            r='3'
          />
        </svg>
      )
    },
    {
      to: '/products',
      title: 'Остаток',
      color: 'indigo',
      icon: (
        <Package className='size-5 shrink-0 text-indigo-600 xl:h-6 xl:w-6 dark:text-indigo-500' />
      )
    },
    {
      to: '/incoming-statistics',
      title: 'Отчет',
      color: 'yellow',
      isBlocked: isOperator,

      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='size-5 shrink-0 text-yellow-600 xl:h-6 xl:w-6 dark:text-yellow-500'
        >
          <path d='M3 3v16a2 2 0 0 0 2 2h16' />
          <path d='M7 16h8' />
          <path d='M7 11h12' />
          <path d='M7 6h3' />
        </svg>
      )
    },
    {
      to: '/staff',
      title: 'Сотрудники',
      color: 'blue',
      isBlocked: isOperator,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='size-5 shrink-0 text-blue-600 xl:h-6 xl:w-6 dark:text-blue-500'
        >
          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
          <path d='M16 3.128a4 4 0 0 1 0 7.744' />
          <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
          <circle
            cx='9'
            cy='7'
            r='4'
          />
        </svg>
      )
    },
    {
      to: '/add-user',
      title: 'Добавить',
      color: 'lime',
      isBlocked: isOperator,
      icon: <UserPlus className='size-5 shrink-0 text-lime-600 xl:h-6 xl:w-6 dark:text-lime-500' />
    },
    {
      to: '/organization-selector',
      title: 'Мои склады',
      color: 'purple',
      icon: (
        <WarehouseIcon className='size-5 shrink-0 text-purple-600 xl:h-6 xl:w-6 dark:text-purple-500' />
      )
    }
  ]

  return (
    <Page
      back={false}
      className='!pt-0'
    >
      <Header role={role} />
      <AlertProductLowStock />

      <Link
        className={clsx(
          'group mt-4 flex flex-col rounded-xl bg-pink-50 p-4 focus:outline-hidden dark:bg-pink-800/40',
          'transition-transform duration-150 ease-in-out active:scale-95',
          'select-none'
        )}
        onClick={() => hapticFeedback.impactOccurred('rigid')}
        to={'/report'}
      >
        <div className='mb-4 flex h-full flex-col items-center justify-center'>
          <span className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-pink-200/50 text-white xl:size-16 dark:bg-pink-800/30'>
            <svg
              className='size-5 shrink-0 text-pink-600 xl:h-6 xl:w-6 dark:text-pink-500'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M7 2h10' />
              <path d='M5 6h14' />
              <rect
                width='18'
                height='12'
                x='3'
                y='10'
                rx='2'
              />
            </svg>
          </span>
        </div>
        <div className='mt-auto text-center'>
          <p className='flex items-center justify-center gap-x-1 truncate text-xs font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 xl:text-sm dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
            Расход
          </p>
        </div>
      </Link>
      <Link
        className={clsx(
          'group mt-4 flex flex-col rounded-xl bg-pink-50 p-4 focus:outline-hidden dark:bg-green-800/40',
          'transition-transform duration-150 ease-in-out active:scale-95',
          'select-none'
        )}
        onClick={() => hapticFeedback.impactOccurred('rigid')}
        to={'/incoming-to-warehouse'}
      >
        <div className='mb-4 flex h-full flex-col items-center justify-center'>
          <span className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-green-200/50 text-white xl:size-16 dark:bg-green-800/30'>
            <svg
              className='size-5 shrink-0 text-green-600 xl:h-6 xl:w-6 dark:text-green-500'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M7 2h10' />
              <path d='M5 6h14' />
              <rect
                width='18'
                height='12'
                x='3'
                y='10'
                rx='2'
              />
            </svg>
          </span>
        </div>
        <div className='mt-auto text-center'>
          <p className='flex items-center justify-center gap-x-1 truncate text-xs font-medium text-gray-800 group-hover:text-green-600 group-focus:text-green-600 xl:text-sm dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
            Поступление
          </p>
        </div>
      </Link>
      <div className='mx-auto mt-8 h-px w-28 bg-gray-300 dark:bg-neutral-700' />

      <div className='mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:gap-4 xl:grid-cols-6'>
        {menuButtons.map(button => (
          <MenuButton
            key={button.to}
            {...button}
          />
        ))}

        {isIT && (
          <Link
            to={'/'}
            className='group flex flex-col rounded-xl border border-gray-200 bg-white p-4 focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-900'
            onClick={() => hapticFeedback.impactOccurred('rigid')}
          >
            <div className='mb-4 flex h-full flex-col items-center justify-center'>
              <span className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-yellow-50 text-white xl:size-16 dark:bg-yellow-800/30'>
                <svg
                  className='size-5 shrink-0 text-yellow-600 xl:h-6 xl:w-6 dark:text-yellow-500'
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M16 3h5v5' />
                  <path d='M8 3H3v5' />
                  <path d='M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3' />
                  <path d='m15 9 6-6' />
                </svg>
              </span>
            </div>
            <div className='mt-auto text-center'>
              <p className='truncate text-xs font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 xl:text-sm dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
                /auth
              </p>
            </div>
          </Link>
        )}

        {/* End Card */}
      </div>
      <Divide />

      <div className='mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:gap-4 xl:grid-cols-6'>
        <MenuButton
          to='/info-page'
          title='Информация'
          color='zinc'
          icon={<Info className='size-5 shrink-0 text-zinc-600 xl:h-6 xl:w-6 dark:text-zinc-500' />}
        />

        <button
          onClick={() => {
            openTelegramLink('https://t.me/Knyaz_sv')
            hapticFeedback.impactOccurred('rigid')
          }}
          className={clsx(
            'group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-900',
            'transition-transform duration-150 ease-in-out active:scale-95',
            'select-none'
          )}
        >
          <span
            className={clsx(
              'relative mx-auto flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 xl:size-16 dark:bg-orange-900 dark:text-orange-500'
            )}
          >
            <MessageCircle className='size-5 shrink-0 text-orange-600 xl:h-6 xl:w-6 dark:text-orange-500' />
          </span>

          <div className='mt-2 text-center'>
            <p className='truncate text-center text-xs font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 xl:text-sm dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
              Поддержка
            </p>
          </div>
        </button>
        <MenuButton
          to='/settings'
          title='Настройки'
          isDevelop={true}
          color='gray'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='size-5 shrink-0 text-gray-600 xl:h-6 xl:w-6 dark:text-gray-500'
              width={24}
              height={24}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
              <circle
                cx={12}
                cy={12}
                r={3}
              />
            </svg>
          }
        />
      </div>
      {/* End Grid */}
    </Page>
  )
}

export default MenuPage
