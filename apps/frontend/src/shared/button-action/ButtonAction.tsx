import { hapticFeedback } from '@telegram-apps/sdk-react'
import React, { FC } from 'react'
import { Bounce, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Spinner from '../spinner/Spinner'
import clsx from 'clsx'

interface IProps {
  onSuccessClick?: () => void
  onCancelClick?: () => void
  disabledSuccess?: boolean
  disabledCancel?: boolean
  isLoading?: boolean
}
const ButtonAction: FC<IProps> = ({ onSuccessClick, onCancelClick, disabledSuccess, disabledCancel, isLoading }) => {
  const navigate = useNavigate()

  const handleSuccessClick = () => {
    onSuccessClick?.()
    hapticFeedback.impactOccurred('light')
  }

  const handleCancelClick = () => {
    onCancelClick?.()
    hapticFeedback.impactOccurred('light')
  }

  const handleCloseClick = () => {
    navigate(-1)
    hapticFeedback.impactOccurred('light')
  }

  return (
    <>
      <div className='sticky left-0 right-0 bottom-0 w-max  p-6 z-50  max-w-md mx-auto hs-removing:translate-y-5 hs-removing:opacity-0 transition duration-300'>
        <div
          className={clsx(
            'py-2 ps-5 pe-2 bg-stone-800 rounded-full shadow-md dark:bg-neutral-950',
            isLoading && '!ps-4 !pe-4'
          )}
        >
          {!isLoading && (
            <div className='flex justify-between items-center gap-x-3'>
              {/* <a
              className='text-red-400 decoration-2 font-medium text-sm hover:underline focus:outline-hidden focus:underline dark:text-red-500'
              href='#'
            >
              Delete
            </a> */}

              <div className='inline-flex items-center gap-x-2'>
                {onCancelClick && (
                  <button
                    disabled={disabledCancel}
                    className='text-stone-300 disabled:opacity-50 disabled:pointer-events-none decoration-2 font-medium text-sm hover:underline focus:outline-hidden focus:underline dark:text-neutral-400'
                    onClick={handleCancelClick}
                  >
                    Очистить
                  </button>
                )}
                <div className='w-px h-4 bg-stone-700 dark:bg-neutral-700'></div>
                <button
                  disabled={disabledSuccess}
                  onClick={handleSuccessClick}
                  className='text-green-400 disabled:opacity-50 disabled:pointer-events-none decoration-2 font-medium text-sm hover:underline focus:outline-hidden focus:underline dark:text-green-500'
                >
                  Сохранить
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseClick}
                  type='button'
                  className='size-8 inline-flex justify-center items-center gap-x-2 rounded-full text-stone-400 hover:bg-stone-700 focus:outline-hidden focus:bg-stone-700 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
                  aria-label='Close'
                >
                  <span className='sr-only'>Close</span>
                  <svg
                    className='shrink-0 size-4'
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
                {/* End Close Button */}
              </div>
            </div>
          )}
          {isLoading && (
            <div className='flex justify-center items-center'>
              <Spinner size={9} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ButtonAction
