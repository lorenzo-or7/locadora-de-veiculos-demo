import { describe, expect, it } from 'vitest'
import { vehicles } from '../data/vehicles'
import { activeRefinements, defaultFilters, featuredOrder, filterFleet, rowDiffers, toggleCompare } from './fleet'

describe('dados da frota', () => {
  it('possui ao menos 10 veículos com ids únicos e campos completos', () => {
    expect(vehicles.length).toBeGreaterThanOrEqual(10)
    expect(new Set(vehicles.map((v) => v.id)).size).toBe(vehicles.length)
    for (const v of vehicles) {
      expect(v.dailyRate).toBeGreaterThan(0)
      expect(v.features.length).toBeGreaterThan(0)
      expect(v.photo.id).toMatch(/^\d+-[0-9a-f]+$/)
    }
  })
  it('cobre todas as categorias', () => {
    expect(new Set(vehicles.map((v) => v.category))).toEqual(new Set(['economico', 'suv', 'sedan', 'premium', 'utilitario']))
  })
})

describe('filterFleet', () => {
  it('filtra por categoria', () => {
    const r = filterFleet(vehicles, { ...defaultFilters, category: 'suv' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((v) => v.category === 'suv')).toBe(true)
  })
  it('filtra por faixa de preço, transmissão, passageiros e malas', () => {
    const r = filterFleet(vehicles, { ...defaultFilters, price: 'ate-150', transmission: 'manual' })
    expect(r.every((v) => v.dailyRate <= 150 && v.transmission === 'manual')).toBe(true)
    const seven = filterFleet(vehicles, { ...defaultFilters, minPassengers: 7 })
    expect(seven.every((v) => v.passengers >= 7)).toBe(true)
    const bags = filterFleet(vehicles, { ...defaultFilters, minLuggage: 4 })
    expect(bags.every((v) => v.luggage >= 4)).toBe(true)
  })
  it('ordena por preço e nome', () => {
    const asc = filterFleet(vehicles, { ...defaultFilters, sort: 'preco-asc' }).map((v) => v.dailyRate)
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    const desc = filterFleet(vehicles, { ...defaultFilters, sort: 'preco-desc' }).map((v) => v.dailyRate)
    expect(desc).toEqual([...desc].sort((a, b) => b - a))
    const names = filterFleet(vehicles, { ...defaultFilters, sort: 'nome' }).map((v) => `${v.brand} ${v.model}`)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pt-BR')))
  })
  it('ordem em destaque cobre toda a frota e é a padrão', () => {
    expect(new Set(featuredOrder)).toEqual(new Set(vehicles.map((v) => v.id)))
    expect(filterFleet(vehicles, defaultFilters).map((v) => v.id)).toEqual(featuredOrder)
  })
  it('retorna vazio quando nada corresponde', () => {
    expect(filterFleet(vehicles, { ...defaultFilters, category: 'economico', minPassengers: 7 })).toEqual([])
  })
  it('conta refinamentos ativos', () => {
    expect(activeRefinements(defaultFilters)).toBe(0)
    expect(activeRefinements({ ...defaultFilters, price: 'ate-150', minLuggage: 2 })).toBe(2)
  })
})

describe('comparador', () => {
  it('permite no máximo três veículos', () => {
    let ids: string[] = []
    for (const id of ['a', 'b', 'c']) ids = toggleCompare(ids, id).ids
    const r = toggleCompare(ids, 'd')
    expect(r.rejected).toBe(true)
    expect(r.ids).toEqual(['a', 'b', 'c'])
    expect(toggleCompare(ids, 'b').ids).toEqual(['a', 'c'])
  })
  it('detecta diferenças entre valores', () => {
    expect(rowDiffers([5, 5, 5])).toBe(false)
    expect(rowDiffers([5, 7])).toBe(true)
  })
})
