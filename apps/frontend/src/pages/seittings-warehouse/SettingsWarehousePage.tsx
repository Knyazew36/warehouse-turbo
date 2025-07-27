import { Page } from '@/components/Page'
import React from 'react'
import ProductCreate from '../products/create/ProductCreate'
import { Link } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

const SettingsWarehousePage = () => {
  const { isIT, isOwner, isAdmin } = useAuthStore()

  return (
    <Page>
      <PageHeader title='Настройки склада' />

      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-4 mt-8'>
        <ProductCreate />

        <MenuButton
          to={'/products-change'}
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
      </div>
    </Page>
  )
}

export default SettingsWarehousePage
