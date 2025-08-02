import React, { useEffect } from 'react'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { IBottomSheetSuccessProps } from '../model/bottomSheetSuccess.type'
import { hapticFeedback, requestContact } from '@telegram-apps/sdk-react'
import clsx from 'clsx'
import { Loader2, OctagonAlert } from 'lucide-react'

const BottomSheetSuccess = ({
  isOpen,
  onClose,
  description,
  title = 'Успех!',
  variant = 'success',
  buttonText = 'Назад',
  isLoading,
  onClick
}: IBottomSheetSuccessProps) => {
  useEffect(() => {
    if (isOpen) {
      if (variant === 'success') {
        hapticFeedback.notificationOccurred('success')
      }
      if (variant === 'error') {
        hapticFeedback.notificationOccurred('error')
      }
      if (variant === 'warning') {
        hapticFeedback.notificationOccurred('warning')
      }
      if (variant === 'auth') {
        hapticFeedback.notificationOccurred('warning')
      }
    }
  }, [isOpen])
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      activeSnapPoint={1}
    >
      <DrawerContent className='bg-white dark:bg-neutral-900'>
        <div className='flex flex-col px-4 pt-5 pb-8'>
          {/* Icon */}
          <div className='mb-5 text-center sm:mb-7'>
            <span
              className={clsx(
                'mx-auto flex size-14 shrink-0 items-center justify-center rounded-full border-2 md:size-16',
                variant === 'success' && 'border-green-500 text-green-500',
                variant === 'error' && 'border-red-500 text-red-500',
                variant === 'warning' || (variant === 'auth' && 'border-yellow-500 text-yellow-500')
              )}
            >
              {variant === 'success' && (
                <svg
                  className='size-8 shrink-0'
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
              )}
              {variant === 'error' && <OctagonAlert className='size-8 shrink-0' />}

              {variant === 'warning' ||
                (variant === 'auth' && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    className='lucide lucide-triangle-alert-icon lucide-triangle-alert'
                  >
                    <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' />
                    <path d='M12 9v4' />
                    <path d='M12 17h.01' />
                  </svg>
                ))}
            </span>
          </div>
          {/* End Icon */}
          {/* Heading */}
          <div className='mb-5 text-center sm:mb-8'>
            <h1 className='mb-1 text-xl font-semibold text-gray-800 md:mb-3 md:text-2xl dark:text-neutral-200'>
              {title}
            </h1>
            {description && (
              <p className='text-sm text-gray-500 dark:text-neutral-500'>{description}</p>
            )}
          </div>
          {/* End Heading */}
          {variant !== 'auth' && (
            <DrawerClose>
              <button
                onClick={() => {
                  hapticFeedback.impactOccurred('rigid')
                  onClick?.()
                }}
                className={clsx(
                  'inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-transparent px-4 py-2.5 font-medium text-white hover:bg-green-600 focus:bg-green-600 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:py-3 sm:text-sm',
                  variant === 'success' && 'bg-green-600 hover:bg-green-600',
                  variant === 'error' && 'bg-red-600 hover:bg-red-600',
                  variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-600'
                )}
              >
                {isLoading ? <Loader2 className='size-4 animate-spin' /> : buttonText}
              </button>
            </DrawerClose>
          )}
          {variant === 'auth' && (
            <button
              onClick={() => {
                hapticFeedback.impactOccurred('rigid')
                requestContact().then(contact => {
                  onClose?.()
                  console.log(contact)
                })
              }}
              className={clsx(
                'inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-transparent px-4 py-2.5 font-medium text-white hover:bg-green-600 focus:bg-green-600 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:py-3 sm:text-sm',
                'bg-yellow-600 hover:bg-yellow-600'
              )}
            >
              Авторизоваться
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BottomSheetSuccess
