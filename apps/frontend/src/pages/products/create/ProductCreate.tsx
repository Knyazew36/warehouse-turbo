import React, { useState } from 'react'

import MenuButton from '@/pages/menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'

const ProductCreate: React.FC = () => {
  const { isIT, isOwner, isAdmin, isOperator } = useAuthStore()
  return (
    !isOperator && (
      <MenuButton
        to={'/create-product'}
        title='Создать товар'
        color='neutral'
        isBlocked={!isIT && !isOwner && !isAdmin}
        iconClassName='border-2 border-dotted border-neutral-700'
        icon={
          <svg
            className='shrink-0 size-5'
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
            <path d='M5 12h14' />
            <path d='M12 5v14' />
          </svg>
        }
      />
    )
  )
}

export default ProductCreate
