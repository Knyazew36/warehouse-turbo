import { Page } from '@/components/Page'
import React from 'react'
import ProductCreate from '../products/create/ProductCreate'
import { Link } from 'react-router-dom'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { FilePlus2, Package } from 'lucide-react'
import Divide from '@/shared/ui/divide/ui/Divide'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'

const SettingsWarehousePage = () => {
  const { isIT, isOwner, isAdmin } = useAuthStore()
  // const { data: categoryWithProducts } = useCategoryWithProducts()

  // console.log(categoryWithProducts)

  return (
    <Page>
      <PageHeader title='Настройки склада' />

      <div className='mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:gap-4 xl:grid-cols-6'>
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
              className='size-5 shrink-0'
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

      <Divide className='!my-4' />

      <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:gap-4 xl:grid-cols-6'>
        <MenuButton
          to={'/category/create'}
          title=' Создать категорию'
          color='neutral'
          isBlocked={!isIT && !isOwner && !isAdmin}
          iconClassName='border-2 border-dotted border-neutral-700'
          icon={<FilePlus2 className='size-5 shrink-0' />}
        />
        <MenuButton
          to={'/category/list'}
          title='Мои категории'
          color='neutral'
          isBlocked={!isIT && !isOwner && !isAdmin}
          iconClassName='border-2 border-dotted border-neutral-700'
          icon={<FilePlus2 className='size-5 shrink-0' />}
        />
      </div>

      <Divide />

      <MenuButton
        to='/products'
        title='Остаток'
        color='indigo'
        icon={
          <Package className='size-5 shrink-0 text-indigo-600 xl:h-6 xl:w-6 dark:text-indigo-500' />
        }
      />
    </Page>
  )
}

export default SettingsWarehousePage
