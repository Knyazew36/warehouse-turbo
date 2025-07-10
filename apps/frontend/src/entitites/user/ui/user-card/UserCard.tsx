import React from 'react'
import { IUser, Role } from '../../model/user.type'
import { getFullName } from '@/shared/utils/getFullName'
import Select from '@/shared/ui/select/ui/Select'
import { Controller, useForm } from 'react-hook-form'
import { useUpdateUser, useUserDelete } from '../../api/user.api'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import UserDelete from '../delete/UserDelete'

const UserCard = ({ data, role }: { data: IUser; role: Role }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      role: data.role
    },
    mode: 'onChange'
  })
  const { mutate: updateUser, isPending } = useUpdateUser()
  const { isPending: isDeletePending } = useUserDelete()
  const onSubmit = (data: any) => {
    updateUser({ id: data.id, dto: { role: data.role } })
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex relative overflow-hidden  flex-col mb-4 bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-700 '
    >
      {data.role !== Role.OWNER && (
        <div className='absolute top-2 left-2'>
          <UserDelete userId={data.id} />
        </div>
      )}
      {/* Header */}
      <div className='p-3 md:pt-5 md:px-5 grid grid-cols-3 gap-x-2'>
        <div>
          <span className='hidden md:inline-flex items-center gap-x-1.5 py-1 px-2.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200'>
            <span className='size-1.5 shrink-0 inline-block bg-gray-800 rounded-full dark:bg-neutral-200' />
            Online
          </span>
        </div>
        <div className='shrink-0 relative size-11 md:w-15.5 md:h-15.5 mx-auto'>
          {data.data.photo_url ? (
            <img
              className='shrink-0 size-11 md:w-15.5 md:h-15.5 rounded-full'
              src={data.data.photo_url}
              alt='Avatar'
            />
          ) : (
            <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
              {
                getFullName({
                  firstName: data.data.first_name,
                  lastName: data.data.last_name
                }).initials
              }
            </span>
          )}
        </div>
        <div className='ms-auto'>
          {/* <div className='hs-dropdown [--placement:bottom-right] relative inline-flex'>
            <button
              id='hs-pro-dupc1'
              type='button'
              className='size-7 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
              aria-haspopup='menu'
              aria-expanded='false'
              aria-label='Dropdown'
            >
              <svg
                className='shrink-0 size-4'
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
                <circle
                  cx={12}
                  cy={12}
                  r={1}
                />
                <circle
                  cx={12}
                  cy={5}
                  r={1}
                />
                <circle
                  cx={12}
                  cy={19}
                  r={1}
                />
              </svg>
            </button>
            <div
              className='hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='hs-pro-dupc1'
            >
              <div className='p-1'>
                <button
                  type='button'
                  className='w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
                >
                  <svg
                    className='shrink-0 size-3.5 mt-0.5'
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
                    <circle
                      cx={18}
                      cy={5}
                      r={3}
                    />
                    <circle
                      cx={6}
                      cy={12}
                      r={3}
                    />
                    <circle
                      cx={18}
                      cy={19}
                      r={3}
                    />
                    <line
                      x1='8.59'
                      x2='15.42'
                      y1='13.51'
                      y2='17.49'
                    />
                    <line
                      x1='15.41'
                      x2='8.59'
                      y1='6.51'
                      y2='10.49'
                    />
                  </svg>
                  Share connection
                </button>
                <button
                  type='button'
                  className='w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
                >
                  <svg
                    className='shrink-0 size-3.5 mt-0.5'
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
                    <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
                    <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
                    <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
                    <line
                      x1={2}
                      x2={22}
                      y1={2}
                      y2={22}
                    />
                  </svg>
                  Hide connection
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* End Header */}
      {/* Body */}
      <div className='p-3 pt-0 md:px-5 md:pb-5 text-center'>
        <h3 className='md:text-lg font-medium text-gray-800 dark:text-neutral-200'>
          {
            getFullName({
              firstName: data.data.first_name,
              lastName: data.data.last_name
            }).shortName
          }
        </h3>
        <div className='inline-flex justify-center items-center gap-x-2'>
          {/* <svg
            className='shrink-0 size-4 text-gray-500 dark:text-neutral-500'
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
            <path d='M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' />
            <path d='M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' />
            <path d='M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' />
            <path d='M10 6h4' />
            <path d='M10 10h4' />
            <path d='M10 14h4' />
            <path d='M10 18h4' />
          </svg> */}
          <p className='text-sm text-gray-500 dark:text-neutral-500'>{data.role}</p>
        </div>
      </div>
      {/* End Body */}

      <div className='border-t border-gray-200 dark:border-neutral-700 px-2'>
        {/* List */}
        <div className='grid grid-cols-2 gap-x-3 '>
          <div className='py-1 relative overflow-hidden truncate text-sm text-gray-500 text-end sm:text-start after:hidden sm:after:block after:absolute after:top-1/2 after:w-full after:mx-3 after:border-t after:border-dashed after:border-gray-200 dark:text-neutral-500 dark:border-neutral-700 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2 '>Логин</span>
          </div>
          <div className='py-1 text-sm text-gray-800 dark:text-neutral-200 truncate'>
            <span id='hs-pro-shmaccl'>{data.data.username}</span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-x-3  border-gray-200 dark:border-neutral-700'>
          <div className='py-1 relative overflow-hidden truncate text-sm text-gray-500 text-end sm:text-start after:hidden sm:after:block after:absolute after:top-1/2 after:w-full after:mx-3 after:border-t after:border-dashed after:border-gray-200 dark:text-neutral-500 dark:border-neutral-700 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2 '>Последняя активность</span>
          </div>
          <div className='py-1 text-sm text-gray-800 dark:text-neutral-200 truncate'>
            <span id='hs-pro-shmaccl'>
              {new Date(data.updatedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        {/* End List */}
      </div>

      {data.role !== Role.OWNER && (
        <div className='py-3 overflow-hidden relative px-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1 sm:gap-y-0 gap-x-2 text-center sm:text-start border-t border-gray-200 dark:border-neutral-700'>
          {isPending || (isDeletePending && <LoaderSection />)}
          <div>
            <p className='text-sm text-gray-500 dark:text-neutral-500'>Сменить роль</p>
          </div>
          <div>
            <Controller
              control={control}
              name='role'
              render={({ field }) => (
                <Select
                  disabled={data.role === Role.OWNER}
                  options={[
                    { value: Role.ADMIN, label: 'Админ' },
                    { value: Role.OPERATOR, label: 'Оператор' }
                    // { value: Role.OWNER, label: 'Владелец' }
                    // { value: Role.GUEST, label: 'Гость' }
                  ]}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value)
                    updateUser({ id: data.id, dto: { role: value as Role } })
                  }}
                />
              )}
            />
          </div>
        </div>
      )}
    </form>
  )
}

export default UserCard
