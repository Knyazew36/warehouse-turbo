// src/shared/input-number/InputNumber.tsx
import { hapticFeedback } from '@telegram-apps/sdk-react'
import React, { useState } from 'react'
import { useNumberFormat } from '@react-input/number-format'
export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Значение поля */
  value?: number | null
  /** Коллбек изменения значения */
  onChange: (value: number | undefined) => void
  /** Шаг инкремента/декремента */
  step?: number
  /** Минимальное значение */
  min?: number
  /** Максимальное значение */
  max?: number
  label?: string
}

const InputNumber: React.FC<InputNumberProps> = ({
  value,
  onChange,
  step = 1,
  min,
  max,
  disabled,
  label,
  ...inputProps
}) => {
  const [isFirstInput, setIsFirstInput] = useState(true)
  const inputRef = useNumberFormat({
    locales: 'ru',
    maximumFractionDigits: 2
  })

  const handleDecrement = () => {
    const currentValue = value ?? 0
    const next = currentValue - step
    if ((min !== undefined && next < min) || next < 0) return
    onChange(next)
    hapticFeedback.impactOccurred('light')
  }

  const handleIncrement = () => {
    const currentValue = value ?? 0
    const next = currentValue + step
    if (max !== undefined && next > max) return
    onChange(next)
    hapticFeedback.impactOccurred('light')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    inputValue = inputValue.replace(/[^\d.,-]/g, '')

    // Заменяем запятую на точку
    inputValue = inputValue.replace(',', '.')

    // Убираем лишние точки (оставляем только первую)
    const parts = inputValue.split('.')
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('')
    }

    // Если поле пустое, устанавливаем undefined
    if (inputValue === '' || inputValue === '-') {
      onChange(undefined)
      setIsFirstInput(false)
      return
    }

    const v = Number(inputValue)

    // Проверяем, что это валидное число
    if (isNaN(v)) {
      onChange(undefined)
    } else {
      if (min !== undefined && v < min) {
        onChange(min)
      } else if (max !== undefined && v > max) {
        onChange(max)
      } else {
        onChange(v)
      }
    }

    setIsFirstInput(false)
  }

  const handleFocus = () => {
    // Сбрасываем флаг первого ввода при фокусе
    setIsFirstInput(true)

    // Выделяем весь текст при фокусе
    if (inputRef.current) {
      inputRef.current.select()
    }
  }
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <label className='sm:mt-2.5 inline-block text-sm bg-transparent text-gray-500 dark:text-neutral-500'>
          {label}
        </label>
      )}

      {/* Input Number */}
      <div className='py-2 px-3 bg-white border w-full border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700'>
        <div className='w-full flex justify-between items-center gap-x-3'>
          <input
            {...inputProps}
            ref={inputRef}
            className='w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white'
            style={{ MozAppearance: 'textfield' }}
            type='number'
            value={value === undefined || value === null ? '' : value}
            onChange={handleInputChange}
            disabled={disabled}
            inputMode='decimal'
            placeholder='0'
            onFocus={handleFocus}
          />
          <div className='flex justify-end items-center gap-x-1.5'>
            <button
              type='button'
              className='size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              tabIndex={-1}
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
            >
              <svg
                className='shrink-0 size-3.5'
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M5 12h14' />
              </svg>
            </button>
            <button
              type='button'
              className='size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              tabIndex={-1}
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
            >
              <svg
                className='shrink-0 size-3.5'
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M5 12h14' />
                <path d='M12 5v14' />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* End Input Number */}
    </div>
  )
}

export default InputNumber
