export interface ErrorEventEmitter {
  message?: string
  action: 'modal' | 'logout' | 'navigation' | 'console' | 'pay-modal' | 'bottom-sheet'
  href?: string
  isNavigateBackOnClick?: boolean
}
