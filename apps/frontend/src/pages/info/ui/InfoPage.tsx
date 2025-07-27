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
            Accordion #1
          </button>
          <div
            id='hs-basic-bordered-collapse-one'
            className='hs-accordion-content w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-one'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                <em>This is the first item's accordion body.</em> It is hidden by default, until the
                collapse plugin adds the appropriate classes that we use to style each element.
                These classes control the overall appearance, as well as the showing and hiding via
                CSS transitions.
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
            Accordion #2
          </button>
          <div
            id='hs-basic-bordered-collapse-two'
            className='hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-two'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                <em>This is the second item's accordion body.</em> It is hidden by default, until
                the collapse plugin adds the appropriate classes that we use to style each element.
                These classes control the overall appearance, as well as the showing and hiding via
                CSS transitions.
              </p>
            </div>
          </div>
        </div>
        <div
          className='hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700'
          id='hs-bordered-heading-three'
        >
          <button
            className='hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-hidden dark:focus:text-neutral-400'
            aria-expanded='false'
            aria-controls='hs-basic-bordered-collapse-three'
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
            Accordion #3
          </button>
          <div
            id='hs-basic-bordered-collapse-three'
            className='hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300'
            role='region'
            aria-labelledby='hs-bordered-heading-three'
          >
            <div className='pb-4 px-5'>
              <p className='text-gray-800 dark:text-neutral-200'>
                <em>This is the third item's accordion body.</em> It is hidden by default, until the
                collapse plugin adds the appropriate classes that we use to style each element.
                These classes control the overall appearance, as well as the showing and hiding via
                CSS transitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default InfoPage
