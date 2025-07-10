import React from 'react'
import { IUser } from '../../model/user.type'
import { getFullName } from '@/shared/utils/getFullName'

const UserTable = ({ data }: { data: IUser[] }) => {
  return (
    data && (
      <div>
        {/* Table Section */}
        <div className='overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
          <div className='min-w-full inline-block align-middle'>
            {/* Table */}
            <table className='min-w-full divide-y divide-gray-200 dark:divide-neutral-700'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='min-w-40'
                  >
                    <div className='pe-4 py-3 text-start flex items-center gap-x-1 text-sm font-medium truncate text-gray-800 dark:text-neutral-200'>
                      Сотрудник
                    </div>
                  </th>
                  <th
                    scope='col'
                    className='min-w-48'
                  >
                    <div className='px-4 py-3 text-start flex items-center gap-x-1 text-sm font-medium text-gray-800 dark:text-neutral-200'>
                      ФИО
                    </div>
                  </th>
                  <th scope='col'>
                    <div className='px-4 py-3 text-start flex items-center gap-x-1 text-sm font-medium text-gray-800 dark:text-neutral-200'>
                      Роль
                    </div>
                  </th>
                  <th
                    scope='col'
                    className='min-w-46'
                  >
                    <div className='px-4 py-3 text-start flex items-center gap-x-1 text-sm font-medium text-gray-800 dark:text-neutral-200'>
                      Последняя активность
                    </div>
                  </th>
                  {/* <th scope='col'>
                    <div className='px-4 py-3 text-start flex items-center gap-x-1 text-sm font-medium text-gray-800 dark:text-neutral-200'>
                      Статус
                    </div>
                  </th> */}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-neutral-700'>
                {data.map(user => (
                  <tr key={user.id}>
                    <td className='size-px whitespace-nowrap pe-4 py-3'>
                      <div className='w-full flex items-center gap-x-3'>
                        {user.data.photo_url ? (
                          <img
                            className='shrink-0 size-9.5 rounded-full'
                            src={user.data.photo_url}
                            alt='Avatar'
                          />
                        ) : (
                          <span className='flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'>
                            {
                              getFullName({
                                firstName: user.data.first_name,
                                lastName: user.data.last_name
                              }).initials
                            }
                          </span>
                        )}
                        <div className='grow'>
                          <span className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
                            {user.data.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='size-px whitespace-nowrap px-4 py-3'>
                      <span className='text-sm text-gray-600 dark:text-neutral-400'>
                        {
                          getFullName({
                            firstName: user.data.first_name,
                            lastName: user.data.last_name
                          }).shortName
                        }
                      </span>
                    </td>
                    <td className='size-px whitespace-nowrap px-4 py-3'>
                      <span className='text-sm text-gray-600 dark:text-neutral-400'>{user.role}</span>
                    </td>

                    <td className='size-px whitespace-nowrap px-4 py-3'>
                      <span className='text-sm text-gray-600 dark:text-neutral-400'>
                        {new Date(user.updatedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    {/* <td className='size-px whitespace-nowrap px-4 py-3'>
                      {user.active ? (
                        <span className='inline-flex items-center gap-x-1.5 py-1.5 px-2.5 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500'>
                          <span className='size-1.5 inline-block bg-gray-800 rounded-full dark:bg-neutral-200' />
                          Активен
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 py-1.5 px-2 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-500/20 dark:text-neutral-400'>
                          <span className='size-1.5 inline-block bg-gray-800 rounded-full dark:bg-neutral-400' />
                          Неактивен
                        </span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* End Table */}
          </div>
        </div>
        {/* End Table Section */}
      </div>
    )
  )
}

export default UserTable
