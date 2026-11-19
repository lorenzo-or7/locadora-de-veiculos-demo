import { describe, expect, it } from 'vitest'
import { addDays, defaultPeriod, toDateTime, validatePeriod } from './period'
import type { Period } from './types'

const now = new Date(2026, 10, 18, 12, 0) // 18/11/2026 12:00

const base: Period = {
  pickupLocation: 'centro',
  pickupDate: '2026-11-20',
  pickupTime: '10:00',
  returnLocation: 'centro',
  returnDate: '2026-11-23',
  returnTime: '10:00',
}

describe('toDateTime', () => {
  it('interpreta data e hora locais', () => {
    const dt = toDateTime('2026-11-20', '09:30')!
    expect([dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes()]).toEqual([2026, 10, 20, 9, 30])
  })
  it('rejeita datas inexistentes e formatos inválidos', () => {
    expect(toDateTime('2026-02-31', '10:00')).toBeNull()
    expect(toDateTime('20/11/2026', '10:00')).toBeNull()
    expect(toDateTime('2026-11-20', '25:00')).toBeNull()
  })
})

describe('validatePeriod', () => {
  it('aceita um período válido e calcula diárias', () => {
    const r = validatePeriod(base, now)
    expect(r.valid).toBe(true)
    expect(r.days).toBe(3)
  })
  it('impede devolução anterior ou igual à retirada', () => {
    expect(validatePeriod({ ...base, returnDate: '2026-11-19' }, now).errors.range).toBeTruthy()
    expect(validatePeriod({ ...base, returnDate: '2026-11-20' }, now).errors.range).toBeTruthy()
  })
  it('impede retirada no passado', () => {
    const r = validatePeriod({ ...base, pickupDate: '2026-11-18', pickupTime: '08:00' }, now)
    expect(r.valid).toBe(false)
    expect(r.errors.pickupDate).toBeTruthy()
  })
  it('exige campos obrigatórios', () => {
    const r = validatePeriod({ ...base, pickupLocation: '', returnTime: '' }, now)
    expect(r.errors.pickupLocation).toBeTruthy()
    expect(r.errors.returnTime).toBeTruthy()
    expect(r.days).toBeNull()
  })
  it('rejeita horários fora da grade e locais desconhecidos', () => {
    const r = validatePeriod({ ...base, pickupTime: '03:00', returnLocation: 'x' }, now, ['centro'])
    expect(r.errors.pickupTime).toBeTruthy()
    expect(r.errors.returnLocation).toBeTruthy()
  })
  it('limita períodos muito longos', () => {
    expect(validatePeriod({ ...base, returnDate: '2027-03-01' }, now).errors.range).toBeTruthy()
  })
  it('conta fração como diária adicional', () => {
    expect(validatePeriod({ ...base, returnTime: '11:00' }, now).days).toBe(4)
  })
})

describe('defaultPeriod', () => {
  it('começa amanhã e é válido', () => {
    const p = defaultPeriod(now)
    expect(p.pickupDate).toBe('2026-11-19')
    expect(p.returnDate).toBe(addDays('2026-11-19', 3))
    expect(validatePeriod(p, now).valid).toBe(true)
  })
})
