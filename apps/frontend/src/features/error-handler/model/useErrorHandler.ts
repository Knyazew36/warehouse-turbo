'use client'

import { useEffect } from 'react'

// import { useAppStore } from '@/app/zustand/useAppStore'

// import { useLogout } from '@/features/logout'

import { eventEmitter } from './eventEmitter'
import { ErrorEventEmitter } from './type'
import { logout } from '@/features/logout/model/logout'
import { useNavigate } from 'react-router-dom'

export const useErrorHandler = () => {
  const navigate = useNavigate()
  // const logout = useLogout()
  // const { setModal, setModalPayment } = useAppStore()

  // const router = useRouter()

  useEffect(() => {
    eventEmitter.on('request-error', handleRequestError)
    return () => {
      eventEmitter.off('request-error', handleRequestError)
    }
  }, [])

  const handleRequestError = (error: ErrorEventEmitter) => {
    if (error.action === 'modal') {
      // setModal({
      // 	isActive: true,
      // 	title: error.message,
      // 	isNavigateBackOnClick: error.isNavigateBackOnClick
      // })
    }
    if (error.action === 'logout') {
      logout()
      // router.push('/auth/login')
    }
    if (error.action === 'navigation' && error.href) {
      // router.push(error.href)
      navigate(error.href)
    }
    if (error.action === 'pay-modal') {
      // setModalPayment(true)
    }
  }
}
