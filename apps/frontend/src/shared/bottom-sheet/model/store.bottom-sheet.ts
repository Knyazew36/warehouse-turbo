import { create } from 'zustand'
import { IBottomSheetSuccessProps } from '../bottom-sheet-success/model/bottomSheetSuccess.type'

type Store = {
  isOpen: boolean
  open: (props: IBottomSheetSuccessProps) => void
  title?: string
  description?: string
  close: () => void
  onClose?: () => void
}

const useBottomSheetStore = create<Store>()(set => ({
  isOpen: false,
  open: props => set({ isOpen: props.isOpen, title: props.title, description: props.description, onClose: props.onClose }),
  title: undefined,
  description: undefined,
  close: () => set({ isOpen: false, title: undefined, description: undefined, onClose: () => {} }),
  onClose: () => {}
}))

export { useBottomSheetStore }
