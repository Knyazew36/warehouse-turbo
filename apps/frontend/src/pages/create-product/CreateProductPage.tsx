import { Page } from '@/components/Page'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import InputNumber from '@/shared/input-number/InputNumber'
import { hapticFeedback, showPopupError } from '@telegram-apps/sdk-react'
import ButtonAction from '@/shared/button-action/ButtonAction'
import { useCreateProduct } from '@/entitites/product/api/product.api'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import InfoMessage from '@/shared/ui/info/ui/Info'
import AsyncSelect from 'react-select/async'
import { useCategorySelectOptions } from '@/entitites/category/api/category.api'

import Select from 'react-select'
import CategorySelectModal from '@/entitites/category/ui/category-select-modal/CategorySelectModal'
import { ISelectOption } from '@/shared/ui/select/model/select.type'

type FormValues = {
  name: string
  minThreshold: number | undefined
  unit: string
  quantity: number | undefined
  category: ISelectOption
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
    defaultValues: {
      name: '',
      minThreshold: undefined,
      quantity: undefined,
      unit: 'ед',
      category: undefined
    }
  })
  const { mutateAsync: createProduct } = useCreateProduct()
  const [buttonLoading, setButtonLoading] = useState(false)

  const { data: categories } = useCategorySelectOptions(true)

  const onSubmit = async (data: FormValues) => {
    try {
      setButtonLoading(true)

      await createProduct({
        name: data.name.trim(),
        quantity: data.quantity || 0,
        minThreshold: data.minThreshold || 0,
        unit: `${data.unit.trim()[0].toLowerCase()}${data.unit.trim().slice(1)}` || 'ед',
        categoryId: data.category.value ? +data.category.value : undefined
      })

      open({
        isOpen: true,
        description:
          'Товар успешно создан. Вы можете добавить еще один товар или вернуться на главную страницу.'
      })
      hapticFeedback.notificationOccurred('success')
      handleReset()
    } catch (e: any) {
      hapticFeedback.notificationOccurred('error')
    } finally {
      setButtonLoading(false)
      // Сбрасываем форму после успешного создания
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
                placeholder='Товар'
                error={errors.name?.message}
              />
            )}
          />
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

          {/* <AsyncSelect
            cacheOptions
            loadOptions={categories}
            defaultOptions
          /> */}

          {/* <Select
            // defaultValue={[colourOptions[2], colourOptions[3]]}
            isMulti
            name='colors'
            options={categories}
            className='basic-multi-select'
            classNamePrefix='select'
          />

          <button
            type='button'
            className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
            aria-haspopup='dialog'
            aria-expanded='false'
            aria-controls='hs-toggle-password-modal-example'
            data-hs-overlay='#hs-toggle-password-modal-example'
          >
            Open modal
          </button>

          <div
            id='hs-toggle-password-modal-example'
            className='hs-overlay pointer-events-none fixed start-0 top-0 z-80 hidden size-full overflow-x-hidden overflow-y-auto'
            role='dialog'
            aria-labelledby='hs-modal-example-label'
          >
            <div className='hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 m-3 mt-0 opacity-0 transition-all ease-out sm:mx-auto sm:w-full sm:max-w-lg'>
              <div className='pointer-events-auto flex flex-col rounded-xl border border-gray-200 bg-white shadow-2xs dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/70'>
                <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700'>
                  <h3
                    id='hs-modal-example-label'
                    className='font-bold text-gray-800 dark:text-white'
                  >
                    Modal example
                  </h3>
                  <button
                    type='button'
                    className='inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600'
                    aria-label='Close'
                    data-hs-overlay='#hs-toggle-password-modal-example'
                  >
                    <span className='sr-only'>Close</span>
                    <svg
                      className='size-4 shrink-0'
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    >
                      <path d='M18 6 6 18'></path>
                      <path d='m6 6 12 12'></path>
                    </svg>
                  </button>
                </div>
                <div className='min-h-60 overflow-y-auto p-4'>
                  <select
                    data-hs-select='{
          "placeholder": "Select option...",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
          "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
          "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"hidden hs-selected:block\"><svg className=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
          "extraMarkup": "<div className=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg className=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
        }'
                    className='hidden'
                  >
                    <option value=''>Choose</option>
                    {categories?.map(category => (
                      <option value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div className='flex items-center justify-end gap-x-2 border-t border-gray-200 px-4 py-3 dark:border-neutral-700'>
                  <button
                    type='button'
                    className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                    data-hs-overlay='#hs-toggle-password-modal-example'
                  >
                    Close
                  </button>
                  <a
                    className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
                    href='#'
                  >
                    Save changes
                  </a>
                </div>
              </div>
            </div>
          </div> */}

          <label>
            <Controller
              control={control}
              name='quantity'
              render={({ field }) => (
                <InputNumber
                  label='В наличии'
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

      <InfoMessage
        className='mt-4'
        items={[
          'Минимальный остаток - это количество товара, при котором будут отправляться уведомления о том, что товар заканчивается.'
        ]}
      />

      <div className='sticky bottom-4'>
        <button
          onClick={() => {
            hapticFeedback.impactOccurred('light')
            handleSubmit(onSubmit)()
          }}
          className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white transition-transform duration-150 ease-in-out select-none hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-sm'
        >
          Создать товар
        </button>
      </div>
      <ButtonAction
        onSuccessClick={handleSubmit(onSubmit)}
        onCancelClick={handleReset}
        isLoading={buttonLoading}
      />
    </Page>
  )
}

export default CreateProductPage
