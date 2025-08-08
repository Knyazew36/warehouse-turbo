import { Page } from '@/components/Page'
import ButtonAction from '@/shared/button-action/ButtonAction'
import React, { useEffect, useState } from 'react'

import ProductsCardChange from '../products/card/ProductsCardChange'
import { shiftCreate } from '@/entitites/shift/api/shift.api'
import { useNavigate } from 'react-router-dom'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import Empty from '@/shared/empty/ui/Empty'
import MenuButton from '../menu-page/menu-button/MenuButton'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/entitites/auth/model/auth.store'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'
import { Product } from '@/entitites/product/model/product.type'
import { Category } from '@/entitites/category/model/category.type'
import clsx from 'clsx'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { hapticFeedback } from '@telegram-apps/sdk-react'

const ReportPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, refetch, isFetching } = useCategoryWithProducts()
  const { open } = useBottomSheetStore()
  const [buttonLoading, setButtonLoading] = useState(false)
  const { isIT, isOwner, isAdmin } = useAuthStore()

  const [consumptions, setConsumptions] = useState<{ [productId: number]: number }>({})
  const [comments, setComments] = useState<{ [productId: number]: string }>({})

  const [searchTerm, setSearchTerm] = useState('')
  const [productWithoutCategory, setProductWithoutCategory] = useState<Product[] | undefined>(
    undefined
  )
  const [productsWithCategory, setProductsWithCategory] = useState<Category[] | undefined>(
    undefined
  )
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      setProductWithoutCategory(data?.productsWithoutCategory)
      setProductsWithCategory(data?.categoriesWithProducts)
      return
    }

    const products = data?.productsWithoutCategory?.filter(item =>
      item.name.toLowerCase().includes(term)
    )
    const categoriesProducts =
      data?.categoriesWithProducts
        ?.map(category => ({
          ...category,
          products: category.products?.filter(product => product.name.toLowerCase().includes(term))
        }))
        .filter(category => category.products && category.products.length > 0) || []

    setProductWithoutCategory(products)
    setProductsWithCategory(categoriesProducts)
  }, [data, searchTerm])

  const handleConsumptionChange = (productId: number, value: number) => {
    const product =
      productWithoutCategory?.find(p => p.id === productId) ||
      productsWithCategory?.flatMap(p => p.products)?.find(p => p?.id === productId)
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
    // categoryWithProducts?.productsWithoutCategory?.forEach(product => {
    //   reset[product.id] = 0
    //   resetComments[product.id] = ''
    // })
    setConsumptions(reset)
    setComments(resetComments)
  }
  const handleCategoryClick = (category: Category | null) => {
    hapticFeedback.impactOccurred('light')

    if (category) {
      const categories = data?.categoriesWithProducts?.filter(item => item.id === category?.id)
      setSelectedCategory(category)
      setProductsWithCategory(categories)
    } else {
      setSelectedCategory(null)
      setProductsWithCategory(data?.categoriesWithProducts)
    }
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
    <Page
      back
      isLoading={isFetching}
    >
      <PageHeader title='Создать расход' />

      <div className='mx-auto py-10 pt-0 sm:px-6 lg:px-8 lg:py-14'>
        <div className='mt-4'>
          <InputDefault
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {data?.categoriesWithProducts && data?.categoriesWithProducts.length > 0 && (
          <nav className='scrollbar-hide relative mt-4 flex gap-1 overflow-x-auto py-1'>
            <button
              type='button'
              onClick={() => handleCategoryClick(null)}
              className={clsx(
                'hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 active relative mb-2 inline-flex items-center justify-center gap-x-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-2 after:z-10 after:h-0.5 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700',
                (!selectedCategory || selectedCategory === null) && 'bg-blue-700 dark:text-white'
              )}
            >
              Все
            </button>
            {data.categoriesWithProducts.map(item => (
              <button
                type='button'
                className={clsx(
                  'hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 relative mb-2 inline-flex items-center justify-center gap-x-2 rounded-lg px-2.5 py-1.5 text-sm text-nowrap text-gray-500 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-2 after:z-10 after:h-0.5 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700',
                  item.id === selectedCategory?.id && 'bg-blue-700 dark:text-white'
                )}
                onClick={() => handleCategoryClick(item)}
              >
                {item.name}
              </button>
            ))}
          </nav>
        )}

        <div className='mt-4 flex flex-col gap-4'>
          {productsWithCategory && productsWithCategory.length > 0 && (
            <>
              {productsWithCategory.map(category => (
                <>
                  <div className='flex items-center gap-2 border-t border-neutral-700 pt-2'>
                    <p className='text-sm text-gray-500 dark:text-neutral-500'>{category.name}:</p>
                    <p className='text-sm text-neutral-500'>{category.products?.length}</p>
                  </div>
                  {category?.products?.map(product => (
                    <ProductsCardChange
                      inputNumberLabel={`Израсходовано ${product.unit ? product.unit : ''}:`}
                      value={consumptions[product.id] || 0}
                      onChange={value => handleConsumptionChange(product.id, value || 0)}
                      withInputNumber
                      key={product.id}
                      data={product}
                      min={0}
                      max={+product.quantity}
                      comment={{
                        text: comments[product.id] || '',
                        onChange: (text: string) => handleCommentChange(product.id, text)
                      }}
                    />
                  ))}
                </>
              ))}
            </>
          )}

          {productWithoutCategory &&
            productWithoutCategory.length > 0 &&
            selectedCategory === null && (
              <>
                <div className='flex items-center gap-2 border-t border-neutral-700 pt-2'>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Товары без категории:
                  </p>
                  <p className='text-sm text-neutral-500'>{productWithoutCategory?.length}</p>
                </div>

                {productWithoutCategory.map(product => (
                  <ProductsCardChange
                    inputNumberLabel={`Израсходовано ${product.unit ? product.unit : ''}:`}
                    value={consumptions[product.id] || 0}
                    onChange={value => handleConsumptionChange(product.id, value || 0)}
                    withInputNumber
                    key={product.id}
                    data={product}
                    min={0}
                    max={+product.quantity}
                    comment={{
                      text: comments[product.id] || '',
                      onChange: (text: string) => handleCommentChange(product.id, text)
                    }}
                  />
                ))}
              </>
            )}
        </div>

        {productWithoutCategory &&
          productWithoutCategory.length === 0 &&
          productsWithCategory &&
          productsWithCategory.length === 0 && <Empty title='Товары не найдены' />}

        <MenuButton
          to={'/create-product'}
          title='Создать товар'
          color='neutral'
          className='mt-8'
          isBlocked={!isIT && !isOwner && !isAdmin}
          iconClassName='border-2 border-dotted border-neutral-700'
          icon={<Plus className='size-5 shrink-0' />}
        />

        <ButtonAction
          isLoading={buttonLoading}
          onSuccessClick={onSubmit}
          onCancelClick={handleCancel}
          disabledSuccess={Object.values(consumptions).every(value => value === 0)}
          // disabledCancel={Object.values(consumptions).every(value => value === 0)}
        />
      </div>
    </Page>
  )
}

export default ReportPage
