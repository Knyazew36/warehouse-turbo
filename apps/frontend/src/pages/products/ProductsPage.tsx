import { Page } from '@/components/Page'
import React, { useEffect, useState, useMemo } from 'react'
import ProductsCard from './card/ProductsCard'
import { Button } from '@/components/ui/button'

import ProductCreate from './create/ProductCreate'

import AlertProductLowStock from '@/widgets/alert-product-low-stock/AlertProductLowStock'
import { useProducts } from '@/entitites/product/api/product.api'
import clsx from 'clsx'
import ProductsTable from './table/ProductsTable'
import Empty from '@/shared/empty/ui/Empty'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import Loader from '@/shared/loader/ui/Loader'

export const ProductsPage = () => {
  const { data = [], isLoading, refetch } = useProducts(true)
  const [view, setView] = useState<'tile' | 'table'>('tile')

  const handleViewChange = (view: 'tile' | 'table') => {
    setView(view)
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return data
    return data.filter(item => item.name.toLowerCase().includes(term))
  }, [data, searchTerm])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back>
      <PageHeader title='Товары' />

      <div className='max-w-[85rem] py-10 pt-0 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
        <InputDefault
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <AlertProductLowStock />

        {filteredData.length > 0 && (
          <div className='flex bg-gray-100 rounded-lg p-0.5 dark:bg-neutral-800 w-max mt-8 ml-auto'>
            <div className='flex gap-x-0.5 md:gap-x-1'>
              <button
                type='button'
                className={clsx(
                  'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent text-xs md:text-[13px] text-gray-800 border border-transparent hover:border-gray-400 focus:outline-hidden focus:border-gray-400 font-medium rounded-md px-1.5 sm:px-2 py-2 dark:text-neutral-200 dark:hover:text-white dark:hover:border-neutral-500 dark:focus:text-white dark:focus:border-neutral-500 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent ',
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
                  'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent text-xs md:text-[13px] text-gray-800 border border-transparent hover:border-gray-400 focus:outline-hidden focus:border-gray-400 font-medium rounded-md px-1.5 sm:px-2 py-2 dark:text-neutral-200 dark:hover:text-white dark:hover:border-neutral-500 dark:focus:text-white dark:focus:border-neutral-500 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent ',
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
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4'>
            {filteredData.length > 0 ? (
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

        {view === 'table' && <ProductsTable data={filteredData} />}

        {/* Кнопка создания нового товара */}
        <div className='mt-8'>
          <ProductCreate />
        </div>
      </div>
    </Page>
  )
}
