import React, { FC } from 'react'
import { Product } from '@/entitites/product/model/product.type'
import clsx from 'clsx'
import { Category } from '@/entitites/category/model/category.type'

interface IProps {
  productWithoutCategory: Product[] | undefined
  productsWithCategory: Category[] | undefined
}
const ProductsTable: FC<IProps> = ({ productWithoutCategory, productsWithCategory }) => {
  return (
    <div className='mt-4 flex flex-col rounded-xl border border-stone-200 bg-white shadow-2xs dark:border-neutral-700 dark:bg-neutral-900'>
      <div className='overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-stone-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700'>
        <div className='inline-block min-w-full align-middle'>
          {/* Table */}
          <table className='min-w-full divide-y divide-stone-200 dark:divide-neutral-700'>
            <thead>
              <tr>
                <th
                  scope='col'
                  className='min-w-40 lg:min-w-125'
                >
                  {/* Sort Dropdown */}
                  <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                    <button
                      id='hs-pro-eptits'
                      type='button'
                      className='flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-stone-500 focus:bg-stone-100 focus:outline-hidden dark:text-neutral-500 dark:focus:bg-neutral-700'
                    >
                      Товар
                    </button>
                  </div>
                  {/* End Sort Dropdown */}
                </th>
                <th scope='col'>
                  {/* Sort Dropdown */}
                  <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                    <button
                      id='hs-pro-eptchs'
                      type='button'
                      className='flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-stone-500 focus:bg-stone-100 focus:outline-hidden dark:text-neutral-500 dark:focus:bg-neutral-700'
                    >
                      остаток
                    </button>
                  </div>
                  {/* End Sort Dropdown */}
                </th>
                <th scope='col'>
                  {/* Sort Dropdown */}
                  <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                    <div className='flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-stone-500 focus:bg-stone-100 focus:outline-hidden dark:text-neutral-500 dark:focus:bg-neutral-700'>
                      мин.
                    </div>
                  </div>
                  {/* End Sort Dropdown */}
                </th>
                <th scope='col'>
                  {/* Sort Dropdown */}
                  <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                    <div className='flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-stone-500 focus:bg-stone-100 focus:outline-hidden dark:text-neutral-500 dark:focus:bg-neutral-700'>
                      обновление
                    </div>
                  </div>
                  {/* End Sort Dropdown */}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-stone-200 dark:divide-neutral-700'>
              {productWithoutCategory && productWithoutCategory.length > 0 && (
                <>
                  <tr className='cursor-pointer border-neutral-800 bg-neutral-700'>
                    <td
                      className='relative size-px px-5 py-3'
                      colSpan={4}
                    >
                      <div className='flex w-full justify-center gap-3'>
                        <span className='text-sm font-medium text-stone-800 dark:text-neutral-200'>
                          Товары без категории
                        </span>
                        <span className='text-sm text-stone-600 dark:text-neutral-400'>
                          {productWithoutCategory.length}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {productWithoutCategory &&
                    productWithoutCategory.map(item => (
                      <tr
                        className={clsx(
                          'cursor-pointer dark:odd:bg-neutral-800 dark:even:bg-neutral-900',
                          +item.quantity < +item.minThreshold && 'bg-red-900'
                        )}
                        key={item.id}
                      >
                        <td className='relative size-px px-5 py-3'>
                          <div className='before:absolute before:inset-0 before:z-9' />
                          <div className='flex w-full items-center gap-x-3'>
                            <div className='grow'>
                              <span className='text-sm font-medium text-stone-800 dark:text-neutral-200'>
                                {item.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='size-px px-5 py-3 whitespace-nowrap'>
                          <span className='text-sm text-stone-600 dark:text-neutral-400'>
                            {item.quantity}
                          </span>
                        </td>
                        <td className='size-px px-5 py-3 whitespace-nowrap'>
                          <span className='text-sm text-stone-600 dark:text-neutral-400'>
                            {item.minThreshold}
                          </span>
                        </td>
                        <td className='size-px px-5 py-3 whitespace-nowrap'>
                          <span className='text-sm text-stone-600 dark:text-neutral-400'>
                            {new Date(item.updatedAt).toLocaleString().split(',')[0]}
                          </span>
                        </td>
                      </tr>
                    ))}
                </>
              )}

              {productsWithCategory &&
                productsWithCategory.map(category => (
                  <>
                    <tr className='cursor-pointer border-neutral-800 bg-neutral-700'>
                      <td
                        className='relative size-px px-5 py-3'
                        colSpan={4}
                      >
                        <div className='flex w-full justify-center gap-3'>
                          <span className='text-sm font-medium text-stone-800 dark:text-neutral-200'>
                            {category.name}
                          </span>
                          <span className='text-sm text-stone-600 dark:text-neutral-400'>
                            {category.products?.length}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {category?.products &&
                      category?.products.map(item => (
                        <tr
                          className={clsx(
                            'cursor-pointer dark:odd:bg-neutral-800 dark:even:bg-neutral-900',
                            +item.quantity < +item.minThreshold && 'bg-red-900'
                          )}
                          key={item.id}
                        >
                          <td className='relative size-px px-5 py-3'>
                            <div className='before:absolute before:inset-0 before:z-9' />
                            <div className='flex w-full items-center gap-x-3'>
                              <div className='grow'>
                                <span className='text-sm font-medium text-stone-800 dark:text-neutral-200'>
                                  {item.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='size-px px-5 py-3 whitespace-nowrap'>
                            <span className='text-sm text-stone-600 dark:text-neutral-400'>
                              {item.quantity}
                            </span>
                          </td>
                          <td className='size-px px-5 py-3 whitespace-nowrap'>
                            <span className='text-sm text-stone-600 dark:text-neutral-400'>
                              {item.minThreshold}
                            </span>
                          </td>
                          <td className='size-px px-5 py-3 whitespace-nowrap'>
                            <span className='text-sm text-stone-600 dark:text-neutral-400'>
                              {new Date(item.updatedAt).toLocaleString().split(',')[0]}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
            </tbody>
          </table>
          {/* End Table */}
        </div>
      </div>
    </div>
  )
}

export default ProductsTable
