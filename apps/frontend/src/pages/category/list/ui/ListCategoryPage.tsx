import React, { useState } from 'react'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import { Page } from '@/components/Page'
import { Pencil, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCategoryList, useDeleteCategory } from '@/entitites/category/api/category.api'

const ListCategoryPage = () => {
  const { data: categories } = useCategoryList(false)
  const { mutateAsync: deleteCategory, isPending } = useDeleteCategory()
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    navigate(`/category/change/${id}`)
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteCategory(id)
    } catch (error) {
      console.error('Ошибка при удалении категории:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Page>
      <PageHeader title='Мои категории' />

      <div className='flex flex-col gap-2'>
        {categories?.map(category => (
          <div
            onClick={() => handleEdit(category.id)}
            key={category.id}
            className='group relative flex items-center gap-x-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'
          >
            <span className='flex size-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 sm:h-9.5 sm:w-9.5 sm:rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'>
              <svg
                className='size-3.5 shrink-0 sm:size-5'
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
                <path d='M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4' />
                <path d='M14 2v4a2 2 0 0 0 2 2h4' />
                <path d='m5 12-3 3 3 3' />
                <path d='m9 18 3-3-3-3' />
              </svg>
            </span>
            <div className='grow truncate'>
              <p className='block truncate text-sm font-semibold text-gray-800 dark:text-neutral-200'>
                {category.name}
              </p>
              {category.description && (
                <p className='block truncate text-xs text-gray-500 dark:text-neutral-500'>
                  {category.description}
                </p>
              )}
            </div>
            {/* More Dropdown */}
            <div className='group-hover:opacity-100 lg:absolute lg:end-3 lg:top-3 lg:opacity-0'>
              <div className='inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 sm:p-1 lg:shadow-xs dark:border-neutral-700 dark:bg-neutral-800'>
                {/* Button Icon */}
                <div className='hs-tooltip inline-block'>
                  <button
                    type='button'
                    className='hs-tooltip-toggle inline-flex size-7.5 items-center justify-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  >
                    <Pencil className='size-4 shrink-0' />
                  </button>
                  <span
                    className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible invisible absolute z-20 inline-block rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 dark:bg-neutral-700'
                    role='tooltip'
                  >
                    Редактировать
                  </span>
                </div>
                {/* End Button Icon */}
                <div className='mx-1 h-5 w-px bg-gray-200 dark:bg-neutral-700' />
                {/* Button Icon */}
                <div className='hs-tooltip inline-block'>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(category.id)
                    }}
                    type='button'
                    disabled={isPending && deletingId === category.id}
                    className='hs-tooltip-toggle inline-flex size-7.5 items-center justify-center gap-x-2 rounded-lg border border-transparent text-red-600 hover:bg-red-100 focus:bg-red-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:bg-red-500/20 dark:focus:bg-red-500/20'
                    data-hs-overlay='#hs-pro-chhdl'
                  >
                    {isPending && deletingId === category.id ? (
                      <Loader2 className='size-4 shrink-0 animate-spin' />
                    ) : (
                      <svg
                        className='size-4 shrink-0'
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
                    )}
                  </button>
                  <span
                    className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible invisible absolute z-20 inline-block rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 dark:bg-neutral-700'
                    role='tooltip'
                  >
                    Удалить
                  </span>
                </div>
                {/* End Button Icon */}
              </div>
            </div>
            {/* End More Dropdown */}
          </div>
        ))}
      </div>
    </Page>
  )
}

export default ListCategoryPage
