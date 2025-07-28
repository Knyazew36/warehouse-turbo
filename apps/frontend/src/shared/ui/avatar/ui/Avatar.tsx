import { getFullName } from '@/shared/utils/getFullName'
import React from 'react'

interface IProps {
  src?: string
  firstName?: string
  lastName?: string
}

const Avatar = ({ src, firstName, lastName }: IProps) => {
  return (
    <div className='shrink-0 relative size-11 md:w-15.5 md:h-15.5 mx-auto'>
      {src ? (
        <img
          className='shrink-0 size-11 md:w-15.5 md:h-15.5 rounded-full'
          src={src}
          alt='Avatar'
        />
      ) : (
        <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
          {
            getFullName({
              firstName,
              lastName
            }).initials
          }
        </span>
      )}
    </div>
  )
}

export default Avatar
