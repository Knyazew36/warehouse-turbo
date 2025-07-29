import React, { useEffect } from 'react'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { IBottomSheetSuccessProps } from '../model/bottomSheetSuccess.type'
import { hapticFeedback, requestContact } from '@telegram-apps/sdk-react'
import clsx from 'clsx'
import { useQueryClient } from '@tanstack/react-query'
import { useAvailableOrganizations } from '@/entitites/organization/api/organization.api'

const BottomSheetSuccess = ({
  isOpen,
  onClose,
  description,
  title = 'Успех!',
  variant = 'success',
  buttonText = 'Назад'
}: IBottomSheetSuccessProps) => {
  const queryClient = useQueryClient()
  const { refetch: refetchOrganizations } = useAvailableOrganizations()

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

  const handleAuthButtonClick = async () => {
    hapticFeedback.impactOccurred('rigid')
    try {
      const contact = await requestContact()
      console.log(contact)

      // Перезапрашиваем организации после успешной отправки контакта
      await refetchOrganizations()

      // Инвалидируем кэш для доступных организаций
      queryClient.invalidateQueries({
        queryKey: ['organizations', 'my', 'available']
      })

      onClose?.()
    } catch (error) {
      console.error('Error requesting contact:', error)
      hapticFeedback.notificationOccurred('error')
    }
  }
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
            <span
              className={clsx(
                'shrink-0 size-14 md:size-16 mx-auto flex justify-center items-center border-2 rounded-full',
                variant === 'success' && 'border-green-500 text-green-500',
                variant === 'error' && 'border-red-500 text-red-500',
                (variant === 'warning' || variant === 'auth') && 'border-yellow-500 text-yellow-500'
              )}
            >
              {variant === 'success' && (
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
              )}

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
          <div className='mb-5 sm:mb-8 text-center'>
            <h1 className='mb-1 md:mb-3 font-semibold text-xl md:text-2xl text-gray-800 dark:text-neutral-200'>
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
                }}
                className={clsx(
                  'py-2.5  w-full sm:py-3 px-4  inline-flex justify-center items-center gap-x-2 font-medium sm:text-sm rounded-xl border border-transparent text-white hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-green-600',
                  variant === 'success' && 'bg-green-600 hover:bg-green-600',
                  variant === 'error' && 'bg-red-600 hover:bg-red-600',
                  variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-600'
                )}
              >
                {buttonText}
              </button>
            </DrawerClose>
          )}
          {variant === 'auth' && (
            <button
              onClick={handleAuthButtonClick}
              className={clsx(
                'py-2.5  w-full sm:py-3 px-4  inline-flex justify-center items-center gap-x-2 font-medium sm:text-sm rounded-xl border border-transparent text-white hover:bg-green-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-green-600',
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
