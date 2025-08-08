import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { DialogClose } from '@/components/ui/dialog'
import { useDeleteProduct } from '@/entitites/product/api/product.api'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useDeleteCategory } from '@/entitites/category/api/category.api'

interface ProductDeleteProps {
  categoryId: number
}

const CategoryDeleteModal: React.FC<ProductDeleteProps> = ({ categoryId }) => {
  const [open, setOpen] = useState(false)
  const { mutate: deleteCategory, isPending } = useDeleteCategory()

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type='button'
          disabled={isPending}
          className='hs-tooltip-toggle inline-flex size-7.5 items-center justify-center gap-x-2 rounded-lg border border-transparent text-red-600 hover:bg-red-100 focus:bg-red-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:bg-red-500/20 dark:focus:bg-red-500/20'
          data-hs-overlay='#hs-pro-chhdl'
          onClick={e => {
            e.stopPropagation()
            hapticFeedback.impactOccurred('light')
          }}
        >
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
        </button>
      </DialogTrigger>

      <DialogContent
        onClick={e => e.stopPropagation()}
        className='overflow-hidden rounded-2xl p-0'
      >
        <div className='relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900'>
          <div className='overflow-y-auto p-4 sm:p-10'>
            <div className='flex gap-x-4 md:gap-x-7'>
              {/* Icon */}
              <span className='inline-flex size-11 shrink-0 items-center justify-center rounded-full border-4 border-red-50 bg-red-100 text-red-500 sm:h-15.5 sm:w-15.5 dark:border-red-600 dark:bg-red-700 dark:text-red-100'>
                <svg
                  className='size-5 shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' />
                </svg>
              </span>
              {/* End Icon */}

              <div className='grow'>
                <DialogHeader>
                  <DialogTitle>Удалить категорию?</DialogTitle>
                  <DialogDescription>
                    Вы действительно хотите удалить эту категорию? Действие нельзя будет отменить.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <DialogFooter className='flex flex-row items-center justify-end gap-x-2 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950'>
            <DialogClose asChild>
              <button
                type='button'
                disabled={isPending}
                onClick={() => {
                  hapticFeedback.impactOccurred('light')
                }}
                className='inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              >
                Отмена
              </button>
            </DialogClose>

            <button
              type='button'
              onClick={() => {
                deleteCategory(categoryId, {
                  onSuccess: () => {
                    hapticFeedback.notificationOccurred('success')
                  }
                })
              }}
              disabled={isPending}
              className={`inline-flex items-center gap-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-white shadow-2xs ${
                isPending ? 'cursor-not-allowed bg-red-400' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Удалить
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDeleteModal
