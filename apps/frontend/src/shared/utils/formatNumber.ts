/**
 * Форматирует число для отображения
 * Убирает лишние нули после точки, но оставляет до 2 знаков после запятой
 */
export const formatNumber = (value: number): string => {
  console.info(value)
  return value.toString()
  // if (Number.isInteger(value)) {
  //   return value.toString()
  // }

  // // Округляем до 2 знаков после запятой и убираем лишние нули
  // return Number(+value.toFixed(2)).toString()
}
