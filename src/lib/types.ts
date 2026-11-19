export type CategoryId = 'economico' | 'suv' | 'sedan' | 'premium' | 'utilitario'

export type Transmission = 'automatico' | 'manual'

export type Fuel = 'Flex' | 'Gasolina' | 'Híbrido' | 'Elétrico' | 'Diesel'

export interface Photo {
  /** Identificador da foto no Unsplash (sem o prefixo `photo-`). */
  id: string
  alt: string
  /** CSS object-position usado nos recortes. */
  focus?: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  category: CategoryId
  photo: Photo
  /** Preço diário ilustrativo, em reais. */
  dailyRate: number
  transmission: Transmission
  passengers: number
  luggage: number
  fuel: Fuel
  features: string[]
  description: string
  /** Frase curta usada no destaque editorial. */
  tagline: string
}

export type AddonUnit = 'dia' | 'locacao'

export interface Addon {
  id: string
  name: string
  description: string
  price: number
  unit: AddonUnit
  /** Quantidade máxima permitida (1 = liga/desliga). */
  max: number
}

/** Quantidade escolhida por adicional. Ausente ou 0 = não selecionado. */
export type AddonSelection = Record<string, number>

export interface Period {
  pickupLocation: string
  pickupDate: string // YYYY-MM-DD
  pickupTime: string // HH:mm
  returnLocation: string
  returnDate: string
  returnTime: string
}

export type SortKey = 'destaque' | 'preco-asc' | 'preco-desc' | 'nome'

export interface FleetFilters {
  category: CategoryId | 'todos'
  price: PriceRangeId
  transmission: Transmission | 'qualquer'
  minPassengers: number
  minLuggage: number
  sort: SortKey
}

export type PriceRangeId = 'qualquer' | 'ate-150' | '150-250' | '250-400' | 'acima-400'
