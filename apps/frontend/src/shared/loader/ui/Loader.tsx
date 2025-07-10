import Spinner from '@/shared/spinner/Spinner'
import React from 'react'

const Loader = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black'>
      <Spinner />
    </div>
  )
}

export default Loader
