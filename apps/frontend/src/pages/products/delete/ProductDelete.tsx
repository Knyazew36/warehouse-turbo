import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { DialogClose } from '@/components/ui/dialog'
import { useDeleteProduct } from '@/entitites/product/api/product.api'

interface ProductDeleteProps {
  /** ID удаляемого товара */
  productId: number
  /** колбэк после успешного удаления */
  onSuccess?: () => void
}

const ProductDelete: React.FC<ProductDeleteProps> = ({ productId, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutate: deleteProduct } = useDeleteProduct()

  const handleDelete = async () => {
    deleteProduct(productId)
    onSuccess?.()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type='button'
          className='hs-tooltip-toggle size-7.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-red-600 hover:bg-red-100  disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-red-100 dark:text-red-500 dark:hover:bg-red-500/20 dark:focus:bg-red-500/20'
          data-hs-overlay='#hs-pro-chhdl'
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
      </DialogTrigger>

      <DialogContent className='p-0 overflow-hidden rounded-2xl'>
        <div className='relative flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800'>
          <div className='p-4 sm:p-10 overflow-y-auto'>
            <div className='flex gap-x-4 md:gap-x-7'>
              {/* Icon */}
              <span className='shrink-0 inline-flex justify-center items-center size-11 sm:w-15.5 sm:h-15.5 rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100'>
                <svg
                  className='shrink-0 size-5'
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
                  <DialogTitle>Удалить товар?</DialogTitle>
                  <DialogDescription>Вы действительно хотите удалить этот товар? Действие нельзя будет отменить.</DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <DialogFooter className='flex justify-end flex-row items-center gap-x-2 py-3 px-4 bg-gray-50 border-t border-gray-200 dark:bg-neutral-950 dark:border-neutral-800'>
            <DialogClose asChild>
              <button
                type='button'
                className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              >
                Отмена
              </button>
            </DialogClose>

            <button
              type='button'
              onClick={handleDelete}
              disabled={isDeleting}
              className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-white shadow-2xs ${
                isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isDeleting ? 'Удаление…' : 'Удалить товар'}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDelete
