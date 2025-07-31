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
  const { currentOrganization, isOrganizationLoading, setOrganizationLoading } = useOrganizationStore()
  const user = initDataUser()
  const userId = user?.id?.toString()

  const { data: userRole, isLoading, isPending, error, isFetching } = useUserRole({ id: userId || '' })

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
          className='shrink-0 size-5 xl:w-6 xl:h-6 text-teal-600 dark:text-teal-500'
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
      icon: <Package className='shrink-0 size-5 xl:w-6 xl:h-6 text-indigo-600 dark:text-indigo-500' />
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
          className='shrink-0 size-5 xl:w-6 xl:h-6 text-yellow-600 dark:text-yellow-500'
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
          className='shrink-0 size-5 xl:w-6 xl:h-6 text-blue-600 dark:text-blue-500'
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
      icon: <UserPlus className='shrink-0 size-5 xl:w-6 xl:h-6 text-lime-600 dark:text-lime-500' />
    },
    {
      to: '/organization-selector',
      title: 'Мои склады',
      color: 'purple',
      icon: <WarehouseIcon className='shrink-0 size-5 xl:w-6 xl:h-6 text-purple-600 dark:text-purple-500' />
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
          'p-4 group mt-4 flex flex-col bg-pink-50 rounded-xl focus:outline-hidden dark:bg-pink-800/40',
          'transition-transform duration-150 ease-in-out active:scale-95',
          'select-none'
        )}
        onClick={() => hapticFeedback.impactOccurred('rigid')}
        to={'/report'}
      >
        <div className='mb-4 flex flex-col justify-center items-center h-full'>
          <span className='flex justify-center items-center size-12 xl:size-16 mx-auto bg-pink-200/50 text-white rounded-2xl dark:bg-pink-800/30'>
            <svg
              className='shrink-0 size-5 xl:w-6 xl:h-6 text-pink-600 dark:text-pink-500'
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
        <div className='text-center mt-auto'>
          <p className='truncate flex justify-center items-center gap-x-1 text-xs xl:text-sm font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
            Расход
          </p>
        </div>
      </Link>
      <Link
        className={clsx(
          'p-4 group mt-4 flex flex-col bg-pink-50 rounded-xl focus:outline-hidden dark:bg-green-800/40',
          'transition-transform duration-150 ease-in-out active:scale-95',
          'select-none'
        )}
        onClick={() => hapticFeedback.impactOccurred('rigid')}
        to={'/incoming-to-warehouse'}
      >
        <div className='mb-4 flex flex-col justify-center items-center h-full'>
          <span className='flex justify-center items-center size-12 xl:size-16 mx-auto bg-green-200/50 text-white rounded-2xl dark:bg-green-800/30'>
            <svg
              className='shrink-0 size-5 xl:w-6 xl:h-6 text-green-600 dark:text-green-500'
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
        <div className='text-center mt-auto'>
          <p className='truncate flex justify-center items-center gap-x-1 text-xs xl:text-sm font-medium text-gray-800 group-hover:text-green-600 group-focus:text-green-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
            Поступление
          </p>
        </div>
      </Link>
      <div className='w-28 h-px mx-auto bg-gray-300 dark:bg-neutral-700 mt-8' />

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-4 mt-8'>
        {menuButtons.map(button => (
          <MenuButton
            key={button.to}
            {...button}
          />
        ))}

        {isIT && (
          <Link
            to={'/'}
            className='p-4 group flex flex-col bg-white border border-gray-200 rounded-xl focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700'
            onClick={() => hapticFeedback.impactOccurred('rigid')}
          >
            <div className='mb-4 flex flex-col justify-center items-center h-full'>
              <span className='flex justify-center items-center size-12 xl:size-16 mx-auto bg-yellow-50 text-white rounded-2xl dark:bg-yellow-800/30'>
                <svg
                  className='shrink-0 size-5 xl:w-6 xl:h-6 text-yellow-600 dark:text-yellow-500'
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
            <div className='text-center mt-auto'>
              <p className='truncate text-xs xl:text-sm font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
                /auth
              </p>
            </div>
          </Link>
        )}

        {/* End Card */}
      </div>
      <Divide />

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-4 mt-8'>
        <MenuButton
          to='/info-page'
          title='Информация'
          color='zinc'
          icon={<Info className='shrink-0 size-5 xl:w-6 xl:h-6 text-zinc-600 dark:text-zinc-500' />}
        />

        <button
          onClick={() => {
            openTelegramLink('https://t.me/Knyaz_sv')
            hapticFeedback.impactOccurred('rigid')
          }}
          className={clsx(
            'p-4 group relative overflow-hidden flex flex-col bg-white border border-gray-200 rounded-xl focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700',
            'transition-transform duration-150 ease-in-out active:scale-95',
            'select-none'
          )}
        >
          <span
            className={clsx(
              'flex justify-center relative items-center size-12 xl:size-16 mx-auto text-orange-600 dark:text-orange-500 rounded-2xl bg-orange-50 dark:bg-orange-900'
            )}
          >
            <MessageCircle className='shrink-0 size-5 xl:w-6 xl:h-6 text-orange-600 dark:text-orange-500' />
          </span>

          <div className='text-center  mt-2'>
            <p className='truncate text-xs xl:text-sm text-center font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
              Поддержка
            </p>
          </div>
        </button>
        <MenuButton
          to='/settings'
          title='Настройки'
          color='gray'
          isDevelop={true}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='shrink-0 size-5 xl:w-6 xl:h-6 text-gray-600 dark:text-gray-500'
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
