import { useEffect, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { routes } from '@/navigation/routes.tsx'
import AppProvider from '@/app/providers/AppProvider'

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), [])
  const isDark = useSignal(isMiniAppDark)

  return (
    <HelmetProvider>
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
      >
        <AppProvider>
          <Helmet>
            {/* {import.meta.env.DEV && (
              <> */}
            {/* <script src='https://cdn.jsdelivr.net/npm/eruda'></script>
            <script>eruda.init()</script> */}
            {/* </>
            )} */}
          </Helmet>
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                {...route}
              />
            ))}
            <Route
              path='*'
              element={<Navigate to='/' />}
            />
          </Routes>
        </AppProvider>
      </AppRoot>
    </HelmetProvider>
  )
}
