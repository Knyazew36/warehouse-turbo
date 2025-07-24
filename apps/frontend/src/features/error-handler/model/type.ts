export interface ErrorEventEmitter {
  message?: string
  description?: string
  action: 'modal' | 'logout' | 'navigation' | 'console' | 'pay-modal' | 'bottom-sheet'
  href?: string
  isNavigateBackOnClick?: boolean
  variant?: 'success' | 'error' | 'warning'
}
