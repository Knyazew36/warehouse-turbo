import React, { useEffect, useState } from 'react'
import { ISelectOption } from '@/shared/ui/select/model/select.type'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import Select from 'react-select'
import Divide from '@/shared/ui/divide/ui/Divide'
import { Controller, useForm } from 'react-hook-form'
import { useCreateCategory } from '../../api/category.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { useQueries, useQueryClient } from '@tanstack/react-query'

interface IProps {
  data: ISelectOption[]
}
type FormValues = {
  name: string
  description: string
  color: string
  icon: string
}

const CategorySelectModal = ({ data }: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { open } = useBottomSheetStore()
  const queryClient = useQueryClient()

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    mode: 'onSubmit',
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
        description: 'Категория успешно создана. Теперь вы можете выбрать ее из списка.'
      })

      queryClient.invalidateQueries({ queryKey: ['category-select-options'] })
      hapticFeedback.notificationOccurred('success')
    } catch (e: any) {
      hapticFeedback.notificationOccurred('error')
    } finally {
      setButtonLoading(false)
      // Сбрасываем форму после успешного создания
    }
  }

  // Custom styles for react-select to match the app's design system
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '40px',

      padding: '6px 8px',
      border: '1px solid #e5e7eb',
      borderRadius: '13px',
      fontSize: '16px',
      backgroundColor: 'white',
      '&:hover': {
        borderColor: '#3b82f6'
      },
      '&:focus-within': {
        borderColor: '#3b82f6'
      },
      ...(state.isFocused && {
        borderColor: '#3b82f6'
      }),
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#171717',
        borderColor: '#404040',
        color: '#a3a3a3'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      },
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#404040' : 'transparent',
        color: state.isSelected ? 'white' : '#a3a3a3',
        '&:hover': {
          backgroundColor: state.isSelected ? '#3b82f6' : '#404040'
        }
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#171717',
        borderColor: '#404040'
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#e5e7eb',
      borderRadius: '6px',
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#404040'
      }
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#374151',
      '@media (prefers-color-scheme: dark)': {
        color: '#a3a3a3'
      }
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#d1d5db',
        color: '#374151'
      },
      '@media (prefers-color-scheme: dark)': {
        color: '#737373',
        '&:hover': {
          backgroundColor: '#525252',
          color: '#a3a3a3'
        }
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      '@media (prefers-color-scheme: dark)': {
        color: '#737373'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151',
      '@media (prefers-color-scheme: dark)': {
        color: '#a3a3a3'
      }
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#374151',

      '@media (prefers-color-scheme: dark)': {
        color: '#a3a3a3'
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger>
        <button
          type='button'
          className='block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-start text-[15px] transition-transform duration-150 ease-in-out select-none focus:border-blue-500 focus:ring-blue-500 active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:py-3 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
        >
          {watch('name') || 'Выберите категорию'}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Категории</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-1'>
          <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
            Выберите категорию
          </label>

          <Select
            options={data}
            // onChange={value => {
            //   console.log(value)
            // }}
            // value={watch('name')}
            // isMulti
            className='w-full'
            styles={customStyles}
            placeholder='Выберите категорию...'
            noOptionsMessage={() => 'Нет доступных категорий'}
          />
        </div>

        <div className='mx-auto my-2 h-px w-28 bg-gray-300 dark:bg-neutral-700' />

        <form
          className='flex flex-col gap-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Controller
              control={control}
              name='name'
              rules={{
                // required: 'Название обязательно',
                validate: value => {
                  if (!value || value.trim().length === 0) {
                    return 'Название обязательно'
                  }
                }
              }}
              render={({ field }) => (
                <InputDefault
                  label='Или создайте новую'
                  {...field}
                  placeholder='Категория'
                  error={errors.name?.message}
                />
              )}
            />
          </div>

          <button className='ms-auto rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-800 shadow-2xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
            Добавить
          </button>
        </form>

        <div className='flex items-center justify-end gap-x-2 border-t border-gray-200 py-3 dark:border-neutral-700'>
          <DialogClose>
            <button
              type='button'
              className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
            >
              Отмена
            </button>
          </DialogClose>

          <button className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'>
            Сохранить
          </button>
        </div>

        {/* </div> */}

        {/* <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader> */}
      </DialogContent>
    </Dialog>
  )
}

export default CategorySelectModal
