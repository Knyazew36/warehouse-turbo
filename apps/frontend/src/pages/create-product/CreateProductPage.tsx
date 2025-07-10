import { Page } from '@/components/Page'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import InputNumber from '@/shared/input-number/InputNumber'
import { useNavigate } from 'react-router-dom'
import { hapticFeedback, showPopupError } from '@telegram-apps/sdk-react'
import ButtonAction from '@/shared/button-action/ButtonAction'
import { useCreateProduct } from '@/entitites/product/api/product.api'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import { Modal } from '@telegram-apps/telegram-ui'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import ErrorText from '@/shared/ui/error-text/ui/ErrorText'

type FormValues = {
  name: string
  minThreshold: number
  unit: string
  quantity: number
}
const CreateProductPage = () => {
  const navigate = useNavigate()
  const { open } = useBottomSheetStore()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    defaultValues: { name: '', minThreshold: 0, quantity: 0, unit: 'ед' }
  })
  const { mutateAsync: createProduct } = useCreateProduct()
  const [buttonLoading, setButtonLoading] = useState(false)
  const onSubmit = async (data: FormValues) => {
    try {
      setButtonLoading(true)
      await createProduct({
        name: data.name,
        quantity: data.quantity || 0,
        minThreshold: data.minThreshold || 0,
        unit: data.unit || 'ед'
      })

      open({
        isOpen: true,
        description: 'Товар успешно создан. Вы можете добавить еще один товар или вернуться на главную страницу.'
      })
      reset()
    } catch (e: any) {
      hapticFeedback.notificationOccurred('error')
      reset()
    } finally {
      setButtonLoading(false)
    }
  }
  return (
    <Page back>
      <PageHeader title='Создать товар' />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-y-3 relative overflow-hidden lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800'
      >
        {/* Body */}
        <div className=' space-y-5 gap-2 flex flex-col'>
          <Controller
            control={control}
            name='name'
            rules={{ required: 'Название обязательно' }}
            render={({ field }) => (
              <InputDefault
                label='Название'
                {...field}
                placeholder='Товар'
                error={errors.name?.message}
              />
            )}
          />

          <label>
            <Controller
              control={control}
              name='quantity'
              rules={{
                min: { value: 0, message: 'Не может быть меньше 0' }
              }}
              render={({ field }) => (
                <InputNumber
                  label='Сейчас на складе'
                  {...field}
                />
              )}
            />
            {errors.minThreshold && <p className='mt-1 text-xs text-red-500'>{errors.minThreshold.message}</p>}
          </label>

          <Controller
            control={control}
            name='unit'
            rules={{ required: 'Единица измерения обязательна' }}
            render={({ field }) => (
              <InputDefault
                label='Единица измерения'
                {...field}
                placeholder='Единица измерения'
                error={errors.unit?.message}
              />
            )}
          />
          <label>
            <Controller
              control={control}
              name='minThreshold'
              rules={{
                required: 'Мин. остаток обязателен',
                min: { value: 0, message: 'Не может быть меньше 0' }
              }}
              render={({ field }) => (
                <InputNumber
                  label='Минимальный остаток'
                  {...field}
                />
              )}
            />
            {errors.minThreshold && <p className='mt-1 text-xs text-red-500'>{errors.minThreshold.message}</p>}
          </label>
        </div>
        {/* End Body */}
      </form>
      <ButtonAction
        onSuccessClick={handleSubmit(onSubmit)}
        onCancelClick={() => {
          reset()
        }}
        isLoading={buttonLoading}
      />
    </Page>
  )
}

export default CreateProductPage
