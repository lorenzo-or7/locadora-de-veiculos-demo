import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { addons as addonCatalog } from '../data/addons'
import { getVehicle } from '../data/vehicles'
import { locations } from '../config/site'
import { defaultFilters, toggleCompare as toggleCompareIds } from '../lib/fleet'
import { defaultPeriod, validatePeriod } from '../lib/period'
import { clampQuantity } from '../lib/pricing'
import { isRecord, readJSON, writeJSON } from '../lib/storage'
import type { AddonSelection, FleetFilters, Period } from '../lib/types'
import { scrollToId } from '../lib/scroll'

const STORAGE_KEY = 'velor:booking:v1'

interface Persisted {
  period: Period
  vehicleId: string | null
  addons: AddonSelection
  compare: string[]
  searched: boolean
}

const locationIds = locations.map((l) => l.id)

function isPersisted(v: unknown): v is Persisted {
  if (!isRecord(v) || !isRecord(v.period) || !isRecord(v.addons) || !Array.isArray(v.compare)) return false
  const p = v.period
  return ['pickupLocation', 'pickupDate', 'pickupTime', 'returnLocation', 'returnDate', 'returnTime'].every(
    (k) => typeof p[k] === 'string',
  )
}

/** Restaura somente dados válidos e não sensíveis. */
function loadInitial(): Persisted {
  const fallback: Persisted = { period: defaultPeriod(), vehicleId: null, addons: {}, compare: [], searched: false }
  const saved = readJSON(STORAGE_KEY, isPersisted)
  if (!saved) return fallback
  const periodOk = validatePeriod(saved.period, new Date(), locationIds).valid
  const addons: AddonSelection = {}
  for (const a of addonCatalog) {
    const q = clampQuantity(a, Number(saved.addons[a.id] ?? 0))
    if (q > 0) addons[a.id] = q
  }
  return {
    period: periodOk ? saved.period : fallback.period,
    vehicleId: getVehicle(saved.vehicleId) ? saved.vehicleId : null,
    addons,
    compare: saved.compare.filter((id): id is string => typeof id === 'string' && !!getVehicle(id)).slice(0, 3),
    searched: periodOk && saved.searched === true,
  }
}

export type SimStep = 0 | 1 | 2 | 3

interface Toast {
  id: number
  message: string
}

interface BookingCtx {
  period: Period
  setPeriod: (patch: Partial<Period>) => void
  searched: boolean
  applySearch: (p: Period) => void
  clearSearch: () => void

  vehicleId: string | null
  selectVehicle: (id: string, opts?: { goToSimulator?: boolean }) => void

  addons: AddonSelection
  setAddonQty: (id: string, qty: number) => void

  compare: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void
  compareOpen: boolean
  setCompareOpen: (open: boolean) => void

  filters: FleetFilters
  setFilters: (patch: Partial<FleetFilters>) => void
  resetFilters: () => void

  detailId: string | null
  openDetail: (id: string) => void
  closeDetail: () => void

  step: SimStep
  setStep: (s: SimStep) => void

  toast: Toast | null
  notify: (message: string) => void
}

const Ctx = createContext<BookingCtx | null>(null)


export function BookingProvider({ children }: { children: ReactNode }) {
  const [initial] = useState<Persisted>(loadInitial)

  const [period, setPeriodState] = useState<Period>(initial.period)
  const [searched, setSearched] = useState(initial.searched)
  const [vehicleId, setVehicleId] = useState<string | null>(initial.vehicleId)
  const [addons, setAddons] = useState<AddonSelection>(initial.addons)
  const [compare, setCompare] = useState<string[]>(initial.compare)
  const [compareOpen, setCompareOpen] = useState(false)
  const [filters, setFiltersState] = useState<FleetFilters>(defaultFilters)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [step, setStep] = useState<SimStep>(0)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    writeJSON(STORAGE_KEY, { period, vehicleId, addons, compare, searched } satisfies Persisted)
  }, [period, vehicleId, addons, compare, searched])

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }, [])

  const setPeriod = useCallback((patch: Partial<Period>) => setPeriodState((p) => ({ ...p, ...patch })), [])

  const applySearch = useCallback((p: Period) => {
    setPeriodState(p)
    setSearched(true)
  }, [])

  const clearSearch = useCallback(() => setSearched(false), [])

  const selectVehicle = useCallback(
    (id: string, opts?: { goToSimulator?: boolean }) => {
      const v = getVehicle(id)
      if (!v) return
      setVehicleId(id)
      if (opts?.goToSimulator) {
        setStep(1)
        setDetailId(null)
        setCompareOpen(false)
        // aguarda o fechamento de overlays antes de rolar
        window.setTimeout(() => scrollToId('sim-steps'), 60)
      }
      notify(`${v.brand} ${v.model} selecionado para a simulação.`)
    },
    [notify],
  )

  const setAddonQty = useCallback((id: string, qty: number) => {
    const addon = addonCatalog.find((a) => a.id === id)
    if (!addon) return
    setAddons((prev) => {
      const next = { ...prev }
      const q = clampQuantity(addon, qty)
      if (q > 0) next[id] = q
      else delete next[id]
      return next
    })
  }, [])

  const toggleCompare = useCallback(
    (id: string) => {
      const r = toggleCompareIds(compare, id)
      if (r.rejected) {
        notify('Você pode comparar até três veículos. Remova um para adicionar outro.')
        return
      }
      setCompare(r.ids)
    },
    [compare, notify],
  )

  const value = useMemo<BookingCtx>(
    () => ({
      period,
      setPeriod,
      searched,
      applySearch,
      clearSearch,
      vehicleId,
      selectVehicle,
      addons,
      setAddonQty,
      compare,
      toggleCompare,
      clearCompare: () => {
        setCompare([])
        setCompareOpen(false)
      },
      compareOpen,
      setCompareOpen,
      filters,
      setFilters: (patch) => setFiltersState((f) => ({ ...f, ...patch })),
      resetFilters: () => setFiltersState((f) => ({ ...defaultFilters, sort: f.sort })),
      detailId,
      openDetail: (id) => getVehicle(id) && setDetailId(id),
      closeDetail: () => setDetailId(null),
      step,
      setStep,
      toast,
      notify,
    }),
    [period, setPeriod, searched, applySearch, clearSearch, vehicleId, selectVehicle, addons, setAddonQty, compare, toggleCompare, compareOpen, filters, detailId, step, toast, notify],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBooking precisa estar dentro de BookingProvider')
  return ctx
}
