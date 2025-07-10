import { hapticFeedback } from '@telegram-apps/sdk'
import React, { ChangeEvent, FC } from 'react'

interface IProps {
  disabled?: boolean
  defaultChecked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
const Switch: FC<IProps> = ({ disabled, defaultChecked, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    hapticFeedback.selectionChanged()
  }

  return (
    <label className='relative inline-block w-11 h-6 cursor-pointer'>
      <input
        disabled={disabled}
        type='checkbox'
        className='peer sr-only'
        defaultChecked={defaultChecked}
        onChange={handleChange}
      />
      <span className='absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-green-600 dark:bg-neutral-700 dark:peer-checked:bg-green-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none' />
      <span className='absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
    </label>
  )
}

export default Switch
