import { MAX_RENTAL_DAYS, timeSlots } from '../config/site'
import { rentalDays } from './pricing'
import type { Period } from './types'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

/** Converte data (YYYY-MM-DD) e hora (HH:mm) locais em Date. `null` se inválidas. */
export function toDateTime(date: string, time: string): Date | null {
  if (!DATE_RE.test(date) || !TIME_RE.test(time)) return null
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0)
  // Rejeita datas que "transbordam" (ex.: 2026-02-31)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null
  return dt
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(date: string, days: number): string {
  const dt = toDateTime(date, '12:00')
  if (!dt) return date
  dt.setDate(dt.getDate() + days)
  return toISODate(dt)
}

export type PeriodField = keyof Period

export type PeriodErrors = Partial<Record<PeriodField | 'range', string>>

export interface PeriodCheck {
  valid: boolean
  errors: PeriodErrors
  days: number | null
}

/**
 * Valida o período. `now` é injetável para manter a função pura e testável.
 */
export function validatePeriod(p: Period, now: Date = new Date(), locationIds?: string[]): PeriodCheck {
  const errors: PeriodErrors = {}

  if (!p.pickupLocation) errors.pickupLocation = 'Escolha o local de retirada.'
  else if (locationIds && !locationIds.includes(p.pickupLocation)) errors.pickupLocation = 'Local de retirada inválido.'

  if (!p.returnLocation) errors.returnLocation = 'Escolha o local de devolução.'
  else if (locationIds && !locationIds.includes(p.returnLocation)) errors.returnLocation = 'Local de devolução inválido.'

  if (!p.pickupDate) errors.pickupDate = 'Informe a data de retirada.'
  if (!p.pickupTime) errors.pickupTime = 'Informe o horário de retirada.'
  else if (!timeSlots.includes(p.pickupTime)) errors.pickupTime = 'Escolha um horário entre 07:00 e 22:00.'
  if (!p.returnDate) errors.returnDate = 'Informe a data de devolução.'
  if (!p.returnTime) errors.returnTime = 'Informe o horário de devolução.'
  else if (!timeSlots.includes(p.returnTime)) errors.returnTime = 'Escolha um horário entre 07:00 e 22:00.'

  const start = p.pickupDate && p.pickupTime ? toDateTime(p.pickupDate, p.pickupTime) : null
  const end = p.returnDate && p.returnTime ? toDateTime(p.returnDate, p.returnTime) : null

  if (p.pickupDate && !errors.pickupTime && !start) errors.pickupDate = 'Data de retirada inválida.'
  if (p.returnDate && !errors.returnTime && !end) errors.returnDate = 'Data de devolução inválida.'

  let days: number | null = null
  if (start && end) {
    if (start.getTime() < now.getTime()) {
      errors.pickupDate = 'A retirada precisa ser em um horário futuro.'
    }
    days = rentalDays(start, end)
    if (days === null) {
      errors.range = 'A devolução precisa ser depois da retirada.'
    } else if (days > MAX_RENTAL_DAYS) {
      errors.range = `Para períodos acima de ${MAX_RENTAL_DAYS} diárias, fale com o atendimento.`
      days = null
    }
  }

  const valid = Object.keys(errors).length === 0
  return { valid, errors, days: valid ? days : null }
}

/** Período padrão: amanhã às 10:00 até três dias depois. */
export function defaultPeriod(now: Date = new Date(), location = 'aeroporto'): Period {
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const pickupDate = toISODate(tomorrow)
  return {
    pickupLocation: location,
    pickupDate,
    pickupTime: '10:00',
    returnLocation: location,
    returnDate: addDays(pickupDate, 3),
    returnTime: '10:00',
  }
}

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
const longDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function formatShortDate(date: string): string {
  const d = toDateTime(date, '12:00')
  return d ? weekday.format(d).replace(/\./g, '') : '—'
}

export function formatLongDate(date: string): string {
  const d = toDateTime(date, '12:00')
  return d ? longDate.format(d) : '—'
}
