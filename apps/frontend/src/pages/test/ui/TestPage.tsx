import { Page } from '@/components/Page'
import { Button } from '@/components/ui/button'
import { $api, apiDomain } from '@/shared/api'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import React from 'react'

const TestPage = () => {
  const cron = async () => {
    const res = await $api.get(`${apiDomain}/products/cron`)
    console.log(res)
  }

  return (
    <Page back>
      <PageHeader title='Тест' />

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Button onClick={cron}>CRON TEST</Button>
        </div>
      </div>
    </Page>
  )
}

export default TestPage
