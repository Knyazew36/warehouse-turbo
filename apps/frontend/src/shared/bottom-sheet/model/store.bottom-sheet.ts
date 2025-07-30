import { create } from 'zustand'
import { IBottomSheetSuccessProps } from '../bottom-sheet-success/model/bottomSheetSuccess.type'

type Store = {
  isOpen: boolean
  open: (props: IBottomSheetSuccessProps) => void
  title?: string
  description?: string
  isLoading?: boolean
  close: () => void
  onClose?: () => void
  onClick?: () => void
  variant?: IBottomSheetSuccessProps['variant']
  buttonText?: string
  setIsLoading: (isLoading: boolean) => void
}

const useBottomSheetStore = create<Store>()((set, get) => ({
  isOpen: false,
  open: props =>
    set({
      isOpen: props.isOpen,
      title: props.title,
      description: props.description,
      onClose: props.onClose,
      variant: props.variant || 'success',
      buttonText: props.buttonText,
      isLoading: props.isLoading,
      onClick: props.onClick
    }),
  title: undefined,
  description: undefined,
  variant: undefined,
  onClick: undefined,
  close: () =>
    set({
      isOpen: false,
      title: undefined,
      description: undefined,
      onClose: () => {},
      variant: undefined,
      buttonText: undefined,
      isLoading: false,
      onClick: undefined
    }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  onClose: () => {}
}))

export { useBottomSheetStore }
