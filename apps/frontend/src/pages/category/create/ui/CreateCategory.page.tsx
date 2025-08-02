import { Page } from '@/components/Page'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import ButtonAction from '@/shared/button-action/ButtonAction'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { useCreateCategory } from '@/entitites/category/api/category.api'

type FormValues = {
  name: string
  description: string
  color: string
  icon: string
}
const CreateCategoryPage = () => {
  const { open } = useBottomSheetStore()
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    defaultValues: { name: '' }
  })
  const { mutateAsync: createCategory } = useCreateCategory()
  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async (data: FormValues) => {
    try {
      setButtonLoading(true)
      await createCategory({
        name: data.name.trim(),
        description: '',
        color: '',
        icon: ''
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
        name: ''
      })
    }, 0)
  }

  return (
    <Page back>
      <PageHeader title='Создать категорию' />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative flex flex-col gap-y-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-2xs md:p-5 lg:gap-y-5 dark:border-neutral-800 dark:bg-neutral-900'
      >
        {/* Body */}
        <div className='flex flex-col gap-2 space-y-5'>
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
                placeholder='Категория'
                error={errors.name?.message}
              />
            )}
          />
        </div>
        {/* End Body */}
      </form>

      {/* <InfoMessage
        className='mt-4'
        items={[
          'Минимальный остаток - это количество товара, при котором будут отправляться уведомления о том, что товар заканчивается.'
        ]}
      /> */}
      <ButtonAction
        onSuccessClick={handleSubmit(onSubmit)}
        onCancelClick={handleReset}
        isLoading={buttonLoading}
      />
    </Page>
  )
}

export default CreateCategoryPage
