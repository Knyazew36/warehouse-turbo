import { create } from 'zustand'
import { IBottomSheetSuccessProps } from '../bottom-sheet-success/model/bottomSheetSuccess.type'

type Store = {
  isOpen: boolean
  open: (props: IBottomSheetSuccessProps) => void
  title?: string
  description?: string
  close: () => void
  onClose?: () => void
  variant?: IBottomSheetSuccessProps['variant']
}

const useBottomSheetStore = create<Store>()(set => ({
  isOpen: false,
  open: props =>
    set({
      isOpen: props.isOpen,
      title: props.title,
      description: props.description,
      onClose: props.onClose,
      variant: props.variant || 'success'
    }),
  title: undefined,
  description: undefined,
  variant: undefined,
  close: () =>
    set({
      isOpen: false,
      title: undefined,
      description: undefined,
      onClose: () => {},
      variant: undefined
    }),
  onClose: () => {}
}))

export { useBottomSheetStore }
