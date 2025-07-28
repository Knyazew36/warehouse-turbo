import React from 'react'
import { IUser, Role } from '../../model/user.type'
import { getFullName } from '@/shared/utils/getFullName'
import Select from '@/shared/ui/select/ui/Select'
import { Controller, useForm } from 'react-hook-form'
import { useUpdateUser, useUserDelete, useUserRole, useUpdateUserRole } from '../../api/user.api'
import LoaderSection from '@/shared/loader/ui/LoaderSection'
import UserDelete from '../delete/UserDelete'
import { useOrganizationStore } from '@/entitites/organization/model/organization.store'
import { getRole } from '@/shared/utils/getRole'

interface IProps {
  data: IUser
  organizationId: number
  currentUserId: number
}

const UserCard = ({ data, organizationId, currentUserId }: IProps) => {
  const { control, handleSubmit } = useForm({
    // defaultValues: {
    //   role: data.role || Role.GUEST
    // },
    mode: 'onChange'
  })

  const { mutate: updateUser, isPending } = useUpdateUser()
  const { mutate: updateUserRole, isPending: isUpdateRolePending } = useUpdateUserRole()
  const { isPending: isDeletePending } = useUserDelete()

  return (
    <div className='flex relative overflow-hidden  flex-col mb-4 bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-700 '>
      {data?.role !== Role.OWNER && (
        <div className='absolute top-2 left-2'>
          <UserDelete
            userId={data.id}
            organizationId={organizationId}
          />
        </div>
      )}
      {/* Header */}
      <div className='p-3 md:pt-5 md:px-5 grid grid-cols-3 gap-x-2'>
        <div>
          <span className='hidden md:inline-flex items-center gap-x-1.5 py-1 px-2.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200'>
            <span className='size-1.5 shrink-0 inline-block bg-gray-800 rounded-full dark:bg-neutral-200' />
            Online
          </span>
        </div>
        <div className='shrink-0 relative size-11 md:w-15.5 md:h-15.5 mx-auto'>
          {data.data.photo_url ? (
            <img
              className='shrink-0 size-11 md:w-15.5 md:h-15.5 rounded-full'
              src={data.data.photo_url}
              alt='Avatar'
            />
          ) : (
            <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
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
      <div className='p-3 pt-0 md:px-5 md:pb-5 text-center'>
        <h3 className='md:text-lg font-medium text-gray-800 dark:text-neutral-200'>
          {
            getFullName({
              firstName: data.data.first_name,
              lastName: data.data.last_name
            }).shortName
          }
        </h3>
        <div className='inline-flex justify-center items-center gap-x-2'>
          {/* <svg
            className='shrink-0 size-4 text-gray-500 dark:text-neutral-500'
            xmlns='http://www.w3.org/2000/svg'
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' />
            <path d='M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' />
            <path d='M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' />
            <path d='M10 6h4' />
            <path d='M10 10h4' />
            <path d='M10 14h4' />
            <path d='M10 18h4' />
          </svg> */}
          <p className='text-sm text-gray-500 dark:text-neutral-500'>{getRole(data.role!)}</p>
        </div>
      </div>
      {/* End Body */}

      <div className='border-t border-gray-200 dark:border-neutral-700 px-2'>
        {/* List */}
        <div className='grid grid-cols-2 gap-x-3 '>
          <div className='py-1 relative overflow-hidden truncate text-sm text-gray-500 text-end sm:text-start after:hidden sm:after:block after:absolute after:top-1/2 after:w-full after:mx-3 after:border-t after:border-dashed after:border-gray-200 dark:text-neutral-500 dark:border-neutral-700 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2 '>Логин</span>
          </div>
          <div className='py-1 text-sm text-gray-800 dark:text-neutral-200 truncate'>
            <span id='hs-pro-shmaccl'>{data.data.username}</span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-x-3  border-gray-200 dark:border-neutral-700'>
          <div className='py-1 relative overflow-hidden truncate text-sm text-gray-500 text-end sm:text-start after:hidden sm:after:block after:absolute after:top-1/2 after:w-full after:mx-3 after:border-t after:border-dashed after:border-gray-200 dark:text-neutral-500 dark:border-neutral-700 dark:after:border-neutral-700'>
            <span className='relative z-1 pe-2 '>Последняя активность</span>
          </div>
          <div className='py-1 text-sm text-gray-800 dark:text-neutral-200 truncate'>
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
        <div className='py-3 overflow-hidden relative px-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1 sm:gap-y-0 gap-x-2 text-center sm:text-start border-t border-gray-200 dark:border-neutral-700'>
          {isPending || isUpdateRolePending || (isDeletePending && <LoaderSection />)}
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
                    // { value: Role.OWNER, label: 'Владелец' }
                    // { value: Role.GUEST, label: 'Гость' }
                  ]}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value)
                    if (organizationId) {
                      updateUserRole({
                        organizationId,
                        userId: data.id,
                        role: value as Role
                      })
                    }
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
