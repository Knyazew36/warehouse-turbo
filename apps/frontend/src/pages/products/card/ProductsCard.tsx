import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import clsx from 'clsx'
import { FC } from 'react'

export interface IProductsCard {
  // title: string
  // updatedAt: string
  // min: number
  // count: number
  // ed: string

  data: Product
  variant?: 'default' | 'change'
}

const ProductsCard: FC<IProductsCard> = ({ data, variant = 'default' }) => {
  return (
    <div
      className={clsx(
        'flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800',
        data.quantity < data.minThreshold && '!border-red-500'
      )}
    >
      <div className='inline-flex justify-center items-center'>
        <span
          className={clsx(
            'size-2 inline-block  rounded-full me-2',
            data.quantity < data.minThreshold ? 'bg-red-500' : 'bg-gray-500'
          )}
        />
        <span className='text-xs font-semibold uppercase text-gray-600 dark:text-white'>{data.name}</span>
      </div>

      <div className='text-center'>
        <span className='block text-sm text-gray-500 dark:text-neutral-500'>остаток на складе</span>

        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200'>{`${
          data.quantity
        } ${data.unit ? data.unit : ''}`}</h3>
        {variant === 'change' && (
          <div className='flex flex-col gap-2 mt-4'>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>Израсходовано</span>

            <InputNumber
              onChange={value => console.log(value)}
              value={1}
            />
          </div>
        )}
      </div>
      {variant !== 'change' && (
        <dl className='flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800'>
          <dt className='pe-3 flex flex-col'>
            <span className='text-green-600 self-end'>
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
              <span className='inline-block  text-sm'>{data.minThreshold}</span>
            </span>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>мин. остаток</span>
          </dt>
          <dd className='text-start ps-3'>
            <span className='text-sm font-semibold  text-gray-500 dark:text-neutral-500'>
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
