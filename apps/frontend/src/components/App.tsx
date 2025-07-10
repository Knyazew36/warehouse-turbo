import { useEffect, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react'
import { AppRoot } from '@telegram-apps/telegram-ui'

import { routes } from '@/navigation/routes.tsx'
import AppProvider from '@/app/providers/AppProvider'

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), [])
  const isDark = useSignal(isMiniAppDark)

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <AppProvider>
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
  )
}
