import { Page } from '@/components/Page'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import React from 'react'

const NotificationsSettingPage = () => {
  return (
    <Page back>
      <PageHeader title='Настройки уведомлений' />
      {/* Notifications */}
      <div className='space-y-5'>
        {/* Header */}
        <div className='hidden sticky top-14 start-0 bg-white dark:bg-neutral-800 md:block'>
          {/* Grid */}
          <div className='grid md:grid-cols-5 lg:gap-x-3 md:gap-x-6 p-3 md:p-5'>
            <div className='col-span-2 self-center'>
              <h2 className='font-semibold text-gray-800 dark:text-neutral-200'>Notify me about</h2>
            </div>
            {/* End Col */}
            <div className='col-span-1 text-center'>
              <svg
                className='shrink-0 size-5 mx-auto text-gray-500 dark:text-neutral-500'
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
                <rect
                  width={20}
                  height={16}
                  x={2}
                  y={4}
                  rx={2}
                />
                <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-800 dark:text-neutral-200'>Email</h3>
            </div>
            {/* End Col */}
            <div className='col-span-1 text-center'>
              <svg
                className='shrink-0 size-5 mx-auto text-gray-500 dark:text-neutral-500'
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
                <rect
                  width={20}
                  height={14}
                  x={2}
                  y={3}
                  rx={2}
                />
                <line
                  x1={8}
                  x2={16}
                  y1={21}
                  y2={21}
                />
                <line
                  x1={12}
                  x2={12}
                  y1={17}
                  y2={21}
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-800 dark:text-neutral-200'>Desktop</h3>
              <p className='text-xs text-gray-500 dark:text-neutral-500'>Push notification</p>
            </div>
            {/* End Col */}
            <div className='col-span-1 text-center'>
              <svg
                className='shrink-0 size-5 mx-auto text-gray-500 dark:text-neutral-500'
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
                <rect
                  width={14}
                  height={20}
                  x={5}
                  y={2}
                  rx={2}
                  ry={2}
                />
                <path d='M12 18h.01' />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-800 dark:text-neutral-200'>Mobile</h3>
              <p className='text-xs text-gray-500 dark:text-neutral-500'>Push notification</p>
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
        {/* End Header */}
        {/* List */}
        <ul className='grid md:grid-cols-5 md:gap-x-6 bg-gray-100 rounded-lg p-3 md:p-5 dark:bg-neutral-700'>
          {/* Item */}
          <li className='md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>General</h3>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='hidden md:block md:col-span-1 md:text-center'>
            <button
              type='button'
              className='text-xs text-blue-600 decoration-2 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-500 dark:hover:text-blue-400'
            >
              Toggle all
            </button>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='hidden md:block md:col-span-1 md:text-center'>
            <button
              type='button'
              className='text-xs text-blue-600 decoration-2 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-500 dark:hover:text-blue-400'
            >
              Toggle all
            </button>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='hidden md:block md:col-span-1 md:text-center'>
            <button
              type='button'
              className='text-xs text-blue-600 decoration-2 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-500 dark:hover:text-blue-400'
            >
              Toggle all
            </button>
          </li>
          {/* End Item */}
        </ul>
        {/* End List */}
        {/* List */}
        <ul className='grid md:grid-cols-5 md:items-center gap-1.5 md:gap-6 px-3 md:px-5'>
          {/* Item */}
          <li className='md:col-span-2'>
            <p className='text-sm font-medium text-gray-800 dark:text-neutral-200'>Mentions</p>
            <p className='text-sm text-gray-500 dark:text-neutral-500'>
              Receive a notification if a teammate mentions you in a note.
            </p>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='col-span-1'>
            <div className='grid grid-cols-2 items-center md:block'>
              <span className='md:hidden text-sm text-gray-500 dark:text-neutral-200'>Email</span>
              <div className='text-end md:text-center'>
                <input
                  type='checkbox'
                  className='shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
                  defaultChecked={false}
                />
              </div>
            </div>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='col-span-1'>
            <div className='grid grid-cols-2 items-center md:block'>
              <span className='md:hidden text-sm text-gray-500 dark:text-neutral-200'>Desktop</span>
              <div className='text-end md:text-center'>
                <input
                  type='checkbox'
                  className='shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
                />
              </div>
            </div>
          </li>
          {/* End Item */}
          {/* Item */}
          <li className='col-span-1'>
            <div className='grid grid-cols-2 items-center md:block'>
              <span className='md:hidden text-sm text-gray-500 dark:text-neutral-200'>Mobile</span>
              <div className='text-end md:text-center'>
                <input
                  type='checkbox'
                  className='shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800'
                />
              </div>
            </div>
          </li>
          {/* End Item */}
        </ul>
        {/* End List */}
      </div>
      {/* End Notifications */}
    </Page>
  )
}

export default NotificationsSettingPage
