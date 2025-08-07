import { Product } from '@/entitites/product/model/product.type'
import InputNumber from '@/shared/input-number/InputNumber'
import clsx from 'clsx'
import { FC, useState } from 'react'
import ProductDelete from '../delete/ProductDelete'
import { useUpdateProduct } from '@/entitites/product/api/product.api'
import Switch from '@/shared/ui/switch/ui/Switch'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import { useForm, Controller } from 'react-hook-form'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { ChangeEvent } from 'react'
import CategorySelectModal from '@/entitites/category/ui/category-select-modal/CategorySelectModal'
import { ISelectOption } from '@/shared/ui/select/model/select.type'
import { useCategorySelectOptions } from '@/entitites/category/api/category.api'

export interface IProductsCard {
  data: Product
}

type FormValues = {
  name: string
  unit: string
  minThreshold: number
  active: boolean
  category: ISelectOption
}

const ProductCardChangeForm: FC<IProductsCard> = ({ data }) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct()
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: categories } = useCategorySelectOptions(true)

  // Находим категорию по названию для инициализации формы
  const currentCategory = categories?.find(cat => cat.label === data.category)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<FormValues>({
    defaultValues: {
      name: data.name,
      unit: data.unit ?? '',
      minThreshold: +data.minThreshold || 0,
      active: data.active,
      category: currentCategory || undefined
    },
    mode: 'onChange'
  })

  const onSubmit = (formData: FormValues) => {
    console.info('formData', formData)
    updateProduct(
      {
        id: data.id,
        dto: {
          name: formData.name,
          unit: formData.unit,
          minThreshold: +formData.minThreshold || 0,
          active: formData.active,
          categoryId: formData.category?.value ? +formData.category.value : undefined
        }
      },
      {
        onSuccess: () => {
          reset(formData)
        }
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        'relative flex flex-col gap-y-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-2xs md:p-5 lg:gap-y-5 dark:border-neutral-800 dark:bg-neutral-900',
        !data.active && 'dark:bg-neutral-900/30'
      )}
    >
      {(isDeleting || isPending) && <LoaderSection />}
      <div className='flex items-center justify-between'>
        <div>
          <ProductDelete
            productId={data.id}
            onLoadingChange={setIsDeleting}
          />
        </div>

        <div className='flex gap-x-2'>
          <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
            Активен?
          </label>
          <Controller
            control={control}
            name='active'
            render={({ field }) => (
              <Switch
                disabled={isPending || isDeleting}
                defaultChecked={field.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
      </div>

      <div
        className={clsx('flex flex-col gap-y-3', !data.active && 'pointer-events-none opacity-30')}
      >
        <div className='grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0'>
          <div className='sm:col-span-3'>
            <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
              Название
            </label>
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

        <Controller
          control={control}
          name='category'
          render={({ field }) => (
            <CategorySelectModal
              data={categories || []}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className='grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0'>
          <div className='sm:col-span-3'>
            <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
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

        <div className='grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0'>
          <div className='sm:col-span-3'>
            <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
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
                  disabled={isPending || isDeleting}
                />
              )}
            />
            {errors.minThreshold && (
              <p className='mt-1 text-xs text-red-500'>{errors.minThreshold.message}</p>
            )}
          </div>
          {/* End Col */}
        </div>
      </div>
      <div className='mt-4 flex justify-end'>
        <button
          type='submit'
          onClick={handleSubmit(onSubmit)}
          disabled={isPending || isDeleting}
          className='inline-flex h-10 w-30 items-center justify-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:bg-green-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
        >
          Сохранить
        </button>
      </div>
    </form>
  )
}

export default ProductCardChangeForm
