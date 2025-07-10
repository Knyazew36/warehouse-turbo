/**
 * Интерфейс для ФИО
 */
export interface IFullName {
  firstName?: string
  lastName?: string
  middleName?: string
}

/**
 * Интерфейс для результата функции
 */
export interface IFullNameResult {
  fullName: string
  shortName: string
  initials: string
  isValid: boolean
  errors: string[]
}

/**
 * Валидация имени
 * @param name - строка для валидации
 * @returns true если имя валидно
 */
function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') return false

  // Убираем лишние пробелы
  const trimmedName = name.trim()
  if (trimmedName.length === 0) return false

  // Проверяем минимальную и максимальную длину
  if (trimmedName.length < 2 || trimmedName.length > 50) return false

  // Проверяем на наличие только букв, пробелов, дефисов и апострофов
  const nameRegex = /^[а-яёa-z\s\-']+$/i
  if (!nameRegex.test(trimmedName)) return false

  // Проверяем на наличие хотя бы одной буквы
  const letterRegex = /[а-яёa-z]/i
  if (!letterRegex.test(trimmedName)) return false

  return true
}

/**
 * Нормализация имени (первая буква заглавная, остальные строчные)
 * @param name - строка для нормализации
 * @returns нормализованная строка
 */
function normalizeName(name: string): string {
  if (!name || typeof name !== 'string') return ''

  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
    .replace(/\b\w/g, char => char.toUpperCase()) // Первая буква каждого слова заглавная
}

/**
 * Получение инициалов
 * @param firstName - имя
 * @param lastName - фамилия
 * @param middleName - отчество
 * @returns строка с инициалами
 */
function getInitials(firstName?: string, lastName?: string, middleName?: string): string {
  const parts: string[] = []

  if (lastName) parts.push(lastName.charAt(0).toUpperCase())
  if (firstName) parts.push(firstName.charAt(0).toUpperCase())
  if (middleName) parts.push(middleName.charAt(0).toUpperCase())

  return parts.join('.') + (parts.length > 0 ? '.' : '')
}

/**
 * Универсальная функция для обработки ФИО
 * @param input - может быть объектом с ФИО, строкой или массивом строк
 * @returns объект с результатами обработки
 */
export function getFullName(input: IFullName | string | string[] | null | undefined): IFullNameResult {
  const errors: string[] = []
  let firstName = ''
  let lastName = ''
  let middleName = ''

  // Обработка входных данных
  if (!input) {
    errors.push('ФИО не предоставлено')
    return {
      fullName: '',
      shortName: '',
      initials: '',
      isValid: false,
      errors
    }
  }

  // Если передан объект
  if (typeof input === 'object' && !Array.isArray(input)) {
    const nameObj = input as IFullName
    firstName = nameObj.firstName || ''
    lastName = nameObj.lastName || ''
    middleName = nameObj.middleName || ''
  }
  // Если передан массив строк
  else if (Array.isArray(input)) {
    const [first, second, third] = input.map(item => String(item || '').trim()).filter(Boolean)

    if (first) {
      if (second) {
        // При двух элементах: Фамилия Имя
        lastName = first
        firstName = second
        if (third) middleName = third
      } else {
        // При одном элементе: только Имя
        firstName = first
      }
    }
  }
  // Если передана строка
  else if (typeof input === 'string') {
    const parts = input.trim().split(/\s+/).filter(Boolean)

    if (parts.length === 1) {
      firstName = parts[0]
    } else if (parts.length === 2) {
      // При двух словах: Фамилия Имя
      lastName = parts[0]
      firstName = parts[1]
    } else if (parts.length >= 3) {
      // При трех и более словах: Фамилия Имя Отчество
      lastName = parts[0]
      firstName = parts[1]
      middleName = parts[2]
    }
  }

  // Валидация
  if (firstName && !validateName(firstName)) {
    errors.push('Некорректное имя')
  }
  if (lastName && !validateName(lastName)) {
    errors.push('Некорректная фамилия')
  }
  if (middleName && !validateName(middleName)) {
    errors.push('Некорректное отчество')
  }

  // Проверяем, что есть хотя бы имя или фамилия
  if (!firstName && !lastName) {
    errors.push('Необходимо указать имя или фамилию')
  }

  // Нормализация
  firstName = normalizeName(firstName)
  lastName = normalizeName(lastName)
  middleName = normalizeName(middleName)

  // Формирование результатов
  const nameParts = [lastName, firstName, middleName].filter(Boolean)
  const fullName = nameParts.join(' ')
  const shortName = [firstName, lastName].filter(Boolean).join(' ')
  const initials = getInitials(firstName, lastName, middleName)

  return {
    fullName,
    shortName,
    initials,
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Проверка валидности ФИО
 * @param input - ФИО для проверки
 * @returns true если ФИО валидно
 */
export function isValidFullName(input: IFullName | string | string[] | null | undefined): boolean {
  return getFullName(input).isValid
}

/**
 * Получение только полного имени без проверок
 * @param input - ФИО
 * @returns строка с полным именем
 */
export function getFullNameString(input: IFullName | string | string[] | null | undefined): string {
  return getFullName(input).fullName
}

/**
 * Получение короткого имени (имя + фамилия)
 * @param input - ФИО
 * @returns строка с коротким именем
 */
export function getShortNameString(input: IFullName | string | string[] | null | undefined): string {
  return getFullName(input).shortName
}

/**
 * Получение инициалов
 * @param input - ФИО
 * @returns строка с инициалами
 */
export function getInitialsString(input: IFullName | string | string[] | null | undefined): string {
  return getFullName(input).initials
}
