import clsx from 'clsx'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { Link } from 'react-router-dom'
import Blocked from '@/shared/blocked/ui/Blocked'
import { TailwindColor, getColorClasses } from '@/shared/utils/colors'
import LoaderSection from '@/shared/loader/ui/LoaderSection'

export type IMenuButton = {
  to?: string
  title: string
  icon: React.ReactNode
  color?: TailwindColor

  isBlocked?: boolean
  isDevelop?: boolean
  withNotification?: boolean
  isLoading?: boolean

  iconClassName?: string

  onClick?: () => void
  className?: string
}

const MenuButton = ({
  to,
  title,
  icon,
  color = 'blue',
  isBlocked = false,
  isDevelop = false,
  withNotification = false,
  isLoading = false,
  iconClassName,
  onClick,
  className
}: IMenuButton) => {
  return (
    <Link
      to={to ?? ''}
      className={clsx(
        className,
        'group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-4 focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-900',
        'transition-transform duration-150 ease-in-out select-none active:scale-95',
        (isBlocked || isDevelop || isLoading) && '!pointer-events-none cursor-not-allowed opacity-70'
      )}
      onClick={() => {
        hapticFeedback.impactOccurred('rigid')
        onClick?.()
      }}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {isLoading && <LoaderSection />}
      {isBlocked && <Blocked />}
      {isDevelop && (
        <Blocked
          variant='process'
          title='В разработке'
        />
      )}

      <span
        className={clsx(
          'relative mx-auto flex size-12 items-center justify-center rounded-2xl text-white xl:size-16',
          getColorClasses(color),
          iconClassName
        )}
      >
        {icon}

        {withNotification && (
          <span className='absolute end-0 top-0 -me-1.5 -mt-1.5 flex size-3'>
            <span className='absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75 dark:bg-red-600'></span>
            <span className='relative inline-flex size-3 rounded-full bg-red-500'></span>
          </span>
        )}
      </span>

      <div className='mt-2 text-center select-none'>
        <p className='truncate text-xs font-medium text-gray-800 select-none group-hover:text-pink-600 group-focus:text-pink-600 xl:text-sm dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
          {title}
        </p>
      </div>
    </Link>
  )
}

export default MenuButton
