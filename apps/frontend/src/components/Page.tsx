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
  isLoading
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
  className?: string
  isLoading?: boolean
}>) {
  const navigate = useNavigate()
  useEffect(() => {
    if (back) {
      showBackButton()
      return onBackButtonClick(() => {
        hapticFeedback.impactOccurred('rigid')
        navigate(-1)
      })
    }
    hideBackButton()
  }, [back])

  return (
    <div className={clsx(' h-full p-2 pb-8 relative ', className)}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed top-4 right-4 flex justify-center items-cebg-black'
        >
          <Spinner />
        </motion.div>
      )}

      {children}
    </div>
  )
}
