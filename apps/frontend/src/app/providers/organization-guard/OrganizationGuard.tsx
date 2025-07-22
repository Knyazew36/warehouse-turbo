import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'

interface OrganizationGuardProps {
  children: React.ReactNode
}

const OrganizationGuard: React.FC<OrganizationGuardProps> = ({ children }) => {
  const { organizationId } = useOrganizationStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Список путей, которые не требуют organization ID
  const publicPaths = ['/', '/organization-management', '/organization-create', '/organization-selector']

  useEffect(() => {
    // Если нет organization ID и текущий путь не в списке публичных путей
    if (!organizationId && !publicPaths.includes(location.pathname)) {
      navigate('/')
    }
  }, [organizationId, location.pathname, navigate])

  return <>{children}</>
}

export default OrganizationGuard
