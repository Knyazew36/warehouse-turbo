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

interface IProps {
  data: ISelectOption[]
}

const CategorySelectModal = ({ data }: IProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Custom styles for react-select to match the app's design system
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '44px',
      padding: '8px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
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
          className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
        >
          Open modal
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Категории</DialogTitle>
        </DialogHeader>
        <DialogDescription>Выберите категорию для товара или создайте новую</DialogDescription>

        <Select
          options={data}
          isMulti
          className='w-full'
          styles={customStyles}
          placeholder='Выберите категории...'
          noOptionsMessage={() => 'Нет доступных категорий'}
        />

        <div className='flex items-center justify-end gap-x-2 border-t border-gray-200 py-3 dark:border-neutral-700'>
          <DialogClose>
            <button
              type='button'
              className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
            >
              Close
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
