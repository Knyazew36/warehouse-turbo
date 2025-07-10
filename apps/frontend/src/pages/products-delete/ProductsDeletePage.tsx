import { Page } from '@/components/Page'
import React, { useMemo, useState } from 'react'
import { useProducts, useUpdateProduct } from '@/entitites/product/api/product.api'
import ProductsCardChange from '../products/card/ProductsCardChange'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import Loader from '@/shared/loader/ui/Loader'
import ProductCreate from '../products/create/ProductCreate'
import Empty from '@/shared/empty/ui/Empty'
import ProductCardChangeForm from '../products/card/ProductCardChangeForm'

export const ProductsDeletePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data = [], isLoading } = useProducts(false)

  const { mutate: updateProduct } = useUpdateProduct()

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = term ? data.filter(item => item.name.toLowerCase().includes(term)) : data

    // Активные товары должны быть перед неактивными
    return filtered.sort((a, b) => {
      if (a.active === b.active) return 0
      return a.active ? -1 : 1 // если a активен, он раньше
    })
  }, [data, searchTerm])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page back>
      <div className='max-w-[85rem] py-10 pt-5 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
        <PageHeader
          title='Редактирование товаров'
          isLoading={isLoading}
        />
        {/* Поиск товара */}
        <InputDefault
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* Сетка товаров */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8'>
          {filteredData.length > 0 ? (
            filteredData.map(card => (
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
      </div>
    </Page>
  )
}
