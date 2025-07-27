import { Page } from '@/components/Page'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const InfoPage = () => {
  return (
    <Page>
      <PageHeader title='Информация' />
      <div className='hs-accordion-group'>
        <div
          className='hs-accordion active bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700'
          id='hs-bordered-heading-one'
        >
          <button
            className='hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-hidden dark:focus:text-neutral-400'
            aria-expanded='true'
            aria-controls='hs-basic-bordered-collapse-one'
          >
            <svg
              className='hs-accordion-active:hidden block size-3.5'
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
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>
            <svg
              className='hs-accordion-active:block hidden size-3.5'
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
              <path d='M5 12h14' />
            </svg>
            Чем отличаются роли пользователей?
          </button>
          <div
            id='hs-basic-bordered-collapse-one'
            className='hs-accordion-content w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-one'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                <em>Владелец</em> - может управлять всеми складами и пользователями. Может удалить
                или изменить склад.
              </p>
              <p className='text-gray-800 dark:text-neutral-200'>
                <em>Администратор</em> - может управлять всеми складами и пользователями. Но не
                может удалить или изменить склад. Может создавать и редактировать товары
              </p>

              <p className='text-gray-800 dark:text-neutral-200'>
                <em>Пользователь</em> - может просматривать склад, создавать расходы, принимать
                товары.
              </p>
            </div>
          </div>
        </div>
        <div
          className='hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700'
          id='hs-bordered-heading-two'
        >
          <button
            className='hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-hidden dark:focus:text-neutral-400'
            aria-expanded='false'
            aria-controls='hs-basic-bordered-collapse-two'
          >
            <svg
              className='hs-accordion-active:hidden block size-3.5'
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
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>
            <svg
              className='hs-accordion-active:block hidden size-3.5'
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
              <path d='M5 12h14' />
            </svg>
            Для чего нужна авторизация по номеру телефона?
          </button>
          <div
            id='hs-basic-bordered-collapse-two'
            className='hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-two'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                Для того, чтобы пользователя могли приглашать в другие склады
              </p>
            </div>
          </div>
        </div>
        <div
          className='hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700'
          id='hs-bordered-heading-two'
        >
          <button
            className='hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-hidden dark:focus:text-neutral-400'
            aria-expanded='false'
            aria-controls='hs-basic-bordered-collapse-two'
          >
            <svg
              className='hs-accordion-active:hidden block size-3.5'
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
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>
            <svg
              className='hs-accordion-active:block hidden size-3.5'
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
              <path d='M5 12h14' />
            </svg>
            Какие уведомления приходят в бот?
          </button>
          <div
            id='hs-basic-bordered-collapse-two'
            className='hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-two'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                Уведомления приходят в бот, когда на складе товар пересек порог минимального
                значения. Уведомление по умолчанию будет приходить в 9:00.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default InfoPage
