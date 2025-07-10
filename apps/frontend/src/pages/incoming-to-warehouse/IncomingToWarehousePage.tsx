import { Page } from '@/components/Page'
import ButtonAction from '@/shared/button-action/ButtonAction'
import React, { useEffect, useMemo, useState } from 'react'
import ProductsCardChange from '../products/card/ProductsCardChange'

import { receiptCreate } from '@/entitites/receipt/api/receipt.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/entitites/product/api/product.api'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'

const IncomingToWarehousePage = () => {
  const navigate = useNavigate()
  const { data = [], isLoading, refetch } = useProducts(true)
  const { open } = useBottomSheetStore()

  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [arrivals, setArrivals] = useState<{ [productId: number]: number }>({})

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data
    return data.filter(item => item.name.toLowerCase().includes(term))
  }, [data, searchTerm])

  const handleArrivalChange = (productId: number, value: number) => {
    const validatedValue = Math.max(0, value)
    setArrivals(prev => ({ ...prev, [productId]: validatedValue }))
  }

  const handleCancel = () => {
    const reset: { [productId: number]: number } = {}
    data.forEach(product => {
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
        description: 'Поступление успешно создано'
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

      <div className='flex flex-col flex-1'>
        <div className=' space-y-3'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
            placeholder='Поиск товара...'
          />
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8'>
          {filteredData.length > 0 ? (
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
            <p className='col-span-full text-center text-muted-foreground'>Товары не найдены</p>
          )}
        </div>

        {filteredData.length > 0 && (
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
