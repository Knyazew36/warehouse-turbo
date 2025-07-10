import React, { FC } from 'react'
import { Product } from '@/entitites/product/model/product.type'

interface IProps {
  data: Product[]
}
const ProductsTable: FC<IProps> = ({ data }) => {
  return (
    data && (
      <div className='p-5 flex flex-col bg-white border border-stone-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 mt-4'>
        <div className='overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-stone-100 [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
          <div className='min-w-full inline-block align-middle'>
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
                        className='px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-stone-500 focus:outline-hidden focus:bg-stone-100 dark:text-neutral-500 dark:focus:bg-neutral-700'
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
                        className='px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-stone-500 focus:outline-hidden focus:bg-stone-100 dark:text-neutral-500 dark:focus:bg-neutral-700'
                      >
                        остаток
                      </button>
                    </div>
                    {/* End Sort Dropdown */}
                  </th>
                  <th scope='col'>
                    {/* Sort Dropdown */}
                    <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                      <div className='px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-stone-500 focus:outline-hidden focus:bg-stone-100 dark:text-neutral-500 dark:focus:bg-neutral-700'>
                        мин.
                      </div>
                    </div>
                    {/* End Sort Dropdown */}
                  </th>
                  <th scope='col'>
                    {/* Sort Dropdown */}
                    <div className='hs-dropdown relative inline-flex w-full cursor-pointer'>
                      <div className='px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-stone-500 focus:outline-hidden focus:bg-stone-100 dark:text-neutral-500 dark:focus:bg-neutral-700'>
                        обновление
                      </div>
                    </div>
                    {/* End Sort Dropdown */}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-stone-200 dark:divide-neutral-700'>
                {data &&
                  data.map(item => (
                    <tr
                      className='hover:bg-stone-100 cursor-pointer dark:hover:bg-neutral-700/50'
                      key={item.id}
                    >
                      <td className='size-px py-3 px-5 relative'>
                        <div className='before:z-9 before:absolute before:inset-0' />
                        <div className='w-full flex items-center gap-x-3'>
                          <div className='grow'>
                            <span className='text-sm font-medium text-stone-800 dark:text-neutral-200'>{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className='size-px whitespace-nowrap py-3 px-5'>
                        <span className='text-sm text-stone-600 dark:text-neutral-400'>{item.quantity}</span>
                      </td>
                      <td className='size-px whitespace-nowrap py-3 px-5'>
                        <span className='text-sm text-stone-600 dark:text-neutral-400'>{item.minThreshold}</span>
                      </td>
                      <td className='size-px whitespace-nowrap py-3 px-5'>
                        <span className='text-sm text-stone-600 dark:text-neutral-400'>{new Date(item.updatedAt).toLocaleString().split(',')[0]}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* End Table */}
          </div>
        </div>
      </div>
    )
  )
}

export default ProductsTable
