# Утилиты для работы с ФИО

## getFullName

Универсальная функция для обработки и валидации ФИО (Фамилия, Имя, Отчество).

### Возможности

- ✅ Поддержка различных форматов ввода (объект, строка, массив)
- ✅ Валидация данных с подробными сообщениями об ошибках
- ✅ Нормализация (приведение к правильному регистру)
- ✅ Автоматическое определение порядка ФИО
- ✅ Поддержка русских и английских букв
- ✅ Поддержка дефисов и апострофов в именах
- ✅ Генерация инициалов
- ✅ Полное и короткое представление имени

### Интерфейсы

```typescript
interface IFullName {
  firstName?: string
  lastName?: string
  middleName?: string
}

interface IFullNameResult {
  fullName: string      // Полное ФИО (Фамилия Имя Отчество)
  shortName: string     // Короткое имя (Имя Фамилия)
  initials: string      // Инициалы (П.И.С.)
  isValid: boolean      // Валидность данных
  errors: string[]      // Список ошибок
}
```

### Использование

#### Основная функция

```typescript
import { getFullName } from '@/shared/utils/getFullName'

// 1. Объект с ФИО
const result1 = getFullName({
  firstName: 'Иван',
  lastName: 'Петров',
  middleName: 'Сергеевич'
})

// 2. Строка
const result2 = getFullName('Петров Иван Сергеевич')

// 3. Массив строк
const result3 = getFullName(['Петров', 'Иван', 'Сергеевич'])

// 4. Только имя и фамилия
const result4 = getFullName('Иванов Иван')

// 5. Только имя
const result5 = getFullName('Мария')
```

#### Вспомогательные функции

```typescript
import { 
  isValidFullName,
  getFullNameString,
  getShortNameString,
  getInitialsString
} from '@/shared/utils/getFullName'

// Проверка валидности
const isValid = isValidFullName('Иванов Иван') // true/false

// Получение только строки
const fullName = getFullNameString('Петров Иван Сергеевич') // "Петров Иван Сергеевич"
const shortName = getShortNameString('Петров Иван Сергеевич') // "Иван Петров"
const initials = getInitialsString('Петров Иван Сергеевич') // "П.И.С."
```

### Примеры результатов

#### Успешная обработка

```typescript
const result = getFullName('Петров Иван Сергеевич')

console.log(result)
// {
//   fullName: "Петров Иван Сергеевич",
//   shortName: "Иван Петров", 
//   initials: "П.И.С.",
//   isValid: true,
//   errors: []
// }
```

#### Обработка с ошибками

```typescript
const result = getFullName('Иван123 Петров')

console.log(result)
// {
//   fullName: "Петров Иван",
//   shortName: "Иван Петров",
//   initials: "П.И.",
//   isValid: false,
//   errors: ["Некорректное имя"]
// }
```

### Правила валидации

1. **Минимальная длина**: 2 символа
2. **Максимальная длина**: 50 символов
3. **Разрешенные символы**: буквы (русские и английские), пробелы, дефисы, апострофы
4. **Обязательно**: хотя бы одно имя или фамилия
5. **Регистр**: автоматическая нормализация (первая буква заглавная)

### Поддерживаемые форматы

#### Строки
- `"Петров Иван Сергеевич"` → Фамилия Имя Отчество
- `"Иванов Иван"` → Фамилия Имя
- `"Мария"` → Имя
- `"  иванов  иван  "` → автоматическая очистка пробелов

#### Объекты
```typescript
{
  firstName: "Иван",
  lastName: "Петров", 
  middleName: "Сергеевич"
}
```

#### Массивы
```typescript
["Петров", "Иван", "Сергеевич"] // Фамилия, Имя, Отчество
["Иван", "Петров"] // Имя, Фамилия
["Мария"] // Только имя
```

### Особенности

1. **Автоматическое определение порядка**: при передаче строки или массива функция пытается определить правильный порядок ФИО
2. **Нормализация**: все имена приводятся к правильному регистру
3. **Обработка ошибок**: подробные сообщения об ошибках на русском языке
4. **Гибкость**: функция работает с частичными данными (только имя, только имя и фамилия)
5. **Безопасность**: корректная обработка null, undefined, пустых строк

### Ограничения

- Поддерживаются только русские и английские буквы
- Максимальная длина каждого компонента - 50 символов
- Минимальная длина каждого компонента - 2 символа
- Не поддерживаются цифры и специальные символы (кроме дефиса и апострофа)

# Shared Utils

## Colors

Файл `colors.ts` содержит утилиты для работы с цветами Tailwind CSS, которые решают проблему с динамическими классами в production сборке.

### Проблема

При использовании динамических классов Tailwind CSS (например, `bg-${color}-50`) в production сборке эти классы могут не попасть в финальный CSS файл, так как Tailwind не может определить, какие именно классы используются.

### Решение

Вместо динамических классов используйте статические классы через объект `colorClasses`:

```tsx
// ❌ Плохо - динамические классы
<span className={`bg-${color}-50 dark:bg-${color}-800/30`}>
  {icon}
</span>

// ✅ Хорошо - статические классы
<span className={clsx(
  'flex justify-center items-center size-12 xl:size-16 mx-auto text-white rounded-2xl',
  getColorClasses(color)
)}>
  {icon}
</span>
```

### Доступные цвета

Поддерживаются все основные цвета Tailwind CSS:
- `teal`, `indigo`, `yellow`, `blue`, `cyan`, `green`, `pink`
- `red`, `orange`, `purple`, `gray`, `slate`, `zinc`, `neutral`
- `stone`, `emerald`, `lime`, `amber`, `sky`, `violet`, `fuchsia`, `rose`

### API

```tsx
import { TailwindColor, getColorClasses, getTextColorClasses } from '@/shared/utils/colors'

// Тип для цветов
type TailwindColor = 'teal' | 'indigo' | 'yellow' | /* ... */

// Получить классы для фона
getColorClasses('blue') // 'bg-blue-50 dark:bg-blue-800/30'

// Получить классы для текста
getTextColorClasses('blue') // 'text-blue-600 dark:text-blue-500'
```

### Использование в компонентах

```tsx
import { TailwindColor, getColorClasses } from '@/shared/utils/colors'

interface ButtonProps {
  color?: TailwindColor
  children: React.ReactNode
}

const Button = ({ color = 'blue', children }: ButtonProps) => {
  return (
    <button className={clsx(
      'px-4 py-2 rounded-lg',
      getColorClasses(color)
    )}>
      {children}
    </button>
  )
}
``` 