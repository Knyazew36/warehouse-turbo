import { useNavigate } from 'react-router-dom'
import {
  hapticFeedback,
  hideBackButton,
  onBackButtonClick,
  showBackButton
} from '@telegram-apps/sdk-react'
import { type PropsWithChildren, useEffect } from 'react'
import clsx from 'clsx'
import Spinner from '@/shared/spinner/Spinner'
import { motion } from 'framer-motion'

export function Page({
  children,
  back = true,
  className,
  isLoading,
  onBackClick
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
  className?: string
  isLoading?: boolean
  /**
   * Custom back navigation function. If not provided, uses navigate(-1)
   */
  onBackClick?: () => void
}>) {
  const navigate = useNavigate()
  useEffect(() => {
    if (back) {
      showBackButton()
      return onBackButtonClick(() => {
        hapticFeedback.impactOccurred('rigid')
        if (onBackClick) {
          onBackClick()
        } else {
          navigate(-1)
        }
      })
    }
    hideBackButton()
  }, [back, onBackClick])

  return (
    <div className={clsx('relative h-full p-2 pb-8', className)}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='items-cebg-black fixed top-4 right-4 flex justify-center'
        >
          <Spinner />
        </motion.div>
      )}

      {children}
    </div>
  )
}
