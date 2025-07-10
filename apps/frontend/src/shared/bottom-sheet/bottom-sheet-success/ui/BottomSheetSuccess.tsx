import React, { useEffect } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { IBottomSheetSuccessProps } from '../model/bottomSheetSuccess.type'
import { hapticFeedback } from '@telegram-apps/sdk-react'

const BottomSheetSuccess = ({ isOpen, onClose, description, title = 'Успех!' }: IBottomSheetSuccessProps) => {
  useEffect(() => {
    if (isOpen) {
      hapticFeedback.notificationOccurred('success')
    }
  }, [isOpen])
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      activeSnapPoint={1}
    >
      <DrawerContent className='bg-white dark:bg-neutral-900'>
        <div className='flex flex-col px-4 pb-8 pt-5'>
          {/* Icon */}
          <div className='mb-5 sm:mb-7 text-center'>
            <span className='shrink-0 size-14 md:size-16 mx-auto flex justify-center items-center border-2 border-green-500 text-green-500 rounded-full'>
              <svg
                className='shrink-0 size-8'
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
                <path d='M20 6 9 17l-5-5' />
              </svg>
            </span>
          </div>
          {/* End Icon */}
          {/* Heading */}
          <div className='mb-5 sm:mb-8 text-center'>
            <h1 className='mb-1 md:mb-3 font-semibold text-xl md:text-2xl text-gray-800 dark:text-neutral-200'>
              {title}
            </h1>
            {description && <p className='text-sm text-gray-500 dark:text-neutral-500'>{description}</p>}
          </div>
          {/* End Heading */}
          <DrawerClose>
            <button
              onClick={() => {
                hapticFeedback.impactOccurred('rigid')
              }}
              className='py-2.5  w-full sm:py-3 px-4  inline-flex justify-center items-center gap-x-2 font-medium sm:text-sm rounded-xl border border-transparent bg-green-600 text-white hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-green-600'
            >
              Назад
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BottomSheetSuccess
