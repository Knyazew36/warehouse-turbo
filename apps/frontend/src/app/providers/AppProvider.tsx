import React, { FC } from 'react'
import ServiceProvider from './service-provider/ServiceProvider'
import { HashRouter } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
}
const AppProvider: FC<IProps> = ({ children }) => {
  return (
    <HashRouter>
      <ServiceProvider>{children}</ServiceProvider>
    </HashRouter>
  )
}

export default AppProvider
