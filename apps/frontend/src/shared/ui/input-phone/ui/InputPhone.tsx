import React, { FC, forwardRef } from 'react'

import { InputMask } from '@react-input/mask'
import ErrorText from '../../error-text/ui/ErrorText'

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string
  label?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
}

const InputPhone: FC<IProps> = forwardRef<HTMLInputElement, IProps>(
  ({ placeholder, label, error, value, onChange, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1'>
        {label && <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>{label}</label>}
        <InputMask
          className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
          mask='+7 (___) ___-__-__'
          replacement={{ _: /\d/ }}
          inputMode='tel'
          onPaste={e => {
            const pasted = e.clipboardData.getData('Text')
            let cleaned = pasted.replace(/\D/g, '')

            // Если номер начинается с 8, заменяем на 7
            if (cleaned.length >= 10) {
              if (cleaned[0] === '8') {
                cleaned = '7' + cleaned.slice(1)
              } else if (cleaned[0] === '9' && cleaned.length === 10) {
                // Если скопировали без кода страны, добавляем 7
                cleaned = '7' + cleaned
              }
            }

            // Формируем строку в формате +7 (999) 999-99-99
            let formatted = '+7 ('
            formatted += cleaned.slice(1, 4)
            if (cleaned.length > 4) {
              formatted += ') ' + cleaned.slice(4, 7)
            }
            if (cleaned.length > 7) {
              formatted += '-' + cleaned.slice(7, 9)
            }
            if (cleaned.length > 9) {
              formatted += '-' + cleaned.slice(9, 11)
            }

            onChange?.(formatted)
            e.preventDefault()
          }}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
        />
        {error && <ErrorText message={error} />}
      </div>
    )
  }
)

InputPhone.displayName = 'InputPhone'

export default InputPhone
