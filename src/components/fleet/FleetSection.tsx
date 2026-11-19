import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { CalendarClock, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { categories, vehicles } from '../../data/vehicles'
import { useDialog } from '../../hooks/useDialog'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { locationName } from '../../hooks/useQuote'
import { activeRefinements, defaultFilters, filterFleet } from '../../lib/fleet'
import { formatShortDate, validatePeriod } from '../../lib/period'
import { pluralDays } from '../../lib/pricing'
import type { SortKey, Vehicle } from '../../lib/types'
import { scrollToId } from '../../lib/scroll'
import { useBooking } from '../../state/booking'
import { Button } from '../ui/Button'
import { ChoiceGroup } from '../ui/ChoiceGroup'
import { FilterControls } from './FilterControls'
import { VehicleCard } from './VehicleCard'

const ROW_PATTERNS = [
  [7, 5],
  [4, 4, 4],
  [5, 7],
]

const spanClass: Record<number, string> = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  12: 'lg:col-span-12',
}

/** Distribui veículos em linhas com proporções alternadas. */
function editorialRows(list: Vehicle[]) {
  const rows: { v: Vehicle; span: number }[][] = []
  let i = 0
  let p = 0
  while (i < list.length) {
    const pattern = ROW_PATTERNS[p % ROW_PATTERNS.length]
    const slice = list.slice(i, i + pattern.length)
    const spans = slice.length === pattern.length ? pattern : slice.map(() => 12 / slice.length)
    rows.push(slice.map((v, k) => ({ v, span: spans[k] })))
    i += pattern.length
    p++
  }
  return rows.flat()
}

export function FleetSection() {
  const { filters, setFilters, resetFilters, period, searched, clearSearch } = useBooking()
  const reduce = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [panelOpen, setPanelOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => filterFleet(vehicles, filters), [filters])
  const refinements = activeRefinements(filters)
  const days = useMemo(() => (searched ? validatePeriod(period).days : null), [searched, period])

  const counts = useMemo(() => {
    const base = { ...filters, category: 'todos' as const }
    const all = filterFleet(vehicles, base)
    return Object.fromEntries([['todos', all.length], ...categories.map((c) => [c.id, all.filter((v) => v.category === c.id).length])])
  }, [filters])

  const drawerOpen = panelOpen && !isDesktop
  useDialog(drawerRef, drawerOpen, () => setPanelOpen(false))

  const [first, ...rest] = results
  const laidOut = editorialRows(rest)

  return (
    <section id="frota" aria-labelledby="frota-title" className="pt-24 sm:pt-32">
      <div className="container-x">
        <header className="grid gap-6 lg:grid-cols-[1fr_26rem] lg:items-end">
          <div>
            <p className="mb-4 text-[0.95rem] text-fg-2">Frota</p>
            <h2 id="frota-title" className="font-display text-[clamp(2.5rem,7vw,5.75rem)] font-[620] leading-[0.95] tracking-[-0.045em]">
              The Fleet
              <br />
              Collection
            </h2>
          </div>
          <div className="max-w-[40ch] lg:pb-2">
            <p className="text-[1.05rem] text-fg-2">
              Do compacto para o dia a dia ao sedã para chegar bem. Filtre por porte, câmbio e espaço, compare até três modelos e simule a locação.
            </p>
            <p className="mt-3 text-[0.82rem] text-fg-2">Marcas e modelos demonstrativos. As fotos ilustram o porte de cada categoria.</p>
          </div>
        </header>

        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.92rem]"
          >
            <CalendarClock className="size-5 shrink-0 text-accent-ink" aria-hidden />
            <p className="min-w-0 flex-1">
              <span className="font-medium">
                {formatShortDate(period.pickupDate)}, {period.pickupTime} até {formatShortDate(period.returnDate)}, {period.returnTime}
              </span>
              <span className="text-fg-2">
                {' '}
                · {locationName(period.pickupLocation)}
                {days ? ` · ${pluralDays(days)}` : ''}
              </span>
            </p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => scrollToId('reserva')}>
                Ajustar período
              </Button>
              <Button variant="ghost" size="sm" onClick={clearSearch} aria-label="Remover período da listagem">
                <X className="size-4" aria-hidden />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Barra de categorias e ferramentas */}
      <div className="sticky top-[4.75rem] z-30 mt-8 border-y border-line bg-bg/90 backdrop-blur-xl sm:top-[5.25rem]">
        <div className="container-x flex items-center gap-3">
          <ChoiceGroup
            name="categoria"
            legend="Categoria"
            hideLegend
            variant="tabs"
            className="min-w-0 flex-1"
            value={filters.category}
            onChange={(category) => setFilters({ category })}
            options={[{ value: 'todos' as const, label: 'Todos', count: counts.todos }, ...categories.map((c) => ({ value: c.id, label: c.label, count: counts[c.id] }))]}
          />
          <div className="flex shrink-0 items-center gap-2 py-2">
            <label htmlFor="ordenar" className="sr-only">
              Ordenar por
            </label>
            <select
              id="ordenar"
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value as SortKey })}
              className="field hidden !min-h-11 !w-auto !rounded-full !bg-transparent text-[0.9rem] sm:flex"
            >
              <option value="destaque">Em destaque</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
              <option value="nome">Nome</option>
            </select>
            <Button
              variant={panelOpen || refinements ? 'solid' : 'outline'}
              size="sm"
              aria-expanded={panelOpen}
              aria-controls="painel-filtros"
              aria-label={refinements ? `Filtros, ${refinements} ativos` : "Filtros"}
              onClick={() => setPanelOpen((o) => !o)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              <span className="hidden xs:inline">Filtros</span>
              {refinements > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[0.72rem] font-semibold text-on-accent">{refinements}</span>
              )}
            </Button>
          </div>
        </div>

        {/* Painel inline (desktop) */}
        <AnimatePresence initial={false}>
          {isDesktop && panelOpen && (
            <motion.div
              id="painel-filtros"
              key="inline"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-line"
            >
              <div className="container-x py-6">
                <FilterControls idPrefix="fd" filters={filters} onChange={setFilters} />
                <div className="mt-6 flex items-center justify-between text-[0.9rem] text-fg-2">
                  <span aria-live="polite">{results.length === 1 ? '1 veículo encontrado' : `${results.length} veículos encontrados`}</span>
                  <Button variant="ghost" size="sm" onClick={resetFilters} disabled={!refinements && filters.category === 'todos'}>
                    Limpar filtros
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drawer (tablet e mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[60] flex items-end" key="drawer">
            <motion.div
              className="absolute inset-0 bg-[rgb(var(--scrim)/0.6)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              ref={drawerRef}
              id="painel-filtros"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filtros-titulo"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 38 }}
              className="relative flex max-h-[88svh] w-full flex-col rounded-t-[1.75rem] border-t border-line bg-surface"
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <h3 id="filtros-titulo" className="font-display text-xl font-semibold">
                  Filtros
                </h3>
                <button type="button" onClick={() => setPanelOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-elevated" aria-label="Fechar filtros">
                  <X className="size-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pb-4">
                <div className="mb-6 sm:hidden">
                  <ChoiceGroup
                    name="fm-ordem"
                    legend="Ordenar por"
                    value={filters.sort}
                    onChange={(sort) => setFilters({ sort })}
                    options={[
                      { value: 'destaque' as SortKey, label: 'Em destaque' },
                      { value: 'preco-asc' as SortKey, label: 'Menor preço' },
                      { value: 'preco-desc' as SortKey, label: 'Maior preço' },
                      { value: 'nome' as SortKey, label: 'Nome' },
                    ]}
                  />
                </div>
                <FilterControls idPrefix="fm" filters={filters} onChange={setFilters} />
              </div>
              <div className="flex gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Limpar
                </Button>
                <Button onClick={() => setPanelOpen(false)} className="flex-[2]">
                  {results.length === 1 ? 'Ver 1 veículo' : `Ver ${results.length} veículos`}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container-x mt-10 sm:mt-14">
        <p className="sr-only" aria-live="polite">
          {results.length === 1 ? '1 veículo encontrado' : `${results.length} veículos encontrados`}
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-start gap-5 rounded-[1.5rem] border border-dashed border-line px-6 py-14 sm:items-center sm:text-center">
            <SearchX className="size-9 text-fg-2" strokeWidth={1.5} aria-hidden />
            <div>
              <h3 className="font-display text-2xl font-semibold">Nenhum veículo com essa combinação</h3>
              <p className="mt-2 max-w-[46ch] text-fg-2">
                Amplie a faixa de preço ou reduza o número mínimo de lugares e malas. A frota completa tem {vehicles.length} modelos.
              </p>
            </div>
            <Button onClick={() => resetFilters()} variant="solid">
              Limpar filtros
            </Button>
          </div>
        ) : (
          <LayoutGroup id="fleet">
            <motion.ul layout={!reduce} className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
              <AnimatePresence mode="popLayout" initial={false}>
                {first && (
                  <motion.li
                    key={first.id}
                    layout={!reduce}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-2 lg:col-span-12"
                  >
                    <VehicleCard vehicle={first} days={days} layout="feature" />
                  </motion.li>
                )}
                {laidOut.map(({ v, span }, i) => (
                  <motion.li
                    key={v.id}
                    layout={!reduce}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.03 }}
                    className={`flex ${spanClass[span] ?? 'lg:col-span-6'}`}
                  >
                    <div className="w-full">
                      <VehicleCard vehicle={v} days={days} layout={span >= 7 ? 'wide' : span === 12 ? 'wide' : 'narrow'} />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        )}

        {(refinements > 0 || filters.category !== defaultFilters.category) && results.length > 0 && (
          <div className="mt-14 flex justify-center">
            <Button variant="outline" onClick={resetFilters}>
              Ver a frota completa
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
