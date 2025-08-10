import { Page } from '@/components/Page'
import { useOrganizationStats } from '@/entitites/organization/api/organization.api'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import React from 'react'
import StatsCard from './stats-card/StatsCard'

const AdminPage = () => {
  const { data } = useOrganizationStats()
  return (
    <Page>
      <PageHeader title='Admin' />

      <div className='flex flex-col gap-4'>
        {data?.map(item => (
          <StatsCard
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </Page>
  )
}

export default AdminPage
