import { Page } from '@/components/Page'
import React, { useState, useEffect } from 'react'
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
import InfoMessage from '@/shared/ui/info/ui/Info'

type FormValues = {
  name: string
  minThreshold: number | undefined
  unit: string
  quantity: number | undefined
}
const CreateProductPage = () => {
  const { open } = useBottomSheetStore()
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    defaultValues: { name: '', minThreshold: undefined, quantity: undefined, unit: 'ед' }
  })
  const { mutateAsync: createProduct } = useCreateProduct()
  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async (data: FormValues) => {
    try {
      setButtonLoading(true)
      await createProduct({
        name: data.name.trim(),
        quantity: data.quantity || 0,
        minThreshold: data.minThreshold || 0,
        unit: `${data.unit.trim()[0].toLowerCase()}${data.unit.trim().slice(1)}` || 'ед'
      })

      open({
        isOpen: true,
        description:
          'Товар успешно создан. Вы можете добавить еще один товар или вернуться на главную страницу.'
      })
      hapticFeedback.notificationOccurred('success')
    } catch (e: any) {
      hapticFeedback.notificationOccurred('error')
    } finally {
      setButtonLoading(false)
      // Сбрасываем форму после успешного создания
      handleReset()
    }
  }

  const handleReset = () => {
    // Сначала сбрасываем к defaultValues
    reset()
    // Затем принудительно устанавливаем нужные значения
    setTimeout(() => {
      reset({
        name: '',
        minThreshold: undefined,
        quantity: undefined,
        unit: 'ед'
      })
    }, 0)
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
            rules={{
              required: 'Название обязательно',
              validate: value => {
                if (!value || value.trim().length === 0) {
                  return 'Название обязательно'
                }
              }
            }}
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
              // rules={{
              //   min: { value: 0, message: 'Не может быть меньше 0' }
              // }}
              render={({ field }) => (
                <InputNumber
                  label='Сейчас на складе'
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            {errors.quantity && (
              <p className='mt-1 text-xs text-red-500'>{errors.quantity.message}</p>
            )}
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
              // rules={{
              //   required: 'Мин. остаток обязателен'
              //   // min: { value: 0, message: 'Не может быть меньше 0' }
              // }}
              render={({ field }) => (
                <InputNumber
                  label='Минимальный остаток'
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            {errors.minThreshold && (
              <p className='mt-1 text-xs text-red-500'>{errors.minThreshold.message}</p>
            )}
          </label>
        </div>
        {/* End Body */}
      </form>
      <ButtonAction
        onSuccessClick={handleSubmit(onSubmit)}
        onCancelClick={handleReset}
        isLoading={buttonLoading}
      />

      <InfoMessage
        className='mt-4'
        items={[
          'Минимальный остаток - это количество товара, при котором будут отправляться уведомления о том, что товар заканчивается.'
        ]}
      />
    </Page>
  )
}

export default CreateProductPage
