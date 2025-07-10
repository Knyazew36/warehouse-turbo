import React from 'react'
import { ISelectOption } from '../model/select.type'

interface SelectProps {
  options: ISelectOption[]
  value: string
  onChange: (value: string) => void
  defaultValue?: string
  disabled?: boolean
}

const Select = ({ options, value, onChange, defaultValue, disabled }: SelectProps) => {
  return (
    <select
      className='py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      {defaultValue && <option value=''>{defaultValue}</option>}
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
