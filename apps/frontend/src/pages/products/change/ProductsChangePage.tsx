import { Page } from '@/components/Page'
import React, { useMemo, useState } from 'react'

import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import Loader from '@/shared/loader/ui/Loader'
import ProductCreate from '../create/ProductCreate'
import Empty from '@/shared/empty/ui/Empty'
import ProductCardChangeForm from '../card/ProductCardChangeForm'
import InfoMessage from '@/shared/ui/info/ui/Info'
import { useCategoryWithProducts } from '@/entitites/category/api/category.api'
import { Product } from '@/entitites/product/model/product.type'

export const ProductsChangePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    data: categoryWithProducts,
    isLoading,
    refetch,
    isFetching
  } = useCategoryWithProducts(false)

  // const { mutate: updateProduct } = useUpdateProduct()

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    // Собираем все товары из всех категорий и товары без категории
    const allProducts: Product[] = [
      ...(categoryWithProducts?.categoriesWithProducts?.flatMap(
        category =>
          category.products?.map(product => ({
            ...product,
            category: category.name // Используем название категории как строку
          })) || []
      ) || []),
      ...(categoryWithProducts?.productsWithoutCategory || [])
    ]

    const filtered = term
      ? allProducts.filter(item => item.name.toLowerCase().includes(term))
      : allProducts

    // Сначала сортируем по активности, затем по названию для сохранения исходного порядка
    return filtered?.sort((a, b) => {
      // Сначала по активности
      if (a.active !== b.active) {
        return a.active ? -1 : 1
      }
      // Затем по названию для сохранения исходного порядка
      return a.name.localeCompare(b.name)
    })
  }, [categoryWithProducts, searchTerm])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page
      back
      isLoading={isFetching}
    >
      <PageHeader
        title='Редактирование товаров'
        isLoading={isLoading}
      />
      {/* Поиск товара */}
      <InputDefault
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <InfoMessage
        className='mt-4'
        items={[
          'Вы можете удалить товары из склада.',
          'Если выключить поле "Активен", товар будет скрыт из списка товаров. Вам не будет приходить уведомление о его наличии.'
        ]}
      />
      {/* Сетка товаров */}
      <div className='mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
        {filteredData && filteredData?.length > 0 ? (
          filteredData?.map(card => (
            <ProductCardChangeForm
              key={card.id}
              data={card}
            />
          ))
        ) : (
          <Empty title='Товары не найдены' />
        )}
      </div>
      <div className='mt-8'>
        <ProductCreate />
      </div>
    </Page>
  )
}
