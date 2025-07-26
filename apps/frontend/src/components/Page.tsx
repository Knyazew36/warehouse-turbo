import { useNavigate } from 'react-router-dom'
import { hapticFeedback, hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react'
import { type PropsWithChildren, useEffect } from 'react'
import clsx from 'clsx'

export function Page({
  children,
  back = true,
  className
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
  className?: string
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

  return <div className={clsx(' h-full p-2 pb-8 ', className)}>{children}</div>
}
