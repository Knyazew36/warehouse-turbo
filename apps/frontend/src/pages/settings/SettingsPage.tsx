import React from 'react'
import ProductCreate from '../products/create/ProductCreate'
import { Page } from '@/components/Page'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import MenuButton, { IMenuButton } from '../menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

const menuButtons: IMenuButton[] = [
  {
    to: '/notifications-setting',
    title: 'Уведомления',
    color: 'neutral',
    iconClassName: 'border-2 border-dotted border-neutral-700',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={24}
        height={24}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='shrink-0 size-5 xl:w-6 xl:h-6 text-neutral-600 dark:text-neutral-500'
      >
        <path d='M10.268 21a2 2 0 0 0 3.464 0' />
        <path d='M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' />
      </svg>
    )
  }
]

const SettingsPage = () => {
  const { isIT, isOwner, isAdmin } = useAuthStore()

  return (
    <Page>
      <PageHeader title='Настройки' />

      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-4 mt-8'>
        {menuButtons.map(button => (
          <MenuButton
            key={button.to}
            {...button}
          />
        ))}
      </div>
    </Page>
  )
}

export default SettingsPage
