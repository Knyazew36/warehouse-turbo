import { Page } from '@/components/Page'
import React, { useState, useMemo, useEffect } from 'react'
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
import { Product } from '@/entitites/product/model/product.type'
import { Category } from '@/entitites/category/model/category.type'

export const ProductsPage = () => {
  const { data, isLoading, isFetching } = useCategoryWithProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [productWithoutCategory, setProductWithoutCategory] = useState<Product[] | undefined>(
    undefined
  )
  const [productsWithCategory, setProductsWithCategory] = useState<Category[] | undefined>(
    undefined
  )
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)
  const [view, setView] = useState<'tile' | 'table'>('tile')

  const handleViewChange = (view: 'tile' | 'table') => {
    setView(view)
  }

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

  const handleCategoryClick = (category: Category | null) => {
    hapticFeedback.impactOccurred('light')

    if (category) {
      const categories = data?.categoriesWithProducts?.filter(item => item.id === category?.id)
      setSelectedCategory(category)
      setProductsWithCategory(categories)
    } else {
      setProductsWithCategory(data?.categoriesWithProducts)
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
      <PageHeader title='Остаток' />

      <div className='mx-auto py-10 pt-0 sm:px-6 lg:px-8 lg:py-14'>
        <InputDefault
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <AlertProductLowStock />
        {/* 
        {data?.categoriesWithProducts && data?.categoriesWithProducts.length > 0 && (
          <div className='flex gap-1'>
            {data?.categoriesWithProducts.map(category => (
              <button
                className='border'
                onClick={() => handleCategoryClick(category)}
              >
                <p className='text-sm text-gray-500'>{category.name}</p>
                <p className='text-sm text-gray-500'>{category.products?.length}</p>
              </button>
            ))}
          </div>
        )} */}

        {data?.categoriesWithProducts && data?.categoriesWithProducts.length > 0 && (
          <nav className='scrollbar-hide relative mt-2 flex gap-1 overflow-x-auto'>
            <button
              type='button'
              onClick={() => handleCategoryClick(null)}
              className='hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 active relative mb-2 inline-flex items-center justify-center gap-x-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-2 after:z-10 after:h-0.5 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700'
            >
              Все
            </button>
            {data.categoriesWithProducts.map(item => (
              <button
                type='button'
                className={clsx(
                  'hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 relative mb-2 inline-flex items-center justify-center gap-x-2 rounded-lg px-2.5 py-1.5 text-sm text-nowrap text-gray-500 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-2 after:z-10 after:h-0.5 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700',
                  item.id === selectedCategory?.id && 'bg-blue-700 text-white'
                )}
                onClick={() => handleCategoryClick(item)}
              >
                {item.name}
              </button>
            ))}
          </nav>
        )}

        {/* 
        {productWithoutCategory && productWithoutCategory?.length > 0 && (
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
        )} */}

        {view === 'tile' && (
          <div className='mt-4 flex flex-col gap-4'>
            {productsWithCategory && productsWithCategory.length > 0 && (
              <>
                {productsWithCategory.map(category => (
                  <>
                    <div className='flex items-center gap-x-2'>
                      <p className='text-sm text-gray-500'>{category.name}</p>
                      <p className='text-sm text-gray-500'>{category.products?.length}</p>
                    </div>
                    {category?.products?.map(product => (
                      <ProductsCard
                        key={product.id}
                        data={product}
                      />
                    ))}
                  </>
                ))}
              </>
            )}

            {productWithoutCategory && productWithoutCategory.length > 0 && (
              <>
                <p className='text-sm text-gray-500'>Товары без категории</p>

                {productWithoutCategory.map(card => (
                  <ProductsCard
                    key={card.id}
                    data={card}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {productWithoutCategory &&
          productWithoutCategory.length === 0 &&
          productsWithCategory &&
          productsWithCategory.length === 0 && <Empty title='Товары не найдены' />}

        {/* {view === 'table' && filteredData && <ProductsTable data={filteredData} />} */}

        {/* Кнопка создания нового товара */}
        <div className='mt-8'>
          <ProductCreate />
        </div>
      </div>
    </Page>
  )
}
