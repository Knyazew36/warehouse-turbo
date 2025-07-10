import { Page } from '@/components/Page'
import ButtonAction from '@/shared/button-action/ButtonAction'
import React, { useEffect, useMemo, useState } from 'react'

import ProductsCardChange from '../products/card/ProductsCardChange'
import { shiftCreate } from '@/entitites/shift/api/shift.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/entitites/product/api/product.api'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
const ReportPage = () => {
  const navigate = useNavigate()
  const { data = [], isLoading, refetch } = useProducts(true)
  const { open } = useBottomSheetStore()
  const [buttonLoading, setButtonLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [consumptions, setConsumptions] = useState<{ [productId: number]: number }>({})

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data
    return data.filter(item => item.name.toLowerCase().includes(term))
  }, [data, searchTerm])

  const handleConsumptionChange = (productId: number, value: number) => {
    const product = data.find(p => p.id === productId)
    if (!product) return
    const validatedValue = Math.max(0, Math.min(value, product.quantity))
    setConsumptions(prev => ({ ...prev, [productId]: validatedValue }))
  }

  const handleCancel = () => {
    const reset: { [productId: number]: number } = {}
    data.forEach(product => {
      reset[product.id] = 0
    })
    setConsumptions(reset)
  }

  const onSubmit = async () => {
    const payload = {
      consumptions: Object.entries(consumptions)
        .filter(([_, consumed]) => consumed > 0)
        .map(([productId, consumed]) => ({
          productId: Number(productId),
          consumed: Number(consumed)
        }))
    }
    try {
      setButtonLoading(true)
      await shiftCreate(payload.consumptions)
      open({
        isOpen: true,
        description: 'Отчет успешно отправлен'
      })
      navigate(-1)
    } catch (error) {
    } finally {
      setButtonLoading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back>
      <PageHeader title='Создать расход' />

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
                inputNumberLabel={`Израсходовано ${card.unit ? card.unit : ''}:`}
                value={consumptions[card.id] || 0}
                onChange={value => handleConsumptionChange(card.id, value || 0)}
                withInputNumber
                key={card.id}
                data={card}
                min={0}
                max={card.quantity}
              />
            ))
          ) : (
            <p className='col-span-full text-center text-muted-foreground'>Товары не найдены</p>
          )}
        </div>

        {filteredData.length > 0 && (
          <ButtonAction
            isLoading={buttonLoading}
            onSuccessClick={onSubmit}
            onCancelClick={handleCancel}
            disabledSuccess={Object.values(consumptions).every(value => value === 0)}
            disabledCancel={Object.values(consumptions).every(value => value === 0)}
          />
        )}
      </div>
    </Page>
  )
}

export default ReportPage
