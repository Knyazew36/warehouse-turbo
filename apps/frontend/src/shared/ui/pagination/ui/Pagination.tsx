import { PaginationResponse } from '@/shared/api'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

export interface Pagination {
  page: number
  limit: number
  total?: number
  totalPages?: number
  hasNext: boolean
  hasPrev: boolean
}

interface IProps {
  data?: Pagination
  onPageChange?: (page: number) => void
  pageParamName?: string
}

const Pagination = ({ data, onPageChange, pageParamName = 'page' }: IProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  if (!data || data.totalPages === 1) return null

  const handlePageChange = (page: number) => {
    // Update URL query parameters
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set(pageParamName, page.toString())
    setSearchParams(newSearchParams)

    // Call the callback if provided
    if (onPageChange) {
      onPageChange(page)
    }
  }

  const handlePrevPage = () => {
    if (data.hasPrev) {
      handlePageChange(data.page - 1)
    }
  }

  const handleNextPage = () => {
    if (data.hasNext) {
      handlePageChange(data.page + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const currentPage = data.page
    const totalPages = data.totalPages || 1
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (data.totalPages === 1) return null

  return (
    <nav
      className='mt-4 flex w-max items-center gap-x-1 self-end rounded-2xl border border-gray-200 bg-white px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900'
      aria-label='Pagination'
    >
      <button
        disabled={!data.hasPrev}
        type='button'
        onClick={handlePrevPage}
        className='inline-flex min-h-9.5 min-w-9.5 items-center justify-center gap-x-2 rounded-lg border border-transparent px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10'
        aria-label='Previous'
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
          <path d='m15 18-6-6 6-6' />
        </svg>
        <span className='sr-only'>Previous</span>
      </button>

      <div className='flex items-center gap-x-1'>
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                type='button'
                onClick={() => handlePageChange(page)}
                className={`flex min-h-9.5 min-w-9.5 items-center justify-center rounded-lg border px-3 py-2 text-sm focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 ${
                  page === data.page
                    ? 'border-gray-200 bg-gray-50 text-gray-800 dark:border-neutral-700 dark:bg-white/10 dark:text-white'
                    : 'border-transparent text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className='flex min-h-9.5 min-w-9.5 items-center justify-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
                {page}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        type='button'
        disabled={!data.hasNext}
        onClick={handleNextPage}
        className='inline-flex min-h-9.5 min-w-9.5 items-center justify-center gap-x-2 rounded-lg border border-transparent px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10'
        aria-label='Next'
      >
        <span className='sr-only'>Next</span>
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
          <path d='m9 18 6-6-6-6' />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination
