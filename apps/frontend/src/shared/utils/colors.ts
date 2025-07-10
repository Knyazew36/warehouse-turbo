export type TailwindColor =
  | 'teal'
  | 'indigo'
  | 'yellow'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'pink'
  | 'red'
  | 'orange'
  | 'purple'
  | 'gray'
  | 'slate'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'emerald'
  | 'lime'
  | 'amber'
  | 'sky'
  | 'violet'
  | 'fuchsia'
  | 'rose'

export const colorClasses = {
  teal: 'bg-teal-50 dark:bg-teal-800/30',
  indigo: 'bg-indigo-50 dark:bg-indigo-800/30',
  yellow: 'bg-yellow-50 dark:bg-yellow-800/30',
  blue: 'bg-blue-50 dark:bg-blue-800/30',
  cyan: 'bg-cyan-50 dark:bg-cyan-800/30',
  green: 'bg-green-50 dark:bg-green-800/30',
  pink: 'bg-pink-50 dark:bg-pink-800/30',
  red: 'bg-red-50 dark:bg-red-800/30',
  orange: 'bg-orange-50 dark:bg-orange-800/30',
  purple: 'bg-purple-50 dark:bg-purple-800/30',
  gray: 'bg-gray-50 dark:bg-gray-800/30',
  slate: 'bg-slate-50 dark:bg-slate-800/30',
  zinc: 'bg-zinc-50 dark:bg-zinc-800/30',
  neutral: 'bg-neutral-50 dark:bg-neutral-800/30',
  stone: 'bg-stone-50 dark:bg-stone-800/30',
  emerald: 'bg-emerald-50 dark:bg-emerald-800/30',
  lime: 'bg-lime-50 dark:bg-lime-800/30',
  amber: 'bg-amber-50 dark:bg-amber-800/30',
  sky: 'bg-sky-50 dark:bg-sky-800/30',
  violet: 'bg-violet-50 dark:bg-violet-800/30',
  fuchsia: 'bg-fuchsia-50 dark:bg-fuchsia-800/30',
  rose: 'bg-rose-50 dark:bg-rose-800/30'
} as const

export const textColorClasses = {
  teal: 'text-teal-600 dark:text-teal-500',
  indigo: 'text-indigo-600 dark:text-indigo-500',
  yellow: 'text-yellow-600 dark:text-yellow-500',
  blue: 'text-blue-600 dark:text-blue-500',
  cyan: 'text-cyan-600 dark:text-cyan-500',
  green: 'text-green-600 dark:text-green-500',
  pink: 'text-pink-600 dark:text-pink-500',
  red: 'text-red-600 dark:text-red-500',
  orange: 'text-orange-600 dark:text-orange-500',
  purple: 'text-purple-600 dark:text-purple-500',
  gray: 'text-gray-600 dark:text-gray-500',
  slate: 'text-slate-600 dark:text-slate-500',
  zinc: 'text-zinc-600 dark:text-zinc-500',
  neutral: 'text-neutral-600 dark:text-neutral-500',
  stone: 'text-stone-600 dark:text-stone-500',
  emerald: 'text-emerald-600 dark:text-emerald-500',
  lime: 'text-lime-600 dark:text-lime-500',
  amber: 'text-amber-600 dark:text-amber-500',
  sky: 'text-sky-600 dark:text-sky-500',
  violet: 'text-violet-600 dark:text-violet-500',
  fuchsia: 'text-fuchsia-600 dark:text-fuchsia-500',
  rose: 'text-rose-600 dark:text-rose-500'
} as const

export const getColorClasses = (color: TailwindColor) => colorClasses[color]
export const getTextColorClasses = (color: TailwindColor) => textColorClasses[color]
