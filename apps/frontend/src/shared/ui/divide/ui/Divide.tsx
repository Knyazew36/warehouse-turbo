import clsx from 'clsx'
import React from 'react'

interface IProps {
  className?: string
}
const Divide = ({ className }: IProps) => {
  return (
    <div className={clsx('mx-auto my-8 h-px w-28 bg-gray-300 dark:bg-neutral-700', className)} />
  )
}

export default Divide
