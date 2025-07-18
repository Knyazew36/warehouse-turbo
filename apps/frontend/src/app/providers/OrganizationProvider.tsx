import React, { FC, ReactNode } from 'react'
import { useOrganizationInit } from '@/entitites/organization/model/organization.store'
import Loader from '@/shared/loader/ui/Loader'

interface OrganizationProviderProps {
  children: ReactNode
}

const OrganizationProvider: FC<OrganizationProviderProps> = ({ children }) => {
  const { isLoading } = useOrganizationInit()

  // Показываем загрузку только если данные организаций загружаются
  if (isLoading) {
    return <Loader />
  }

  return <>{children}</>
}

export default OrganizationProvider
