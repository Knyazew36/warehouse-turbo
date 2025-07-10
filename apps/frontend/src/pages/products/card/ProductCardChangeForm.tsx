import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import clsx from 'clsx'
import { FC } from 'react'
import ProductDelete from '../delete/ProductDelete'
import { useUpdateProduct } from '@/entitites/product/api/product.api'
import Switch from '@/shared/ui/switch/ui/Switch'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import { useForm, Controller } from 'react-hook-form'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { ChangeEvent } from 'react'

export interface IProductsCard {
  data: Product
}

type FormValues = {
  name: string
  unit: string
  minThreshold: number
  active: boolean
}

const ProductCardChangeForm: FC<IProductsCard> = ({ data }) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    watch
  } = useForm<FormValues>({
    defaultValues: {
      name: data.name,
      unit: data.unit ?? '',
      minThreshold: data.minThreshold ?? 0,
      active: data.active
    },
    mode: 'onChange'
  })

  const watched = watch()

  const onSubmit = (formData: FormValues) => {
    updateProduct(
      {
        id: data.id,
        dto: {
          name: formData.name,
          unit: formData.unit,
          minThreshold: formData.minThreshold,
          active: formData.active
        }
      },
      {
        onSuccess: () => {
          reset(formData)
        }
      }
    )
  }

  const isLoading = isPending
  const isChanged =
    isDirty &&
    (data.name !== watched.name ||
      (data.unit ?? '') !== watched.unit ||
      (data.minThreshold ?? 0) !== watched.minThreshold ||
      data.active !== watched.active)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        'flex flex-col gap-y-3 relative overflow-hidden lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800',
        !data.active && 'dark:bg-neutral-900/30'
      )}
    >
      {isLoading && <LoaderSection />}
      <div className='flex justify-between items-center'>
        <div>
          <ProductDelete productId={data.id} />
        </div>

        <div className='flex gap-x-2'>
          <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>Активен?</label>
          <Controller
            control={control}
            name='active'
            render={({ field }) => (
              <Switch
                disabled={isLoading}
                defaultChecked={field.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
      </div>

      <div className={clsx('flex flex-col gap-y-3', !data.active && 'opacity-30 pointer-events-none')}>
        <div className='grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5'>
          <div className='sm:col-span-3'>
            <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>Название</label>
          </div>
          {/* End Col */}
          <div className='sm:col-span-9'>
            <Controller
              control={control}
              name='name'
              rules={{ required: 'Название обязательно' }}
              render={({ field }) => (
                <InputDefault
                  {...field}
                  error={errors.name?.message}
                  placeholder='Название'
                />
              )}
            />
          </div>
          {/* End Col */}
        </div>
        <div className='grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5'>
          <div className='sm:col-span-3'>
            <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>
              Единица измерения
            </label>
          </div>
          {/* End Col */}
          <div className='sm:col-span-9'>
            <Controller
              control={control}
              name='unit'
              rules={{ required: 'Единица измерения обязательна' }}
              render={({ field }) => (
                <InputDefault
                  {...field}
                  error={errors.unit?.message}
                  placeholder='Единица измерения'
                />
              )}
            />
          </div>
          {/* End Col */}
        </div>

        <div className='grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5'>
          <div className='sm:col-span-3'>
            <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>
              Минимальный остаток на складе
            </label>
          </div>
          {/* End Col */}
          <div className='sm:col-span-9'>
            <Controller
              control={control}
              name='minThreshold'
              rules={{
                // required: 'Мин. остаток обязателен',
                min: { value: 0, message: 'Не может быть меньше 0' }
              }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  disabled={isLoading}
                />
              )}
            />
            {errors.minThreshold && <p className='mt-1 text-xs text-red-500'>{errors.minThreshold.message}</p>}
          </div>
          {/* End Col */}
        </div>
      </div>
      <div className='flex justify-end mt-4'>
        <button
          type='submit'
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isChanged || !isValid}
          className='py-2 h-10 w-30  justify-center  px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none'
        >
          Сохранить
        </button>
      </div>
    </form>
  )
}

export default ProductCardChangeForm
