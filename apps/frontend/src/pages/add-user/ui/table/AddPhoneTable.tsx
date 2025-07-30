import React, { useEffect, useState } from 'react'
import { AllowedPhone } from '@/entitites/allowed-phone/model/allowed-phone.type'
import Empty from '@/shared/empty/ui/Empty'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import {
  useAllowedPhonesForOrganization,
  useDeleteAllowedPhone
} from '@/entitites/allowed-phone/model/allowed-phone.api'
import InfoMessage from '@/shared/ui/info/ui/Info'

const AddPhoneTable = () => {
  const { data, isLoading, isFetching } = useAllowedPhonesForOrganization()
  const { mutate: deleteAllowedPhone } = useDeleteAllowedPhone()

  const handleDelete = (id: number) => {
    deleteAllowedPhone(id)
  }

  if (isLoading) return <LoaderSection className='min-h-30' />

  return (
    data &&
    (data.length > 0 ? (
      <>
        <InfoMessage text=' Если пользователь принял приглашение в склад и вы удаляете его телефон, то вам необходимо также удалить его из пользователей в основном меню.' />
        <div className='divide-y divide-dashed divide-gray-200 dark:divide-neutral-700 '>
          {data.map(item => (
            <div
              className='py-3 grid grid-cols-2 gap-x-3 '
              key={item.id}
            >
              <span className='block text-sm text-gray-500 dark:text-neutral-500'>
                {item.phone}
              </span>
              <button
                type='button'
                className='size-7.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-red-600 hover:bg-red-100  disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-red-100 dark:text-red-500 dark:hover:bg-red-500/20 dark:focus:bg-red-500/20'
                onClick={() => handleDelete(item.id)}
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
                  <path d='M3 6h18' />
                  <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                  <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                  <line
                    x1={10}
                    x2={10}
                    y1={11}
                    y2={17}
                  />
                  <line
                    x1={14}
                    x2={14}
                    y1={11}
                    y2={17}
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </>
    ) : (
      <Empty title='Нет добавленных телефонов' />
    ))
  )
}

export default AddPhoneTable
