import { Toaster } from '@/components/ui/sonner'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BottomSheetSuccess from '@/shared/bottom-sheet/bottom-sheet-success/ui/BottomSheetSuccess'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import { setMiniAppBackgroundColor, setMiniAppHeaderColor } from '@telegram-apps/sdk-react'
import { useErrorHandler } from '@/features/error-handler'
import { expandViewport } from '@telegram-apps/sdk'

interface ServiceProviderProps {
  children: React.ReactNode
}
async function loadPreline() {
  return import('preline/dist/index.js')
}
const queryClient = new QueryClient()

const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const location = useLocation()
  const { isOpen, title, description, close } = useBottomSheetStore()

  if (expandViewport.isAvailable()) {
    expandViewport()
  }
  useEffect(() => {
    const initPreline = async () => {
      await loadPreline()

      if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
        window.HSStaticMethods.autoInit()
      }
    }

    initPreline()
  }, [location.pathname])

  const themeParams = {
    accent_text_color: '#6ab2f2',
    bg_color: '#010101',
    button_color: '#5288c1',
    button_text_color: '#ffffff',
    destructive_text_color: '#ec3942',
    header_bg_color: '#010101',
    hint_color: '#708499',
    link_color: '#6ab3f3',
    secondary_bg_color: '#010101',
    section_bg_color: '#010101',
    section_header_text_color: '#6ab3f3',
    subtitle_text_color: '#708499',
    text_color: '#f5f5f5'
  }

  setMiniAppHeaderColor(themeParams.header_bg_color)
  setMiniAppBackgroundColor(themeParams.bg_color)
  useErrorHandler()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <BottomSheetSuccess
          isOpen={isOpen}
          onClose={close}
          title={title}
          description={description}
        />
      </QueryClientProvider>
    </>
  )
}

export default ServiceProvider
