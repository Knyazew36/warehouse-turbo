import React, { FC } from 'react'
import ServiceProvider from './service-provider/ServiceProvider'
import { HashRouter } from 'react-router-dom'
import OrganizationGuard from './organization-guard/OrganizationGuard'

interface IProps {
  children: React.ReactNode
}
const AppProvider: FC<IProps> = ({ children }) => {
  return (
    <HashRouter>
      <ServiceProvider>
        <OrganizationGuard>{children}</OrganizationGuard>
      </ServiceProvider>
    </HashRouter>
  )
}

export default AppProvider
