import { useCallback, useMemo, useState } from 'react'
import { locations, MAX_RENTAL_DAYS } from '../config/site'
import { addDays, toDateTime, toISODate, validatePeriod, type PeriodErrors } from '../lib/period'
import type { Period } from '../lib/types'

const locationIds = locations.map((l) => l.id)

/** Aplica um ajuste de período prevenindo combinações inválidas óbvias. */
export function applyPeriodPatch(prev: Period, patch: Partial<Period>): Period {
  let next = { ...prev, ...patch }
  // devolução acompanha a retirada quando era o mesmo local
  if (patch.pickupLocation && prev.returnLocation === prev.pickupLocation) {
    next.returnLocation = patch.pickupLocation
  }
  // retirada movida para depois da devolução: devolução passa para o dia seguinte
  const start = toDateTime(next.pickupDate, next.pickupTime)
  const end = toDateTime(next.returnDate, next.returnTime)
  if (patch.pickupDate && start && end && end <= start) {
    next = { ...next, returnDate: addDays(next.pickupDate, 1) }
  }
  return next
}

/** Validação e limites de um formulário de período controlado. */
export function usePeriodForm(values: Period, setValues: (next: Period) => void) {
  const [touched, setTouched] = useState(false)
  const today = toISODate(new Date())
  const check = useMemo(() => validatePeriod(values, new Date(), locationIds), [values])

  const update = useCallback((patch: Partial<Period>) => setValues(applyPeriodPatch(values, patch)), [values, setValues])

  const errors: PeriodErrors = touched ? check.errors : {}

  return {
    update,
    check,
    errors,
    touched,
    setTouched,
    minDate: today,
    maxDate: addDays(today, 365),
    minReturn: values.pickupDate || today,
    maxReturn: values.pickupDate ? addDays(values.pickupDate, MAX_RENTAL_DAYS) : undefined,
  }
}
