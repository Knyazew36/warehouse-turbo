import React, { FC, ReactNode } from 'react'

interface OrganizationProviderProps {
  children: ReactNode
}

const OrganizationProvider: FC<OrganizationProviderProps> = ({ children }) => {
  return <>{children}</>
}

export default OrganizationProvider
