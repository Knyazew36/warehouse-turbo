import React, { useEffect, useState } from 'react'
import { AllowedPhone } from '@/entitites/allowed-phone/model/allowed-phone.type'
import { allowedGetAllPhones } from '@/entitites/auth/auth.api'
import Empty from '@/shared/empty/ui/Empty'
import LoaderSection from '@/shared/loader/ui/LoaderSection'

const AddPhoneTable = () => {
  const [data, setData] = useState<AllowedPhone[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getData = async () => {
    setIsLoading(true)
    const data = await allowedGetAllPhones()
    setData(data)
    setIsLoading(false)
  }
  useEffect(() => {
    getData()
  }, [])

  if (isLoading) return <LoaderSection className='min-h-30' />

  return (
    data &&
    (data.length > 0 ? (
      <div className='divide-y divide-dashed divide-gray-200 dark:divide-neutral-700 '>
        {data.map(item => (
          <div
            className='py-3 grid grid-cols-2 gap-x-3'
            key={item.id}
          >
            <span className='block text-sm text-gray-500 dark:text-neutral-500'>{item.phone}</span>
          </div>
        ))}
      </div>
    ) : (
      <Empty title='Нет добавленных телефонов' />
    ))
  )
}

export default AddPhoneTable
