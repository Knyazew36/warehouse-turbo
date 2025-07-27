import React, { useEffect } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { hapticFeedback, openTelegramLink } from '@telegram-apps/sdk-react'
import clsx from 'clsx'
import MenuButton from '@/pages/menu-page/menu-button/MenuButton'
import { MessageCircle } from 'lucide-react'

const BottomSheetSupport = () => {
  return (
    <Drawer activeSnapPoint={1}>
      <DrawerTrigger asChild>
        <div className='p-4 group relative overflow-hidden flex flex-col bg-white border border-gray-200 rounded-xl focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700'>
          <span
            className={clsx(
              'flex justify-center relative items-center size-12 xl:size-16 mx-auto text-orange-600 dark:text-orange-500 rounded-2xl bg-orange-50 dark:bg-orange-900'
            )}
          >
            <MessageCircle className='shrink-0 size-5 xl:w-6 xl:h-6 text-orange-600 dark:text-orange-500' />
          </span>

          <div className='text-center  mt-2'>
            <p className='truncate text-xs xl:text-sm font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
              Поддержка
            </p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className='bg-white dark:bg-neutral-900'>
        <div className='flex flex-col px-4 pb-8 pt-5'>
          {/* Icon */}
          <div className='mb-5 sm:mb-7 text-center'>
            <span
              className={clsx(
                'shrink-0 size-14 md:size-16 mx-auto flex justify-center items-center border-2 rounded-full text-orange-600 dark:text-orange-500 border-orange-50 dark:border-orange-500'
              )}
            >
              <MessageCircle className='shrink-0 size-5 xl:w-6 xl:h-6 text-orange-600 dark:text-orange-500' />
            </span>
          </div>
          {/* End Icon */}
          {/* Heading */}
          <div className='mb-5 sm:mb-8 text-center'>
            <h1 className='mb-1 md:mb-3 font-semibold text-xl md:text-2xl text-gray-800 dark:text-neutral-200'>
              Поддержка
            </h1>
            <p className='text-sm text-gray-500 dark:text-neutral-500'>
              У вас возникли вопросы или предложения? Обнаружили ошибку? Хотите поддержать проект?
              Напишите нам в чат, мы ждем каждое ваше сообщение!
            </p>
          </div>
          {/* End Heading */}
          <button
            onClick={e => {
              e.stopPropagation()
              hapticFeedback.impactOccurred('rigid')
              openTelegramLink('https://t.me/Knyaz_sv')
            }}
            className={clsx(
              'py-2.5  w-full sm:py-3 px-4  inline-flex justify-center items-center gap-x-2 font-medium sm:text-sm rounded-xl border border-transparent text-white hover:bg-orange-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-orange-600',
              'bg-orange-600 hover:bg-orange-600'
            )}
          >
            Перейти в чат
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BottomSheetSupport
