import { Page } from '@/components/Page'
import React, { useState, useMemo } from 'react'
import ProductsCard from './card/ProductsCard'

import ProductCreate from './create/ProductCreate'

import AlertProductLowStock from '@/widgets/alert-product-low-stock/AlertProductLowStock'
import clsx from 'clsx'
import ProductsTable from './table/ProductsTable'
import Empty from '@/shared/empty/ui/Empty'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import Loader from '@/shared/loader/ui/Loader'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'

export const ProductsPage = () => {
  const { data: categoryWithProducts, isLoading, isFetching } = useCategoryWithProducts()

  const [view, setView] = useState<'tile' | 'table'>('tile')

  const handleViewChange = (view: 'tile' | 'table') => {
    setView(view)
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categoryWithProducts?.productsWithoutCategory
    return categoryWithProducts?.productsWithoutCategory?.filter(item =>
      item.name.toLowerCase().includes(term)
    )
  }, [categoryWithProducts, searchTerm])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page
      back
      isLoading={isFetching}
    >
      <PageHeader title='Остаток' />

      <div className='mx-auto py-10 pt-0 sm:px-6 lg:px-8 lg:py-14'>
        <InputDefault
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <AlertProductLowStock />

        {filteredData && filteredData?.length > 0 && (
          <div className='mt-8 ml-auto flex w-max rounded-lg bg-gray-100 p-0.5 dark:bg-neutral-800'>
            <div className='flex gap-x-0.5 md:gap-x-1'>
              <button
                type='button'
                className={clsx(
                  'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent rounded-md border border-transparent px-1.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-400 focus:border-gray-400 focus:outline-hidden sm:px-2 md:text-[13px] dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white dark:focus:border-neutral-500 dark:focus:text-white',
                  view === 'tile' && 'active'
                )}
                aria-selected='true'
                data-hs-tab='#example-tab-preview'
                aria-controls='example-tab-preview'
                role='tab'
                onClick={() => {
                  handleViewChange('tile')
                  hapticFeedback.selectionChanged()
                }}
              >
                Плитка
              </button>
              <button
                type='button'
                className={clsx(
                  'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent rounded-md border border-transparent px-1.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-400 focus:border-gray-400 focus:outline-hidden sm:px-2 md:text-[13px] dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white dark:focus:border-neutral-500 dark:focus:text-white',
                  view === 'table' && 'active'
                )}
                id='example-tab-html-item'
                aria-selected='true'
                data-hs-tab='#example-tab-html'
                aria-controls='example-tab-html'
                role='tab'
                onClick={() => {
                  handleViewChange('table')
                  hapticFeedback.selectionChanged()
                }}
              >
                Таблица
              </button>
            </div>
          </div>
        )}

        {view === 'tile' && (
          <div className='mt-4 flex flex-col gap-4'>
            {filteredData && filteredData?.length > 0 ? (
              filteredData.map(card => (
                <ProductsCard
                  key={card.id}
                  data={card}
                />
              ))
            ) : (
              <Empty title='Товары не найдены' />
            )}
          </div>
        )}

        {view === 'table' && filteredData && <ProductsTable data={filteredData} />}

        {/* Кнопка создания нового товара */}
        <div className='mt-8'>
          <ProductCreate />
        </div>
      </div>
    </Page>
  )
}
