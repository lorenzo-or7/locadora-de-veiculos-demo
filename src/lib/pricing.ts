import type { Addon, AddonSelection, Vehicle } from './types'

export const HOUR_MS = 60 * 60 * 1000
export const DAY_MS = 24 * HOUR_MS

/**
 * Quantidade de diárias entre retirada e devolução.
 * - Períodos de 24 horas.
 * - Qualquer fração adicional conta como outra diária.
 * - Mínimo de uma diária.
 * Retorna `null` quando o intervalo é inválido (devolução não posterior à retirada).
 */
export function rentalDays(pickup: Date, dropoff: Date): number | null {
  const start = pickup.getTime()
  const end = dropoff.getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  const diff = end - start
  if (diff <= 0) return null
  return Math.max(1, Math.ceil(diff / DAY_MS))
}

/** Clampa a quantidade escolhida ao intervalo permitido do adicional. */
export function clampQuantity(addon: Addon, qty: number): number {
  if (!Number.isFinite(qty)) return 0
  return Math.min(addon.max, Math.max(0, Math.floor(qty)))
}

export interface AddonLine {
  addon: Addon
  quantity: number
  /** Unidades cobradas (diárias × quantidade, ou só quantidade por locação). */
  units: number
  total: number
}

export function addonLine(addon: Addon, quantity: number, days: number): AddonLine {
  const q = clampQuantity(addon, quantity)
  const units = addon.unit === 'dia' ? q * days : q
  return { addon, quantity: q, units, total: units * addon.price }
}

export interface Quote {
  days: number
  dailyRate: number
  dailyTotal: number
  addons: AddonLine[]
  addonsTotal: number
  total: number
}

/** Calcula o orçamento estimado. Função pura: não depende de estado externo. */
export function buildQuote(
  vehicle: Pick<Vehicle, 'dailyRate'>,
  days: number,
  catalog: Addon[],
  selection: AddonSelection,
): Quote {
  const d = Math.max(1, Math.floor(days))
  const lines = catalog
    .map((a) => addonLine(a, selection[a.id] ?? 0, d))
    .filter((l) => l.quantity > 0)
  const dailyTotal = vehicle.dailyRate * d
  const addonsTotal = lines.reduce((s, l) => s + l.total, 0)
  return {
    days: d,
    dailyRate: vehicle.dailyRate,
    dailyTotal,
    addons: lines,
    addonsTotal,
    total: dailyTotal + addonsTotal,
  }
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })
const brlShort = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const formatBRL = (value: number) => brl.format(value)
export const formatBRLShort = (value: number) => brlShort.format(value)

export const pluralDays = (n: number) => (n === 1 ? '1 diária' : `${n} diárias`)
