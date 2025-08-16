import { Page } from '@/components/Page'
import InputPhone from '@/shared/ui/input-phone/ui/InputPhone'
import PageHeader from '@/shared/ui/page-header/ui/PageHeader'
import ButtonAction from '@/shared/button-action/ButtonAction'
import { hapticFeedback } from '@telegram-apps/sdk-react'
import { useNavigate } from 'react-router-dom'
import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useBottomSheetStore } from '@/shared/bottom-sheet/model/store.bottom-sheet'
import Spinner from '@/shared/spinner/Spinner'
import InfoMessage from '@/shared/ui/info/ui/Info'
import { useAddUserToOrganization } from '@/entitites/organization/api/organization.api'

const AddUserPage = () => {
  const navigate = useNavigate()
  const [phones, setPhones] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)
  const { open } = useBottomSheetStore()
  const [view, setView] = useState<'add' | 'added'>('add')
  const { mutateAsync: addUserToOrganization } = useAddUserToOrganization()
  const isFetching = false

  // Валидация телефонов
  const phoneValidation = useMemo(() => {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
    return phones.map(phone => ({
      value: phone,
      isValid: phone.trim() === '' || phoneRegex.test(phone),
      isEmpty: phone.trim() === ''
    }))
  }, [phones])

  const hasValidPhones = phoneValidation.some(phone => !phone.isEmpty && phone.isValid)
  const hasInvalidPhones = phoneValidation.some(phone => !phone.isEmpty && !phone.isValid)

  const addPhoneField = () => {
    setPhones(prev => [...prev, ''])
    hapticFeedback.impactOccurred('light')
  }

  const removePhoneField = (index: number) => {
    if (phones.length > 1) {
      setPhones(prev => prev.filter((_, i) => i !== index))
      hapticFeedback.impactOccurred('light')
    }
  }

  const updatePhone = (index: number, value: string) => {
    setPhones(prev => prev.map((phone, i) => (i === index ? value : phone)))
  }

  const handleSubmit = async () => {
    const validPhones = phones.filter(phone => phone.trim() !== '')

    if (validPhones.length === 0) {
      toast.error('Добавьте хотя бы один телефон')
      hapticFeedback.notificationOccurred('error')
      return
    }

    if (hasInvalidPhones) {
      toast.error('Проверьте правильность ввода телефонов')
      hapticFeedback.notificationOccurred('error')
      return
    }

    try {
      setIsLoading(true)

      console.info('validPhones', validPhones)

      await Promise.all(
        validPhones.map(phone =>
          addUserToOrganization({
            phone: phone.replace(/\D/g, '').replace(/^7/, '+7')
          })
        )
      )

      open({
        isOpen: true,
        buttonText: 'Хорошо',
        description:
          'Сотрудникам необходимо будет пройти авторизацию в боте, после чего они будут доступны в списке сотрудников. Вы можете добавить сотрудников еще или продолжить работу.',
        title: 'Сотрудники успешно добавлены'
      })

      setPhones([''])
      // Ничего не рефетчим: список телефонов больше не ведём
      // navigate(-1)
    } catch (error) {
      toast.error('Ошибка при добавлении сотрудников')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setPhones([''])
    hapticFeedback.impactOccurred('light')
  }

  return (
    <Page
      back
      isLoading={isFetching}
    >
      <PageHeader title={view === 'add' ? 'Добавить сотрудников' : 'Добавленные телефоны'} />
      {/* <div className='mt-8 mb-4 ml-auto flex w-max rounded-lg bg-gray-100 p-0.5 dark:bg-neutral-800'>
        <div className='flex gap-x-0.5 md:gap-x-1'>
          <button
            type='button'
            className={clsx(
              'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent rounded-md border border-transparent px-1.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-400 focus:border-gray-400 focus:outline-hidden sm:px-2 md:text-[13px] dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white dark:focus:border-neutral-500 dark:focus:text-white',
              view === 'add' && 'active'
            )}
            aria-selected='true'
            data-hs-tab='#example-tab-preview'
            aria-controls='example-tab-preview'
            role='tab'
            onClick={() => {
              setView('add')
              hapticFeedback.selectionChanged()
            }}
          >
            Добавить
          </button>
          <button
            type='button'
            className={clsx(
              'hs-tab-active:shadow-sm hs-tab-active:hover:border-transparent hs-tab-active:focus:border-transparent dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:hover:border-transparent dark:hs-tab-active:focus:border-transparent rounded-md border border-transparent px-1.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-400 focus:border-gray-400 focus:outline-hidden sm:px-2 md:text-[13px] dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white dark:focus:border-neutral-500 dark:focus:text-white',
              view === 'added' && 'active'
            )}
            id='example-tab-html-item'
            aria-selected='true'
            data-hs-tab='#example-tab-html'
            aria-controls='example-tab-html'
            role='tab'
            onClick={() => {
              setView('added')
              hapticFeedback.selectionChanged()
            }}
          >
            Добавленные
          </button>
        </div>
      </div> */}
      <div className='relative'>
        {/* {view === 'add' && ( */}
        <div className='flex flex-col'>
          <div className='flex flex-col gap-4 pb-20'>
            {/* Телефоны */}
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <label className='inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500'>
                  Телефоны сотрудников
                </label>
                <span className='text-xs text-gray-400'>
                  {phones.filter(p => p.trim() !== '').length} из {phones.length}
                </span>
              </div>

              {phones.map((phone, index) => (
                <div
                  key={index}
                  className='flex items-start gap-2'
                >
                  <div className='flex-1'>
                    <InputPhone
                      placeholder='+7 (999) 999-99-99'
                      value={phone}
                      onChange={value => updatePhone(index, value)}
                      error={
                        phoneValidation[index]?.isEmpty
                          ? undefined
                          : phoneValidation[index]?.isValid
                            ? undefined
                            : 'Неверный формат телефона'
                      }
                    />
                  </div>
                  {phones.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removePhoneField(index)}
                      className='hs-tooltip-toggle inline-flex size-12 items-center justify-center gap-x-2 rounded-lg border border-transparent bg-red-500/20 text-red-600 hover:bg-red-100 focus:bg-red-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:bg-red-500/20 dark:focus:bg-red-500/20'
                    >
                      <svg
                        className='size-4 shrink-0'
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
                        <path d='M3 6h18' />
                        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                        <line
                          x1={10}
                          x2={10}
                          y1={11}
                          y2={17}
                        />
                        <line
                          x1={14}
                          x2={14}
                          y1={11}
                          y2={17}
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addPhoneField}
                type='button'
                className='inline-flex w-max items-center justify-center gap-x-2 self-end rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 sm:py-2 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
              >
                <svg
                  className='size-3 shrink-0'
                  xmlns='http://www.w3.org/2000/svg'
                  width={16}
                  height={16}
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z'
                  />
                </svg>
                Добавить поле
              </button>

              {/* <p className='mt-2 text-sm text-gray-500 dark:text-neutral-500 bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg'>
                  💡 Подсказка: Каждый телефон создаст отдельного сотрудника.
                </p> */}

              <InfoMessage
                items={[
                  'Каждый телефон создаст отдельного сотрудника.',
                  'Сотрудники при входе в приложение увидят приглашение в ваш склад.'
                ]}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!hasValidPhones || hasInvalidPhones}
              type='button'
              className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white transition-transform duration-150 ease-in-out select-none hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-sm'
            >
              {isLoading ? (
                <Spinner />
              ) : phoneValidation.length > 1 ? (
                'Добавить сотрудников'
              ) : (
                'Добавить сотрудника'
              )}
            </button>
          </div>

          <ButtonAction
            onSuccessClick={handleSubmit}
            onCancelClick={handleCancel}
            isLoading={isLoading}
            disabledSuccess={!hasValidPhones || hasInvalidPhones}
          />
        </div>
        {/* )} */}

        {/* {view === 'added' && <AddPhoneTable />} */}
      </div>
    </Page>
  )
}

export default AddUserPage
