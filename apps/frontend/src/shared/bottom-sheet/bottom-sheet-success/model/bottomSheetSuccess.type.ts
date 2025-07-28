export interface IBottomSheetSuccessProps {
  isOpen: boolean
  onClose?: () => void

  title?: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'auth'
  buttonText?: string
}
