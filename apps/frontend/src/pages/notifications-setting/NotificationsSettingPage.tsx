import { Page } from '@/components/Page'
import { Checkbox } from '@/components/ui/checkbox'
import { Role } from '@/entitites/user/model/user.type'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { getRole } from '@/shared/utils/getRole'
import React from 'react'

const NotificationsSettingPage = () => {
  return (
    <Page back>
      <PageHeader title='Настройки уведомлений' />
      <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-2xs md:p-8 dark:border-neutral-700 dark:bg-neutral-800'>
        {/* Title */}
        <div className='mb-4 xl:mb-8'>
          {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
      Notifications
    </h1> */}
          <p className='text-sm text-gray-500 dark:text-neutral-500'>
            Настройте уведомления для вашего склада.
          </p>
        </div>
        {/* End Title */}
        {/* Notifications */}
        <div className='space-y-8'>
          {/* Notifications */}
          <div className='space-y-5'>
            {/* Header */}

            {/* End Header */}
            {/* List */}
            <ul className='grid rounded-lg bg-gray-100 p-3 md:grid-cols-5 md:gap-x-6 md:p-5 dark:bg-neutral-700'>
              {/* Item */}
              <li className='md:col-span-2'>
                <h3 className='font-semibold text-gray-800 dark:text-neutral-200'>Общие</h3>
              </li>

              {/* Item */}
              <li className='hidden md:col-span-1 md:block md:text-center'>
                <button
                  type='button'
                  className='text-xs font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500 dark:hover:text-blue-400'
                >
                  Toggle all
                </button>
              </li>
              {/* End Item */}
              {/* Item */}
              <li className='hidden md:col-span-1 md:block md:text-center'>
                <button
                  type='button'
                  className='text-xs font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500 dark:hover:text-blue-400'
                >
                  Toggle all
                </button>
              </li>
              {/* End Item */}
            </ul>

            {/* List */}
            <ul className='grid gap-1.5 px-3 md:grid-cols-5 md:items-center md:gap-6 md:px-5'>
              {/* Item */}
              <li className='md:col-span-2'>
                <p className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
                  Уведомления о минимальном остатке товара:
                </p>
                <p className='text-sm text-gray-500 dark:text-neutral-500'>
                  Уведомление о минимальном остатке товара будет отправлено в Telegram бот.
                  Указанным ниже сотрудникам:
                </p>
              </li>

              {Object.values(Role).map(role => {
                if (role === Role.BLOCKED || role === Role.IT || role === Role.GUEST) return null

                return (
                  <li
                    key={role}
                    className='col-span-1'
                  >
                    <label className='flex items-center justify-between md:block'>
                      <span className='text-sm text-gray-500 md:hidden dark:text-neutral-200'>
                        {getRole(role)}
                      </span>
                      <Checkbox />
                    </label>
                  </li>
                )
              })}
            </ul>
            {/* End List */}
          </div>
          {/* End Notifications */}
          <div className='border-t border-gray-200 dark:border-neutral-700' />
          {/* Title */}
          <div>
            <h2 className='text-lg font-semibold text-gray-800 dark:text-neutral-200'>
              Preline emails
            </h2>
            <p className='text-sm text-gray-500 dark:text-neutral-500'>
              Stay in-the-know about all things.
            </p>
          </div>
          {/* End Title */}
          {/* Grid */}
          <div className='grid gap-y-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-0 md:gap-x-16'>
            <div className='space-y-6'>
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe1'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe1'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    Daily digest
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Personalized productivity stats plus your tasks due today. Sent every morning.
                  </p>
                </div>
              </div>
              {/* End Switch */}
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe2'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe2'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    What’s new
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Exciting features and updates from the Preline team. Sent no more than once a
                    month.
                  </p>
                </div>
              </div>
              {/* End Switch */}
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe3'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe3'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    Tips and tricks
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Powerful productivity advice in your inbox. Sent once a month.
                  </p>
                </div>
              </div>
              {/* End Switch */}
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe4'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe4'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    New login alert
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Get an email notification every time a new device is logged into your account.
                    Recommended.
                  </p>
                </div>
              </div>
              {/* End Switch */}
            </div>
            {/* End Col */}
            <div className='space-y-6'>
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe5'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe5'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    New device login
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Notify me when there is a new login.
                  </p>
                </div>
              </div>
              {/* End Switch */}
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe6'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe6'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    Perks
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Special discounts, partner offers, invitations to events, and more
                  </p>
                </div>
              </div>
              {/* End Switch */}
              {/* Switch */}
              <div className='flex gap-x-4'>
                <div className='mt-1'>
                  <label
                    htmlFor='hs-pro-danpe7'
                    className='relative inline-block h-6 w-11 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      id='hs-pro-danpe7'
                      className='peer sr-only'
                    />
                    <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
                    <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
                  </label>
                </div>
                <div className='flex flex-col'>
                  <span className='block text-sm font-medium text-gray-800 dark:text-neutral-300'>
                    Research &amp; Feedback
                  </span>
                  <p className='text-sm text-gray-500 dark:text-neutral-500'>
                    Invitiations to share feedback about the program and products.
                  </p>
                </div>
              </div>
              {/* End Switch */}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
          <div className='border-t border-gray-200 dark:border-neutral-700' />
          <div>
            <h4 className='font-medium text-gray-800 dark:text-neutral-200'>Do no disturb</h4>
            <div className='mt-3'>
              <button
                type='button'
                className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
              >
                <svg
                  className='size-3.5 shrink-0'
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
                  <path d='M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5' />
                  <path d='M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7' />
                  <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
                  <path d='m2 2 20 20' />
                </svg>
                Не отправлять уведомления
              </button>
            </div>
          </div>
          <div>
            <h4 className='font-medium text-gray-800 dark:text-neutral-200'>Расписание</h4>
            <div className='mt-3'>
              {/* Input Group */}
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <div className='flex'>
                  {/* <input
              type="checkbox"
              className="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-pro-danscch"
            /> */}
                  <label
                    htmlFor='hs-pro-danscch'
                    className='text-sm text-gray-500 dark:text-neutral-500'
                  >
                    Отправлять уведомление об остатке товара в:
                  </label>
                </div>
                <div className='flex items-center gap-x-2'>
                  <input
                    type='text'
                    className='max-w-24 rounded-lg border-gray-200 px-3 py-1.5 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600'
                    defaultValue='5:00pm'
                  />
                  {/* <span className="text-sm text-gray-500 dark:text-neutral-500">
              до:
            </span>
            <input
              type="text"
              className="py-1.5 sm:py-2 px-3 max-w-24 border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
              defaultValue="9:00am"
            /> */}
                </div>
              </div>
              {/* End Input Group */}
            </div>
          </div>
          <div>
            <h4 className='font-medium text-gray-800 dark:text-neutral-200'>
              Не отправлять уведомления по следующим дням:
            </h4>
            <div className='mt-3'>
              {/* Button Group */}
              <div className='grid rounded-lg shadow-2xs sm:inline-flex'>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Пон<span className='-ms-2 sm:hidden'>едельник</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Втор<span className='-ms-2 sm:hidden'>ник</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Сре<span className='-ms-2 sm:hidden'>да</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Чет<span className='-ms-2 sm:hidden'>верг</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Пят<span className='-ms-2 sm:hidden'>ниц</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Суб<span className='-ms-2 sm:hidden'>бота</span>
                </button>
                <button
                  type='button'
                  className='-mt-px inline-flex items-center justify-center gap-x-2 border border-gray-200 bg-white px-3 py-2 text-start text-sm font-medium text-gray-800 shadow-2xs first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 focus:bg-gray-800 focus:text-white focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:-ms-px sm:mt-0 sm:first:ms-0 sm:first:rounded-s-lg sm:first:rounded-se-none sm:last:rounded-e-lg sm:last:rounded-es-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-200 dark:focus:text-neutral-800'
                >
                  Вос<span className='-ms-2 sm:hidden'>кресенье</span>
                </button>
              </div>
              {/* End Button Group */}
            </div>
          </div>
          {/* Button Group */}
          <div className='flex gap-x-3'>
            <button
              type='button'
              className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50'
            >
              Сохранить изменения
            </button>
            <button
              type='button'
              className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
            >
              Отмена
            </button>
          </div>
          {/* End Button Group */}
        </div>
        {/* End Notifications */}
      </div>
    </Page>
  )
}

export default NotificationsSettingPage
