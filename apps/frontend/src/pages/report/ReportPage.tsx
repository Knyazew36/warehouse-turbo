import { Page } from '@/components/Page'
import ButtonAction from '@/shared/button-action/ButtonAction'
import React, { useEffect, useMemo, useState } from 'react'

import ProductsCardChange from '../products/card/ProductsCardChange'
import { shiftCreate } from '@/entitites/shift/api/shift.api'
import { useNavigate } from 'react-router-dom'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import InfoMessage from '@/shared/ui/info/ui/Info'
import Empty from '@/shared/empty/ui/Empty'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'

const ReportPage = () => {
  const navigate = useNavigate()
  const { data: categoryWithProducts, isLoading, refetch, isFetching } = useCategoryWithProducts()
  const { open } = useBottomSheetStore()
  const [buttonLoading, setButtonLoading] = useState(false)
  const { isIT, isOwner, isAdmin } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [consumptions, setConsumptions] = useState<{ [productId: number]: number }>({})
  const [comments, setComments] = useState<{ [productId: number]: string }>({})

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categoryWithProducts?.productsWithoutCategory
    return categoryWithProducts?.productsWithoutCategory?.filter(item =>
      item.name.toLowerCase().includes(term)
    )
  }, [categoryWithProducts, searchTerm])

  const handleConsumptionChange = (productId: number, value: number) => {
    const product = categoryWithProducts?.productsWithoutCategory?.find(p => p.id === productId)
    if (!product) return
    const validatedValue = Math.max(0, Math.min(value, +product.quantity))
    setConsumptions(prev => ({ ...prev, [productId]: validatedValue }))
  }

  const handleCommentChange = (productId: number, comment: string) => {
    setComments(prev => ({ ...prev, [productId]: comment }))
  }

  const handleCancel = () => {
    const reset: { [productId: number]: number } = {}
    const resetComments: { [productId: number]: string } = {}
    categoryWithProducts?.productsWithoutCategory?.forEach(product => {
      reset[product.id] = 0
      resetComments[product.id] = ''
    })
    setConsumptions(reset)
    setComments(resetComments)
  }

  const onSubmit = async () => {
    const payload = {
      consumptions: Object.entries(consumptions)
        .filter(([_, consumed]) => consumed > 0)
        .map(([productId, consumed]) => ({
          productId: Number(productId),
          consumed: Number(consumed),
          comment: comments[Number(productId)] || undefined
        }))
    }
    try {
      setButtonLoading(true)
      await shiftCreate(payload.consumptions)
      open({
        isOpen: true,
        description: 'Отчет успешно отправлен',
        buttonText: 'Хорошо'
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
        <InfoMessage
          className='mt-4'
          items={[
            'Вы можете добавить несколько товаров в расход.',
            'К товару можно добавить комментарий.'
          ]}
        />
        <div className='mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
          {filteredData && filteredData?.length > 0 ? (
            filteredData?.map(card => (
              <ProductsCardChange
                inputNumberLabel={`Израсходовано ${card.unit ? card.unit : ''}:`}
                value={consumptions[card.id] || 0}
                onChange={value => handleConsumptionChange(card.id, value || 0)}
                withInputNumber
                key={card.id}
                data={card}
                min={0}
                max={+card.quantity}
                comment={{
                  text: comments[card.id] || '',
                  onChange: (text: string) => handleCommentChange(card.id, text)
                }}
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
