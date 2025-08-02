import { Page } from '@/components/Page'
import ButtonAction from '@/shared/button-action/ButtonAction'
import React, { useEffect, useMemo, useState } from 'react'
import ProductsCardChange from '../products/card/ProductsCardChange'

import { receiptCreate } from '@/entitites/receipt/api/receipt.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useNavigate } from 'react-router-dom'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import Empty from '@/shared/empty/ui/Empty'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { Plus } from 'lucide-react'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'

const IncomingToWarehousePage = () => {
  const navigate = useNavigate()
  const { data: categoryWithProducts, isLoading, refetch } = useCategoryWithProducts()

  const { open } = useBottomSheetStore()
  const { isIT, isOwner, isAdmin, isOperator } = useAuthStore()

  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [arrivals, setArrivals] = useState<{ [productId: number]: number }>({})

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categoryWithProducts?.productsWithoutCategory
    return categoryWithProducts?.productsWithoutCategory?.filter(item =>
      item.name.toLowerCase().includes(term)
    )
  }, [categoryWithProducts, searchTerm])

  const handleArrivalChange = (productId: number, value: number) => {
    const validatedValue = Math.max(0, value)
    setArrivals(prev => ({ ...prev, [productId]: validatedValue }))
  }

  const handleCancel = () => {
    const reset: { [productId: number]: number } = {}
    categoryWithProducts?.productsWithoutCategory?.forEach(product => {
      reset[product.id] = 0
    })
    setArrivals(reset)
  }

  const onSubmit = async () => {
    const payload = Object.entries(arrivals)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity: Number(quantity)
      }))

    try {
      setIsButtonLoading(true)
      await receiptCreate({ receipts: payload })
      open({
        isOpen: true,
        description: 'Поступление успешно создано',
        buttonText: 'Хорошо'
      })
      refetch()
      setArrivals({})
      navigate(-1)
    } catch (error) {
      hapticFeedback.notificationOccurred('error')
    } finally {
      setIsButtonLoading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back>
      <PageHeader title='Создать поступление' />

      <div className='flex flex-1 flex-col'>
        <div className='space-y-3'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='block w-full rounded-lg border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:py-3 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
            placeholder='Поиск товара...'
          />
        </div>
        <div className='mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
          {filteredData && filteredData?.length > 0 ? (
            filteredData.map(card => (
              <ProductsCardChange
                inputNumberLabel={`Поступило ${card.unit ? card.unit : ''}:`}
                value={arrivals[card.id] || 0}
                onChange={value => handleArrivalChange(card.id, value || 0)}
                withInputNumber
                key={card.id}
                data={card}
                min={0}
                max={undefined}
              />
            ))
          ) : (
            <Empty title='Товары не найдены' />
          )}
        </div>

        <MenuButton
          to={'/create-product'}
          title='Создать товар'
          color='neutral'
          className='mt-8'
          isBlocked={!isIT && !isOwner && !isAdmin}
          iconClassName='border-2 border-dotted border-neutral-700'
          icon={<Plus className='size-5 shrink-0' />}
        />

        {filteredData && filteredData?.length > 0 && (
          <ButtonAction
            onSuccessClick={onSubmit}
            onCancelClick={handleCancel}
            disabledSuccess={Object.values(arrivals).every(value => value === 0)}
            disabledCancel={Object.values(arrivals).every(value => value === 0)}
            isLoading={isButtonLoading}
          />
        )}
      </div>
    </Page>
  )
}

export default IncomingToWarehousePage
