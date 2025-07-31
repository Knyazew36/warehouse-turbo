import React, { useEffect } from 'react'
import { IUser, Role } from '../../model/user.type'
import { getFullName } from '@/shared/utils/getFullName'
import Select from '@/shared/ui/select/ui/Select'
import { Controller, useForm } from 'react-hook-form'
import { useUserDelete, useUpdateUserRole } from '../../api/user.api'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import UserDelete from '../delete/UserDelete'
import { getRole } from '@/shared/utils/getRole'

interface IProps {
  data: IUser
  organizationId: number
  currentUserId: number
}

const UserCard = ({ data, organizationId, currentUserId }: IProps) => {
  const { control, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: data.role || Role.OPERATOR
    }
  })

  const { mutate: updateUserRole, isPending: isUpdateRolePending } = useUpdateUserRole()
  const { isPending: isDeletePending } = useUserDelete()

  // Обновляем значение формы при изменении данных пользователя
  useEffect(() => {
    setValue('role', data.role || Role.OPERATOR)
  }, [data.role, setValue])

  const handleChangeRole = (role: Role) => {
    updateUserRole({
      organizationId,
      userId: data.id,
      role
    })
  }

  return (
    <div className='relative mb-4 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'>
      {data?.role !== Role.OWNER && data.id !== currentUserId && (
        <div className='absolute top-2 left-2'>
          <UserDelete
            userId={data.id}
            organizationId={organizationId}
          />
        </div>
      )}
      {/* Header */}
      <div className='grid grid-cols-3 gap-x-2 p-3 md:px-5 md:pt-5'>
        <div>
          <span className='hidden items-center gap-x-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 md:inline-flex dark:bg-neutral-700 dark:text-neutral-200'>
            <span className='inline-block size-1.5 shrink-0 rounded-full bg-gray-800 dark:bg-neutral-200' />
            Online
          </span>
        </div>
        <div className='relative mx-auto size-11 shrink-0 md:h-15.5 md:w-15.5'>
          {data.data.photo_url ? (
            <img
              className='size-11 shrink-0 rounded-full md:h-15.5 md:w-15.5'
              src={data.data.photo_url}
              alt='Avatar'
            />
          ) : (
            <span className='flex size-9.5 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
              {
                getFullName({
                  firstName: data.data.first_name,
                  lastName: data.data.last_name
                }).initials
              }
            </span>
          )}
        </div>
      </div>
      {/* End Header */}
      {/* Body */}
      <div className='p-3 pt-0 text-center md:px-5 md:pb-5'>
        <h3 className='font-medium text-gray-800 md:text-lg dark:text-neutral-200'>
          {
            getFullName({
              firstName: data.data.first_name,
              lastName: data.data.last_name
            }).shortName
          }
        </h3>
        <div className='inline-flex items-center justify-center gap-x-2'>
          <p className='text-sm text-gray-500 dark:text-neutral-500'>{getRole(data.role!)}</p>
        </div>
      </div>
      {/* End Body */}

      <div className='border-t border-gray-200 px-2 dark:border-neutral-700'>
        {/* List */}
        <div className='grid grid-cols-2 gap-x-3'>
          <div className='relative truncate overflow-hidden py-1 text-end text-sm text-gray-500 after:absolute after:top-1/2 after:mx-3 after:hidden after:w-full after:border-t after:border-dashed after:border-gray-200 sm:text-start sm:after:block dark:border-neutral-700 dark:text-neutral-500 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2'>Логин</span>
          </div>
          <div className='truncate py-1 text-sm text-gray-800 dark:text-neutral-200'>
            <span id='hs-pro-shmaccl'>{data.data.username}</span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-x-3 border-gray-200 dark:border-neutral-700'>
          <div className='relative truncate overflow-hidden py-1 text-end text-sm text-gray-500 after:absolute after:top-1/2 after:mx-3 after:hidden after:w-full after:border-t after:border-dashed after:border-gray-200 sm:text-start sm:after:block dark:border-neutral-700 dark:text-neutral-500 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2'>Последняя активность</span>
          </div>
          <div className='truncate py-1 text-sm text-gray-800 dark:text-neutral-200'>
            <span id='hs-pro-shmaccl'>
              {new Date(data.updatedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        {/* End List */}
      </div>

      {data?.role !== Role.OWNER && (
        <div className='relative flex flex-col gap-x-2 gap-y-1 overflow-hidden border-t border-gray-200 px-5 py-3 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-y-0 sm:text-start dark:border-neutral-700'>
          {(isUpdateRolePending || isDeletePending) && <LoaderSection />}
          <div>
            <p className='text-sm text-gray-500 dark:text-neutral-500'>Сменить роль</p>
          </div>
          <div>
            <Controller
              control={control}
              disabled={currentUserId === data.id}
              name='role'
              render={({ field }) => (
                <Select
                  disabled={currentUserId === data.id}
                  options={[
                    { value: Role.ADMIN, label: 'Админ' },
                    { value: Role.OPERATOR, label: 'Оператор' }
                  ]}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value)
                    handleChangeRole(value as Role)
                  }}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCard
