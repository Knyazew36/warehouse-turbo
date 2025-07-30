import React, { useState } from 'react'

import MenuButton from '@/pages/menu-page/menu-button/MenuButton'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { Plus } from 'lucide-react'

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
        icon={<Plus className='shrink-0 size-5' />}
      />
    )
  )
}

export default ProductCreate
