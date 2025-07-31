import { InfoIcon } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'

interface InfoProps {
  title?: string
  items?: string[]
  text?: string
  className?: string
}

const InfoMessage: React.FC<InfoProps> = ({ title, items, text, className }) => {
  return (
    <div className={clsx('bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4', className)}>
      <div className='flex items-start space-x-3'>
        <div className='p-1 bg-blue-100 dark:bg-blue-900/20 rounded'>
          <InfoIcon className='w-4 h-4 text-blue-600 dark:text-blue-400' />
        </div>
        <div>
          {title && <h3 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-1'>{title}</h3>}
          {text && <p className='text-sm text-blue-800 dark:text-blue-200 mb-1'>{text}</p>}
          {items && items.length > 0 && (
            <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
              {items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoMessage
