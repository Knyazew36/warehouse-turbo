import clsx from 'clsx'
import React from 'react'

interface IBlocked {
  title?: string
  variant?: 'block' | 'process'
}

const Blocked = ({ title, variant = 'block' }: IBlocked) => {
  return (
    <div className='absolute inset-0  justify-center items-center flex flex-col bg-black/80   z-50 '>
      {variant === 'block' && (
        <svg
          className='text-orange-600'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          // class='lucide lucide-user-lock-icon lucide-user-lock'
        >
          <circle
            cx='10'
            cy='7'
            r='4'
          />
          <path d='M10.3 15H7a4 4 0 0 0-4 4v2' />
          <path d='M15 15.5V14a2 2 0 0 1 4 0v1.5' />
          <rect
            width='8'
            height='5'
            x='13'
            y='16'
            rx='.899'
          />
        </svg>
      )}
      {/* {variant === 'process' && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='text-yellow-600 '
          width={24}
          height={24}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2v4' />
          <path d='m16.2 7.8 2.9-2.9' />
          <path d='M18 12h4' />
          <path d='m16.2 16.2 2.9 2.9' />
          <path d='M12 18v4' />
          <path d='m4.9 19.1 2.9-2.9' />
          <path d='M2 12h4' />
          <path d='m4.9 4.9 2.9 2.9' />
        </svg>
      )} */}
      {title && <p className={clsx('text-orange-600  text-sm', variant === 'process' && 'text-yellow-600')}>{title}</p>}
    </div>
  )
}

export default Blocked
