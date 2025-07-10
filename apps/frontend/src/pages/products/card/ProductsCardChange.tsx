import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import clsx from 'clsx'
import { FC, useState } from 'react'
import ProductDelete from '../delete/ProductDelete'
import { useUpdateProduct } from '@/entitites/product/api/product.api'
import Switch from '@/shared/ui/switch/ui/Switch'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import Spinner from '@/shared/spinner/Spinner'

export interface IProductsCard {
  value?: number
  onChange?: (value: number | undefined) => void
  data: Product
  withDelete?: boolean
  withSwitch?: boolean
  withInputNumber?: boolean
  // withSaveButton?: boolean
  min?: number
  max?: number
  isActive?: boolean
  onChangeCallback?: () => void
  onChangeActive?: (active: boolean) => void

  inputNumberLabel?: string

  withSaveButton?: {
    onSave?: (id: number, minThreshold: number) => void
    isLoading?: boolean
  }
}

const ProductsCardChange: FC<IProductsCard> = ({
  data,
  isActive = true,
  onChangeCallback,
  withDelete,
  withInputNumber,
  onChange,
  value,
  min,
  max,
  withSwitch,
  withSaveButton,
  onChangeActive,

  inputNumberLabel
}) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct()

  // Локальное состояние для minThreshold
  const [localMinThreshold, setLocalMinThreshold] = useState<number | undefined>(value)

  const onSwitchChange = () => {
    updateProduct({ id: data.id, dto: { active: !data.active } })
  }

  const handleSave = () => {
    if (localMinThreshold !== undefined) {
      // Если передан кастомный обработчик, используем его
      if (withSaveButton?.onSave) {
        withSaveButton.onSave(data.id, localMinThreshold)
      } else {
        // Иначе используем встроенную логику
        updateProduct({ id: data.id, dto: { minThreshold: localMinThreshold } })
      }
    }
  }

  const handleInputChange = (newValue: number | undefined) => {
    setLocalMinThreshold(newValue)
    // Если кнопка сохранения не используется, вызываем onChange сразу
    if (!withSaveButton && onChange) {
      onChange(newValue)
    }
  }

  // Определяем состояние загрузки
  const isLoading = withSaveButton?.isLoading || isPending

  return (
    <div
      className={clsx(
        'flex flex-col gap-y-3 relative overflow-hidden lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800',
        data.quantity < data.minThreshold && isActive && '!border-red-500',
        !isActive && 'opacity-50 '
      )}
    >
      {isLoading && <LoaderSection />}
      <div className='flex justify-between items-center'>
        {withDelete && (
          <div>
            <ProductDelete productId={data.id} />
          </div>
        )}

        {withSwitch && (
          <Switch
            disabled={isLoading}
            defaultChecked={data.active}
            onChange={onSwitchChange}
          />
        )}
      </div>

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

        {withInputNumber && (
          <div className='flex flex-col gap-2 mt-4'>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>{inputNumberLabel}</span>
            <div className='flex items-center gap-x-2 w-full'>
              {withInputNumber && (
                <InputNumber
                  onChange={handleInputChange}
                  value={withSaveButton ? localMinThreshold : value}
                  min={min}
                  max={max}
                />
              )}
              {withSaveButton && (
                <button
                  type='button'
                  onClick={handleSave}
                  disabled={isLoading || localMinThreshold === value}
                  className='py-2 h-10 w-30  justify-center  px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none'
                >
                  Сохранить
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsCardChange
