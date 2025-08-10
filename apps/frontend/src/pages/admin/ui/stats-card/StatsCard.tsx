import { OrganizationStats } from '@/entitites/organization/model/organization.type'
import { getFullName } from '@/shared/utils/getFullName'

const StatsCard = ({ data }: { data: OrganizationStats }) => {
  return (
    <div className='flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900'>
      {/* Header */}
      <div className='flex justify-between gap-x-3'>
        <div>
          <span className='block text-xl font-semibold text-gray-800 dark:text-neutral-200'>
            <span className='flex items-center gap-x-2'>{data.name}</span>
            <span className='text-[13px] text-gray-500 dark:text-neutral-500'>Создатель:</span>

            <div className='flex items-center gap-x-2'>
              <div className='relative shrink-0 md:h-15.5 md:w-15.5'>
                {Boolean(data.creator) && Boolean(data.creator?.data.photo_url) ? (
                  <img
                    className='size-8 shrink-0 rounded-full md:h-15.5 md:w-15.5'
                    src={data.creator?.data.photo_url}
                    alt='Avatar'
                  />
                ) : (
                  <span className='flex size-9.5 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
                    {
                      getFullName({
                        firstName: data.creator?.data.first_name,
                        lastName: data.creator?.data.last_name
                      }).initials
                    }
                  </span>
                )}
              </div>

              <h3 className='max-w-40 truncate font-medium text-gray-800 dark:text-neutral-200'>
                {
                  getFullName({
                    firstName: data.creator?.data.first_name,
                    lastName: data.creator?.data.last_name
                  }).fullName
                }
              </h3>
            </div>
          </span>
        </div>
      </div>
      {/* End Header */}
      <div className='mt-auto'>
        <div className='pt-5'>
          {/* List */}
          <div className='grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-2'>
            <div className='flex items-center gap-x-1.5'>
              <span className='text-[13px] text-gray-500 dark:text-neutral-500'>
                Последнее обновление:
              </span>
              <div className='flex items-center gap-x-1.5'>
                <span className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
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
            <div className='flex items-center gap-x-1.5'>
              <span className='text-[13px] text-gray-500 dark:text-neutral-500'>
                Количество сотрудников:
              </span>
              <div className='flex items-center gap-x-1.5'>
                <span className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
                  {data.employeesCount}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-x-1.5'>
              <span className='text-[13px] text-gray-500 dark:text-neutral-500'>
                Количество товаров:
              </span>
              <div className='flex items-center gap-x-1.5'>
                <span className='text-sm font-medium text-gray-800 dark:text-neutral-200'>
                  {data.productsCount}
                </span>
              </div>
            </div>

            {/* End Item */}
          </div>
          {/* End List */}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
