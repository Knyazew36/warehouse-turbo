import clsx from 'clsx'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { Link } from 'react-router-dom'
import Blocked from '@/shared/blocked/ui/Blocked'
import { TailwindColor, getColorClasses } from '@/shared/utils/colors'
import LoaderSection from '@/shared/loader/ui/LoaderSection'

export type IMenuButton = {
  to: string
  title: string
  icon: React.ReactNode
  color?: TailwindColor

  isBlocked?: boolean
  isDevelop?: boolean
  withNotification?: boolean
  isLoading?: boolean

  iconClassName?: string
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
  iconClassName
}: IMenuButton) => {
  return (
    <Link
      to={to}
      className={clsx(
        'p-4 group relative overflow-hidden flex flex-col bg-white border border-gray-200 rounded-xl focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700',
        (isBlocked || isDevelop || isLoading) && 'opacity-70 !pointer-events-none cursor-not-allowed'
      )}
      onClick={() => hapticFeedback.impactOccurred('rigid')}
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
          'flex justify-center relative items-center size-12 xl:size-16 mx-auto text-white rounded-2xl',
          getColorClasses(color),
          iconClassName
        )}
      >
        {icon}

        {withNotification && (
          <span className='flex absolute top-0 end-0 size-3 -mt-1.5 -me-1.5'>
            <span className='animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600'></span>
            <span className='relative inline-flex rounded-full size-3 bg-red-500'></span>
          </span>
        )}
      </span>

      <div className='text-center  mt-2'>
        <p className='truncate text-xs xl:text-sm font-medium text-gray-800 group-hover:text-pink-600 group-focus:text-pink-600 dark:text-neutral-200 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400'>
          {title}
        </p>
      </div>
    </Link>
  )
}

export default MenuButton
