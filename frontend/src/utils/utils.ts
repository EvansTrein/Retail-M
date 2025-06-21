/**
 * Конвертирует UNIX-временную метку в строку формата "дд.мм.гггг, чч:мм"
 * @param timestamp - UNIX-временная метка в миллисекундах
 * @returns Строка в локализованном виде
 */
export function convertTimestampToLocaleString(timestamp: number): string {
  return new Date(timestamp).toLocaleString('ru-RU', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Конвертирует строку даты в UNIX-временную метку в миллисекундах
 * @param dateStr - Строка в формате ISO или любой другого понятного JS
 * @returns UNIX-временная метка в миллисекундах
 */
export function convertLocaleStringToTimestamp(dateStr: string): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return date.getTime();
}
