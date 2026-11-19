import { describe, expect, it } from 'vitest'
import { addons } from '../data/addons'
import { addonLine, buildQuote, clampQuantity, formatBRL, rentalDays } from './pricing'

const d = (s: string) => new Date(s)

describe('rentalDays', () => {
  it('conta períodos exatos de 24 horas', () => {
    expect(rentalDays(d('2026-12-01T10:00'), d('2026-12-04T10:00'))).toBe(3)
  })
  it('cobra fração adicional como outra diária', () => {
    expect(rentalDays(d('2026-12-01T10:00'), d('2026-12-04T10:30'))).toBe(4)
    expect(rentalDays(d('2026-12-01T10:00'), d('2026-12-02T10:01'))).toBe(2)
  })
  it('aplica mínimo de uma diária', () => {
    expect(rentalDays(d('2026-12-01T10:00'), d('2026-12-01T12:00'))).toBe(1)
  })
  it('rejeita intervalos inválidos', () => {
    expect(rentalDays(d('2026-12-01T10:00'), d('2026-12-01T10:00'))).toBeNull()
    expect(rentalDays(d('2026-12-02T10:00'), d('2026-12-01T10:00'))).toBeNull()
    expect(rentalDays(new Date('invalid'), d('2026-12-01T10:00'))).toBeNull()
  })
})

describe('adicionais', () => {
  const protecao = addons.find((a) => a.id === 'protecao')!
  const gps = addons.find((a) => a.id === 'gps')!
  const cadeirinha = addons.find((a) => a.id === 'cadeirinha')!

  it('cobra adicional diário por diária', () => {
    expect(addonLine(protecao, 1, 4).total).toBe(39 * 4)
  })
  it('cobra adicional por locação uma única vez', () => {
    expect(addonLine(gps, 1, 10).total).toBe(45)
  })
  it('multiplica quantidade por diárias', () => {
    expect(addonLine(cadeirinha, 2, 3).total).toBe(18 * 2 * 3)
  })
  it('limita quantidade ao máximo e ignora valores inválidos', () => {
    expect(clampQuantity(cadeirinha, 10)).toBe(3)
    expect(clampQuantity(cadeirinha, -2)).toBe(0)
    expect(clampQuantity(cadeirinha, Number.NaN)).toBe(0)
  })
})

describe('buildQuote', () => {
  it('soma diárias e adicionais', () => {
    const q = buildQuote({ dailyRate: 200 }, 3, addons, { protecao: 1, gps: 1, condutor: 0 })
    expect(q.dailyTotal).toBe(600)
    expect(q.addons.map((l) => l.addon.id)).toEqual(['protecao', 'gps'])
    expect(q.addonsTotal).toBe(39 * 3 + 45)
    expect(q.total).toBe(600 + 117 + 45)
  })
  it('sem adicionais o total é igual às diárias', () => {
    const q = buildQuote({ dailyRate: 139 }, 1, addons, {})
    expect(q.total).toBe(139)
    expect(q.addons).toHaveLength(0)
  })
  it('garante ao menos uma diária', () => {
    expect(buildQuote({ dailyRate: 100 }, 0, addons, {}).days).toBe(1)
  })
})

describe('formatBRL', () => {
  it('formata em reais', () => {
    expect(formatBRL(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50')
  })
})
