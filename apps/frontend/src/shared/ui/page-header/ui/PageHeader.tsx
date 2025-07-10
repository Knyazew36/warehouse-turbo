import Spinner from '@/shared/spinner/Spinner'
import React from 'react'

interface IPageHeader {
  title: string
  isLoading?: boolean
}

const PageHeader = ({ title, isLoading }: IPageHeader) => {
  return (
    <div className='flex justify-between  gap-x-5 items-center border-b border-gray-200 dark:border-neutral-700 pb-4 mb-8'>
      <h2 className='block font-bold text-lg sm:text-xl text-gray-800 dark:text-neutral-200'>{title}</h2>
      {isLoading && <Spinner size={9} />}
    </div>
  )
}

export default PageHeader
