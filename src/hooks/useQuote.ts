import { useMemo } from 'react'
import { addons as addonCatalog } from '../data/addons'
import { getVehicle } from '../data/vehicles'
import { locations } from '../config/site'
import { validatePeriod } from '../lib/period'
import { buildQuote } from '../lib/pricing'
import { useBooking } from '../state/booking'

const locationIds = locations.map((l) => l.id)

/** Orçamento derivado do estado atual da reserva. */
export function useQuote() {
  const { period, vehicleId, addons } = useBooking()
  const vehicle = getVehicle(vehicleId)
  const check = useMemo(() => validatePeriod(period, new Date(), locationIds), [period])
  const quote = useMemo(
    () => (vehicle && check.days ? buildQuote(vehicle, check.days, addonCatalog, addons) : null),
    [vehicle, check.days, addons],
  )
  return { vehicle, check, quote }
}

export const locationName = (id: string) => locations.find((l) => l.id === id)?.name ?? '—'
