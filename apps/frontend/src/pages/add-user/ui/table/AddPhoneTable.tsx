import React, { useEffect, useState } from 'react'
import { AllowedPhone } from '@/entitites/allowed-phone/model/allowed-phone.type'
import { allowedGetAllPhones } from '@/entitites/auth/auth.api'
import Loader from '@/shared/loader/ui/Loader'
import Empty from '@/shared/empty/ui/Empty'
import LoaderSection from '@/shared/loader/ui/LoaderSection'

const AddPhoneTable = () => {
  const [data, setData] = useState<AllowedPhone[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getData = async () => {
    setIsLoading(true)
    const data = await allowedGetAllPhones()
    setData(data)
    setIsLoading(false)
  }
  useEffect(() => {
    getData()
  }, [])

  if (isLoading) return <LoaderSection className='min-h-30' />

  return (
    data &&
    (data.length > 0 ? (
      <>
        {/* List */}
        <div className='divide-y divide-dashed divide-gray-200 dark:divide-neutral-700 '>
          {data.map(item => (
            <div
              className='py-3 grid grid-cols-2 gap-x-3'
              key={item.id}
            >
              <span className='block text-sm text-gray-500 dark:text-neutral-500'>{item.phone}</span>
              {/* <div className='flex justify-end gap-2'>
                <span
                  id='hs-pro-ccdcfn'
                  className='text-sm text-gray-800 dark:text-neutral-200'
                >
                  Amanda Harvey
                </span>
                <button
                  type='button'
                  className='js-clipboard [--is-toggle-tooltip:false] hs-tooltip size-5 shrink-0 inline-flex justify-center items-center gap-x-2 rounded-md text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden sm:focus:bg-gray-100 dark:text-neutral-200 sm:dark:hover:bg-neutral-700'
                  data-clipboard-target='#hs-pro-ccdcfn'
                  data-clipboard-action='copy'
                  data-clipboard-success-text='Code copied'
                >
                  <svg
                    className='js-clipboard-default shrink-0 size-3.5'
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
                      height={14}
                      x={8}
                      y={8}
                      rx={2}
                      ry={2}
                    />
                    <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                  </svg>
                  <svg
                    className='js-clipboard-success hidden size-3.5'
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
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span
                    className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity hidden invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700'
                    role='tooltip'
                  >
                    <span className='js-clipboard-success-text'>Copy Full name</span>
                  </span>
                </button>
              </div> */}
            </div>
          ))}
        </div>
        {/* End List */}
      </>
    ) : (
      <Empty title='Нет добавленных телефонов' />
    ))
  )
}

export default AddPhoneTable
