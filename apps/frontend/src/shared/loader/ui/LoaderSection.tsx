import Spinner from '@/shared/spinner/Spinner'
import React from 'react'
import clsx from 'clsx'

const LoaderSection = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('absolute inset-0 flex justify-center items-center bg-black/50 z-50', className)}>
      <Spinner />
    </div>
  )
}

export default LoaderSection
