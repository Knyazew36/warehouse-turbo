import React from 'react'
import ErrorText from '../../error-text/ui/ErrorText'

const InputDefault = ({
  value,
  onChange,
  placeholder = 'Поиск товара...',
  type = 'text',
  error,
  disabled,
  label
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  label?: string
}) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && <label className='sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500'>{label}</label>}
      <input
        type={type}
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
        placeholder={placeholder}
      />
      {error && <ErrorText message={error} />}
    </div>
  )
}

export default InputDefault
