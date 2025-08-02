import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import { formatNumber } from '@/shared/utils/formatNumber'
import clsx from 'clsx'
import { FC } from 'react'

export interface IProductsCard {
  data: Product
  variant?: 'default' | 'change'
}

const ProductsCard: FC<IProductsCard> = ({ data, variant = 'default' }) => {
  return (
    <div
      className={clsx(
        'flex flex-1 flex-col gap-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs md:p-5 lg:gap-y-5 dark:border-neutral-800 dark:bg-neutral-900',
        +data.quantity < +data.minThreshold && '!border-red-500'
      )}
    >
      <div className='flex items-center justify-center truncate'>
        <span
          className={clsx(
            'me-2 inline-block size-2 shrink-0 rounded-full',
            +data.quantity < +data.minThreshold ? 'bg-red-500' : 'bg-gray-500'
          )}
        />
        <span className='truncate text-xs font-semibold text-gray-600 uppercase dark:text-white'>
          {data.name}
        </span>
      </div>

      <div className='text-center'>
        <span className='block text-sm text-gray-500 dark:text-neutral-500'>остаток</span>

        <h3 className='text-3xl font-semibold text-gray-800 sm:text-4xl lg:text-5xl dark:text-neutral-200'>
          {`${formatNumber(+data.quantity)} `}

          <span className='text-xl dark:text-neutral-400'>{data.unit ? data.unit : ''}</span>
        </h3>
        {variant === 'change' && (
          <div className='mt-4 flex flex-col gap-2'>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>Израсходовано</span>

            <InputNumber
              onChange={value => console.log(value)}
              value={1}
            />
          </div>
        )}
      </div>
      {variant !== 'change' && (
        <dl className='flex items-center justify-center divide-x divide-gray-200 dark:divide-neutral-800'>
          <dt className='flex flex-col pe-3'>
            <span className='self-end text-green-600'>
              {/* <svg
                className='inline-block size-4 self-center'
                xmlns='http://www.w3.org/2000/svg'
                width={16}
                height={16}
                fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'
                />
              </svg> */}
              <span className='inline-block text-sm'>{formatNumber(+data.minThreshold)}</span>
            </span>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>мин. остаток</span>
          </dt>
          <dd className='ps-3 text-start'>
            <span className='text-sm font-semibold text-gray-500 dark:text-neutral-500'>
              {new Date(data.updatedAt).toLocaleString().split(',')[0]}
            </span>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>обновление</span>
          </dd>
        </dl>
      )}
    </div>
  )
}

export default ProductsCard
