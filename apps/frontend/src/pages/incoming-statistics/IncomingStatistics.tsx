import { Page } from '@/components/Page'
import React, { Fragment, useEffect } from 'react'
import { useStatistics } from '@/entitites/receipt/api/receipt.api'
import { formatNumber } from '@/shared/utils/formatNumber'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import Loader from '@/shared/loader/ui/Loader'
import { getFullName } from '@/shared/utils/getFullName'
import Empty from '@/shared/empty/ui/Empty'
import Pagination from '@/shared/ui/pagination/ui/Pagination'
import { useSearchParams } from 'react-router-dom'

const IncomingStatistics = () => {
  const [searchParams] = useSearchParams()

  const { data, isLoading, isFetching, refetch } = useStatistics({
    page: Number(searchParams.get('page')),
    limit: Number(searchParams.get('limit'))
  })

  useEffect(() => {
    refetch()
  }, [searchParams])

  if (isLoading) return <Loader />
  return (
    <Page
      back
      isLoading={isFetching}
    >
      <PageHeader title='Расход и поступление' />
      <div className='flex flex-col gap-2'>
        {data?.data &&
          data?.data.length > 0 &&
          data?.data?.map(item => (
            <div
              key={item.date}
              className='rounded-2xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
            >
              {/* Heading */}
              <div className='border-b border-gray-200 px-4 py-3 dark:border-neutral-700'>
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
                <dl className='grid grid-cols-1 gap-x-4 sm:grid-cols-2 sm:gap-y-2'>
                  <div className='flex justify-between gap-2'>
                    <div>
                      <dt className='text-sm text-gray-500 sm:py-1 dark:text-neutral-500'>Тип:</dt>
                      <dd className='mt-1 min-h-8 pb-3 text-sm text-gray-800 sm:py-1 dark:text-neutral-200'>
                        {item.type === 'income' ? (
                          <div className='hs-tooltip inline-block'>
                            <span className='hs-tooltip-toggle inline-flex items-center gap-x-2.5 rounded-full bg-green-100 px-2.5 py-1 text-start text-[13px] font-medium text-nowrap text-green-700 dark:bg-green-500/10 dark:text-green-400'>
                              <span className='relative h-px w-2.5 bg-green-700 after:absolute after:-end-1 after:top-1/2 after:size-1.5 after:-translate-y-1/2 after:rounded-full after:bg-green-700 dark:bg-green-400 dark:after:bg-green-400' />
                              Поступление
                            </span>
                          </div>
                        ) : (
                          <div className='hs-tooltip inline-block'>
                            <span className='hs-tooltip-toggle inline-flex items-center gap-x-2.5 rounded-full bg-red-100 px-2.5 py-1 text-start text-[13px] font-medium text-nowrap text-red-700 dark:bg-red-500/10 dark:text-red-400'>
                              <span className='relative h-px w-2.5 bg-red-700 after:absolute after:-start-1 after:top-1/2 after:size-1.5 after:-translate-y-1/2 after:rounded-full after:bg-red-700 dark:bg-red-400 dark:after:bg-red-400' />
                              Расход
                            </span>
                          </div>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm text-gray-500 sm:py-1 dark:text-neutral-500'>
                        Выполнил:
                      </dt>

                      <div className='mt-1 flex gap-2'>
                        <div className='relative shrink-0 md:h-15.5 md:w-15.5'>
                          {Boolean(item.user) && Boolean(item.user?.photo_url) ? (
                            <img
                              className='size-8 shrink-0 rounded-full md:h-15.5 md:w-15.5'
                              src={item.user?.photo_url}
                              alt='Avatar'
                            />
                          ) : (
                            <span className='flex size-9.5 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
                              {
                                getFullName({
                                  firstName: item.user?.first_name,
                                  lastName: item.user?.last_name
                                }).initials
                              }
                            </span>
                          )}
                        </div>

                        <div className='flex grow flex-col'>
                          <div className='inline-flex items-center gap-x-2'>
                            <h3 className='max-w-40 truncate font-medium text-gray-800 dark:text-neutral-200'>
                              {
                                getFullName({
                                  firstName: item.user?.first_name,
                                  lastName: item.user?.last_name
                                }).fullName
                              }
                            </h3>
                            {/* <span className='hidden md:inline-flex items-center gap-x-1.5 py-1 px-2.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200'>
                            <span className='size-1.5 inline-block bg-gray-800 rounded-full dark:bg-neutral-200' />
                            {item.user?.data?.is_online ? 'Online' : 'Offline'}
                          </span> */}
                          </div>
                          <div className='inline-flex items-center gap-x-2'>
                            <p className='text-xs wrap-anywhere text-gray-500 sm:text-sm dark:text-neutral-500'>
                              {' '}
                              {item.user?.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='my-2 border-t border-gray-200 dark:border-neutral-700'></div>
                  {item.products.map(product => (
                    <Fragment key={product.product?.id}>
                      <div className='flex flex-col rounded-md p-2 odd:bg-gray-50 dark:odd:bg-neutral-800'>
                        <dt className='text-sm text-gray-500 sm:py-1 dark:text-neutral-500'>
                          {product.product?.name}
                        </dt>
                        <dd className='text-sm text-gray-800 dark:text-neutral-200'>
                          {formatNumber(product.quantity)} {product.product?.unit}
                        </dd>
                        {product.comment && (
                          <Fragment>
                            <dt className='mt-2 text-sm text-gray-500 sm:py-1 dark:text-neutral-500'>
                              Комментарий:
                            </dt>
                            <dd className='text-sm break-words text-gray-800 dark:text-neutral-200'>
                              {product.comment}
                            </dd>
                          </Fragment>
                        )}
                      </div>
                    </Fragment>
                  ))}
                </dl>
                {/* End List */}
              </div>
              {/* End Body */}
            </div>
          ))}
        <Pagination data={data?.pagination} />
        {data?.data?.length === 0 && <Empty title='Нет данных' />}
      </div>
    </Page>
  )
}

export default IncomingStatistics
