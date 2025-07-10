import { Page } from '@/components/Page'
import React from 'react'
import ProductCreate from '../products/create/ProductCreate'
import { Link } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

const SettingsPage = () => {
  const { isIT, isOwner, isAdmin } = useAuthStore()

  return (
    <Page>
      <PageHeader title='Настройки склада' />

      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-4 mt-8'>
        <ProductCreate />

        <MenuButton
          to={'/products-delete'}
          title=' Редактировать товары'
          color='neutral'
          isBlocked={!isIT && !isOwner && !isAdmin}
          iconClassName='border-2 border-dotted border-neutral-700'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='shrink-0 size-5'
            >
              <rect
                width='18'
                height='18'
                x='3'
                y='3'
                rx='2'
              />
              <path d='M9 8h7' />
              <path d='M8 12h6' />
              <path d='M11 16h5' />
            </svg>
          }
        />

        {/* <Link
          onClick={() => hapticFeedback.impactOccurred('rigid')}
          to={'/products-delete'}
          className='p-4 group flex flex-col bg-white border border-gray-200 rounded-xl focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700 '
        >
          <div className='mb-4 flex flex-col justify-center items-center h-full'>
            <span className='flex justify-center items-center size-12 xl:size-16 mx-auto border-2 border-dotted border-gray-300 text-gray-400 rounded-2xl dark:border-neutral-700 dark:text-neutral-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='shrink-0 size-5'
              >
                <rect
                  width='18'
                  height='18'
                  x='3'
                  y='3'
                  rx='2'
                />
                <path d='M9 8h7' />
                <path d='M8 12h6' />
                <path d='M11 16h5' />
              </svg>
            </span>
          </div>
          <div className='text-center mt-auto'>
            <p className='truncate text-xs xl:text-sm font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
              Редактировать товары
            </p>
          </div>
        </Link> */}
      </div>
    </Page>
  )
}

export default SettingsPage
