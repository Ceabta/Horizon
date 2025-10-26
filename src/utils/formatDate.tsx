import { format, parseISO, isValid } from 'date-fns'

export function formatDateToDDMMYYYY(value: string | Date | null | undefined): string {
  if (!value) return ''
  let date: Date

  if (typeof value === 'string') {
    date = parseISO(value)
  } else {
    date = value
  }

  if (!isValid(date)) return ''

  return format(date, 'dd/MM/yyyy')
}
