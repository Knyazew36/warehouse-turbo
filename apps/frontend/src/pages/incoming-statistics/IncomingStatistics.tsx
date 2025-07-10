import { Page } from '@/components/Page'
import React, { Fragment } from 'react'
import { useStatistics } from '@/entitites/receipt/api/receipt.api'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import { getFullName } from '@/shared/utils/getFullName'

const IncomingStatistics = () => {
  const { data, isLoading } = useStatistics()

  if (isLoading) return <Loader />
  return (
    <Page back>
      <PageHeader title='Расход и поступление' />
      <div className='flex flex-col gap-2'>
        {data?.data.map(item => (
          <div
            key={item.date}
            className='bg-white border border-gray-200 rounded-2xl dark:bg-neutral-900 dark:border-neutral-700'
          >
            {/* Heading */}
            <div className='py-3 px-4 border-b border-gray-200 dark:border-neutral-700'>
              <h2 className='font-medium text-gray-800 dark:text-neutral-200'>
                {new Date(item.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </h2>
            </div>
            {/* End Heading */}
            {/* Body */}
            <div className='p-4'>
              {/* List */}
              <dl className='grid grid-cols-1 sm:grid-cols-2 sm:gap-y-2 gap-x-4'>
                <div className='flex justify-between'>
                  <div>
                    <dt className='sm:py-1 text-sm text-gray-500 dark:text-neutral-500'>Тип:</dt>
                    <dd className='pb-3 sm:py-1 min-h-8 text-sm text-gray-800 dark:text-neutral-200 mt-1'>
                      {item.type === 'income' ? (
                        <div className='hs-tooltip inline-block'>
                          <span className='hs-tooltip-toggle py-1 px-2.5 inline-flex items-center gap-x-2.5 bg-green-100 text-green-700 text-start text-nowrap font-medium text-[13px] rounded-full dark:bg-green-500/10 dark:text-green-400'>
                            <span className='relative w-2.5 h-px bg-green-700 after:absolute after:top-1/2 after:-end-1 after:size-1.5 after:bg-green-700 after:rounded-full after:-translate-y-1/2 dark:bg-green-400 dark:after:bg-green-400' />
                            Поступление
                          </span>
                        </div>
                      ) : (
                        <div className='hs-tooltip inline-block'>
                          <span className='hs-tooltip-toggle py-1 px-2.5 inline-flex items-center gap-x-2.5 bg-red-100 text-red-700 text-start text-nowrap font-medium text-[13px] rounded-full dark:bg-red-500/10 dark:text-red-400'>
                            <span className='relative w-2.5 h-px bg-red-700 after:absolute after:top-1/2 after:-start-1 after:size-1.5 after:bg-red-700 after:rounded-full after:-translate-y-1/2 dark:bg-red-400 dark:after:bg-red-400' />
                            Расход
                          </span>
                        </div>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className='sm:py-1 text-sm text-gray-500 dark:text-neutral-500'>Выполнил:</dt>

                    <div className='flex gap-2 mt-1'>
                      <div className='shrink-0 relative  md:w-15.5 md:h-15.5 '>
                        {item.user?.data?.photo_url ? (
                          <img
                            className='shrink-0 size-8 md:w-15.5 md:h-15.5 rounded-full'
                            src={item.user?.data?.photo_url}
                            alt='Avatar'
                          />
                        ) : (
                          <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
                            {
                              getFullName({
                                firstName: item.user?.data?.first_name,
                                lastName: item.user?.data?.last_name
                              }).initials
                            }
                          </span>
                        )}
                      </div>

                      <div className='grow flex flex-col'>
                        <div className='inline-flex items-center gap-x-2'>
                          <h3 className='font-medium text-gray-800 dark:text-neutral-200 truncate max-w-40'>
                            {
                              getFullName({
                                firstName: item.user?.data?.first_name,
                                lastName: item.user?.data?.last_name
                              }).fullName
                            }
                          </h3>
                          {/* <span className='hidden md:inline-flex items-center gap-x-1.5 py-1 px-2.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200'>
                            <span className='size-1.5 inline-block bg-gray-800 rounded-full dark:bg-neutral-200' />
                            {item.user?.data?.is_online ? 'Online' : 'Offline'}
                          </span> */}
                        </div>
                        <div className='inline-flex items-center gap-x-2'>
                          <p className='text-xs sm:text-sm text-gray-500 dark:text-neutral-500'>
                            {' '}
                            {item.user?.data?.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='border-t border-gray-200 dark:border-neutral-700 my-2'></div>
                {item.products.map(product => (
                  <Fragment key={product.product?.id}>
                    <dt className='sm:py-1 text-sm text-gray-500 dark:text-neutral-500'>{product.product?.name}</dt>
                    <dd className='pb-3 sm:py-1 min-h-8 text-sm text-gray-800 dark:text-neutral-200'>
                      {product.quantity} {product.product?.unit}
                    </dd>
                  </Fragment>
                ))}
              </dl>
              {/* End List */}
            </div>
            {/* End Body */}
          </div>
        ))}

        <>
          {/* Card */}

          {/* End Card */}
        </>
      </div>
    </Page>
  )
}

export default IncomingStatistics
