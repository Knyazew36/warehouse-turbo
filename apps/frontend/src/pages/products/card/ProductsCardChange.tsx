import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import { formatNumber } from '@/shared/utils/formatNumber'
import clsx from 'clsx'
import { FC, useState } from 'react'
import ProductDelete from '../delete/ProductDelete'
import { useUpdateProduct } from '@/entitites/product/api/product.api'
import Switch from '@/shared/ui/switch/ui/Switch'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import Spinner from '@/shared/spinner/Spinner'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { Textarea } from '@/components/ui/textarea'

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

  comment?: {
    text: string
    onChange: (text: string) => void
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
  comment,
  inputNumberLabel
}) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct()
  const [isDeleting, setIsDeleting] = useState(false)

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
  const isLoading = withSaveButton?.isLoading || isPending || isDeleting

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-y-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-2xs md:p-5 lg:gap-y-5 dark:border-neutral-800 dark:bg-neutral-900',
        +data.quantity < +data.minThreshold && isActive && '!border-red-500',
        !isActive && 'opacity-50'
      )}
    >
      {isLoading && <LoaderSection />}
      <div className='flex items-center justify-between'>
        {withDelete && (
          <div>
            <ProductDelete
              productId={data.id}
              onLoadingChange={setIsDeleting}
            />
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

      <div className='inline-flex items-center justify-center'>
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
        <span className='block text-sm text-gray-500 dark:text-neutral-500'>остаток на складе</span>

        <h3 className='text-3xl font-semibold text-gray-800 sm:text-4xl lg:text-5xl dark:text-neutral-200'>{`${formatNumber(
          +data.quantity
        )} ${data.unit ? data.unit : ''}`}</h3>

        {withInputNumber && (
          <div className='mt-4 flex flex-col gap-2'>
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>
              {inputNumberLabel}
            </span>
            <div className='flex w-full items-center gap-x-2'>
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
                  className='inline-flex h-10 w-30 items-center justify-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:bg-green-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
                >
                  Сохранить
                </button>
              )}
            </div>
          </div>
        )}

        {comment && (
          <div className='mt-4'>
            <Textarea
              value={comment.text}
              onChange={e => comment.onChange(e.target.value)}
              placeholder='Комментарий. (необязательно)'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsCardChange
