import React, { useEffect, useRef, useState } from 'react'
import { ISelectOption } from '@/shared/ui/select/model/select.type'

import { Controller, useForm } from 'react-hook-form'
import { useCreateCategory } from '../../api/category.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import InputDefault from '@/shared/ui/input-default/ui/InputDefault'
import { useQueries, useQueryClient } from '@tanstack/react-query'

interface IProps {
  data: ISelectOption[]
  value?: ISelectOption | null
  onChange?: (value: ISelectOption | null) => void
  placeholder?: string
}

type FormValues = {
  name: string
  description: string
  color: string
  icon: string
}

const CategorySelectModal = ({
  data,
  value,
  onChange,
  placeholder = 'Выберите категорию'
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { open } = useBottomSheetStore()
  const queryClient = useQueryClient()
  const ref = useRef<any>(null)

  useEffect(() => {
    if (ref.current && isOpen) {
      ref.current.blur()
    }
  }, [ref, isOpen])

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
      const newCategory = await createCategory({
        name: data.name.trim(),
        description: '',
        color: '',
        icon: ''
      })

      // Автоматически выбираем созданную категорию
      const selectedOption: ISelectOption = {
        value: newCategory.id,
        label: newCategory.name
      }
      if (onChange) {
        onChange(selectedOption)
      }

      open({
        isOpen: true,
        description: 'Категория успешно создана и выбрана.'
      })

      // queryClient.invalidateQueries({ queryKey: ['category-select-options'] })

      // Закрываем модальное окно после создания
      onClose()
    } catch (e: any) {
      hapticFeedback.notificationOccurred('error')
    } finally {
      setButtonLoading(false)
      // Сбрасываем форму после успешного создания
      reset()
    }
  }

  const onClose = () => {
    reset()
    setIsOpen(false)
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value

    // Ищем опцию по значению, учитывая что value может быть строкой или числом
    const selectedOption = data.find(item => {
      const itemValue = typeof item.value === 'number' ? item.value.toString() : item.value
      return itemValue === selectedValue
    })

    hapticFeedback.selectionChanged()

    if (onChange && selectedOption) {
      onChange(selectedOption)
      onClose()
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
    <div className='flex flex-col gap-2 rounded-md border-1 border-dashed border-neutral-700 p-3'>
      <div className='flex flex-col gap-1'>
        <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
          Выберите категорию
        </label>

        {/* <Select
          ref={ref}
          options={data}
          onChange={handleSelectChange}
          value={value}
          className='w-full'
          styles={customStyles}
          placeholder='Выберите категорию...'
          noOptionsMessage={() => 'Нет доступных категорий'}
        /> */}

        <select
          ref={ref}
          onChange={handleSelectChange}
          value={value?.value?.toString() || ''}
          className='block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
          // styles={customStyles}
        >
          <option value=''>Выберите категорию...</option>
          {data.map(item => (
            <option
              key={item.value}
              value={item.value.toString()}
            >
              {item.label}
            </option>
          ))}
        </select>
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

        <button
          type='button'
          onClick={() => {
            hapticFeedback.impactOccurred('light')
            handleSubmit(onSubmit)()
          }}
          disabled={isSubmitting || buttonLoading}
          className='ms-auto rounded-md border border-blue-200 bg-white px-1.5 py-1 text-xs text-blue-800 shadow-2xs disabled:pointer-events-none disabled:opacity-50 dark:border-blue-700 dark:bg-blue-800 dark:text-neutral-300'
        >
          Добавить
        </button>
      </form>
    </div>
  )
}

export default CategorySelectModal
