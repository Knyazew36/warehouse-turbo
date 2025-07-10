import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LucideMailWarning } from 'lucide-react'

const Confirmation = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Alert
          variant='default'
          className='mt-4 border-green-400'
        >
          <LucideMailWarning />
          <AlertTitle>Поступление на склад</AlertTitle>
          <AlertDescription>Поступление на склад 80 поддонов</AlertDescription>
        </Alert>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение поступления на склад</DialogTitle>
          {/* <DialogDescription>Товар добавится в список, при этом наличие товара или его появление делается через поступление товара</DialogDescription> */}
        </DialogHeader>

        {/* <div className='flex flex-col gap-2'>
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-800 dark:text-white'>Название</label>
            <input
              type='text'
              id='hs-pro-dalpn'
              className='py-2 sm:py-2.5 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600'
              placeholder='Товар'
            />
          </div>
        </div> */}
        <DialogFooter>
          <div className='text-center'>
            <h3 className='text-gray-600 dark:text-neutral-400'>Подтверждаете ли поступление на склад?</h3>
          </div>

          {/* Button Group */}
          <div className='mt-5 flex flex-wrap justify-center items-center gap-3'>
            <button
              type='button'
              className='py-2.5 px-3.5 w-32 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
            >
              <svg
                className='shrink-0 size-4 text-teal-500'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 6 9 17l-5-5' />
              </svg>
              Да
            </button>
            <button
              type='button'
              className='py-2.5 px-3.5 w-32 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
            >
              <svg
                className='shrink-0 size-4 text-red-500'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
              Нет
            </button>
          </div>
          {/* End Button Group */}

          <div className='mt-5 text-center'>
            <p className='text-xs text-gray-500 dark:text-neutral-500'>39 out of 57 found this helpful</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Confirmation
