import type { FleetFilters, PriceRangeId, Vehicle } from './types'

export const priceRanges: { id: PriceRangeId; label: string; min: number; max: number }[] = [
  { id: 'qualquer', label: 'Qualquer valor', min: 0, max: Infinity },
  { id: 'ate-150', label: 'Até R$ 150', min: 0, max: 150 },
  { id: '150-250', label: 'R$ 150 a 250', min: 150.01, max: 250 },
  { id: '250-400', label: 'R$ 250 a 400', min: 250.01, max: 400 },
  { id: 'acima-400', label: 'Acima de R$ 400', min: 400.01, max: Infinity },
]

export const defaultFilters: FleetFilters = {
  category: 'todos',
  price: 'qualquer',
  transmission: 'qualquer',
  minPassengers: 0,
  minLuggage: 0,
  sort: 'destaque',
}

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' })

export const vehicleName = (v: Pick<Vehicle, 'brand' | 'model'>) => `${v.brand} ${v.model}`

/** Ordem editorial padrão: alterna categorias para dar ritmo ao catálogo. */
export const featuredOrder = [
  'solenne-noir',
  'vantor-horizonte',
  'norra-sena',
  'kestrel-brisa',
  'ridge-cargo',
  'arvo-lumo',
  'solenne-costa-gt',
  'kestrel-trilha',
  'norra-atlas',
  'vantor-cumbre',
  'aurel-m',
  'solenne-ville',
  'ridge-duna',
  'arvo-pico',
]

const featuredRank = (id: string) => {
  const i = featuredOrder.indexOf(id)
  return i === -1 ? featuredOrder.length : i
}

/** Filtra e ordena a frota. Função pura. */
export function filterFleet(list: Vehicle[], f: FleetFilters): Vehicle[] {
  const range = priceRanges.find((r) => r.id === f.price) ?? priceRanges[0]
  const out = list.filter(
    (v) =>
      (f.category === 'todos' || v.category === f.category) &&
      v.dailyRate >= range.min &&
      v.dailyRate <= range.max &&
      (f.transmission === 'qualquer' || v.transmission === f.transmission) &&
      v.passengers >= f.minPassengers &&
      v.luggage >= f.minLuggage,
  )
  const sorted = [...out]
  switch (f.sort) {
    case 'destaque':
      sorted.sort((a, b) => featuredRank(a.id) - featuredRank(b.id))
      break
    case 'preco-asc':
      sorted.sort((a, b) => a.dailyRate - b.dailyRate || collator.compare(vehicleName(a), vehicleName(b)))
      break
    case 'preco-desc':
      sorted.sort((a, b) => b.dailyRate - a.dailyRate || collator.compare(vehicleName(a), vehicleName(b)))
      break
    case 'nome':
      sorted.sort((a, b) => collator.compare(vehicleName(a), vehicleName(b)))
      break
  }
  return sorted
}

/** Quantos filtros secundários (fora categoria e ordenação) estão ativos. */
export function activeRefinements(f: FleetFilters): number {
  return (
    (f.price !== 'qualquer' ? 1 : 0) +
    (f.transmission !== 'qualquer' ? 1 : 0) +
    (f.minPassengers > 0 ? 1 : 0) +
    (f.minLuggage > 0 ? 1 : 0)
  )
}

export const MAX_COMPARE = 3

/** Alterna um veículo na lista de comparação, respeitando o limite. */
export function toggleCompare(ids: string[], id: string, max = MAX_COMPARE): { ids: string[]; rejected: boolean } {
  if (ids.includes(id)) return { ids: ids.filter((x) => x !== id), rejected: false }
  if (ids.length >= max) return { ids, rejected: true }
  return { ids: [...ids, id], rejected: false }
}

/** Indica se os valores de uma linha do comparador diferem entre os veículos. */
export function rowDiffers(values: (string | number)[]): boolean {
  return new Set(values.map(String)).size > 1
}
