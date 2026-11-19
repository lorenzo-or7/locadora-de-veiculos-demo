import { motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { categoryLabel, getVehicle } from '../../data/vehicles'
import { useDialog } from '../../hooks/useDialog'
import { rowDiffers } from '../../lib/fleet'
import { formatBRLShort } from '../../lib/pricing'
import type { Vehicle } from '../../lib/types'
import { useBooking } from '../../state/booking'
import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'
import { transmissionLabel } from '../fleet/Specs'

interface Row {
  label: string
  value: (v: Vehicle) => string | number
  display?: (v: Vehicle) => React.ReactNode
}

const rows: Row[] = [
  { label: 'Diária', value: (v) => v.dailyRate, display: (v) => <span className="font-display text-lg font-semibold tabular-nums">{formatBRLShort(v.dailyRate)}</span> },
  { label: 'Categoria', value: (v) => categoryLabel(v.category) },
  { label: 'Passageiros', value: (v) => v.passengers, display: (v) => `${v.passengers} lugares` },
  { label: 'Bagagens', value: (v) => v.luggage, display: (v) => `${v.luggage} ${v.luggage === 1 ? 'mala' : 'malas'}` },
  { label: 'Transmissão', value: (v) => transmissionLabel(v.transmission) },
  { label: 'Combustível', value: (v) => v.fuel },
  {
    label: 'Principais recursos',
    value: (v) => v.features.join('|'),
    display: (v) => (
      <ul className="space-y-1.5">
        {v.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    ),
  },
]

export default function CompareDialog() {
  const { compare, setCompareOpen, selectVehicle, toggleCompare } = useBooking()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [onlyDiff, setOnlyDiff] = useState(false)
  const close = useCallback(() => setCompareOpen(false), [setCompareOpen])
  useDialog(ref, true, close)

  const items = compare.map(getVehicle).filter((v): v is Vehicle => !!v)
  const visibleRows = rows.filter((r) => !onlyDiff || rowDiffers(items.map(r.value)))
  const cols = `minmax(8.5rem,0.7fr) repeat(${items.length}, minmax(13.5rem,1fr))`

  return (
    <motion.div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[rgb(var(--scrim)/0.7)] backdrop-blur-sm" onClick={close} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmp-title"
        initial={{ y: reduce ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="relative flex max-h-[92svh] w-full max-w-[72rem] flex-col overflow-hidden rounded-t-[1.75rem] border border-line bg-bg sm:rounded-[1.75rem]"
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3 sm:px-7">
          <h2 id="cmp-title" className="font-display text-xl font-semibold sm:text-2xl">
            Comparar veículos
          </h2>
          <label className="ml-auto flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9rem] text-fg-2">
            <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} className="size-[1.1rem] accent-[var(--accent)]" />
            Só diferenças
          </label>
          <button type="button" onClick={close} aria-label="Fechar comparação" className="grid size-11 place-items-center rounded-full hover:bg-elevated">
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-auto overscroll-contain" tabIndex={0} aria-label="Tabela de comparação. Role horizontalmente para ver todos os veículos.">
          <div role="table" aria-labelledby="cmp-title" className="min-w-max">
            <div role="rowgroup" className="sticky top-0 z-[2] bg-bg">
              <div role="row" className="grid border-b border-line" style={{ gridTemplateColumns: cols }}>
                <div role="columnheader" className="sticky left-0 z-[1] bg-bg p-4 text-[0.8rem] text-fg-2 sm:px-7">
                  <span className="sr-only">Característica</span>
                </div>
                {items.map((v) => (
                  <div role="columnheader" key={v.id} className="p-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                      <Photo id={v.photo.id} alt={v.photo.alt} focus={v.photo.focus} sizes="260px" widths={[400, 600]} className="h-full w-full" />
                    </div>
                    <p className="mt-3 text-[0.82rem] text-fg-2">{v.brand}</p>
                    <p className="font-display text-xl font-semibold leading-tight">{v.model}</p>
                  </div>
                ))}
              </div>
            </div>
            <div role="rowgroup">
              {visibleRows.map((r) => {
                const differs = rowDiffers(items.map(r.value))
                return (
                  <div role="row" key={r.label} className="grid border-b border-line" style={{ gridTemplateColumns: cols }}>
                    <div role="rowheader" className="sticky left-0 z-[1] flex flex-col gap-1 bg-bg p-4 text-[0.88rem] text-fg-2 sm:px-7">
                      {r.label}
                      {differs && <span className="w-fit rounded-full bg-accent/15 px-2 py-0.5 text-[0.72rem] font-medium text-accent-ink">Varia</span>}
                    </div>
                    {items.map((v) => (
                      <div role="cell" key={v.id} className={`p-4 text-[0.95rem] ${differs ? 'text-fg' : 'text-fg-2'}`}>
                        {r.display ? r.display(v) : r.value(v)}
                      </div>
                    ))}
                  </div>
                )
              })}
              {visibleRows.length === 0 && <p className="p-7 text-fg-2">Os veículos escolhidos têm as mesmas características nas linhas exibidas.</p>}
              <div role="row" className="grid" style={{ gridTemplateColumns: cols }}>
                <div role="rowheader" className="sticky left-0 z-[1] bg-bg p-4 sm:px-7">
                  <span className="sr-only">Ações</span>
                </div>
                {items.map((v) => (
                  <div role="cell" key={v.id} className="flex flex-col gap-1 p-4">
                    <Button size="sm" onClick={() => selectVehicle(v.id, { goToSimulator: true })}>
                      Selecionar este
                    </Button>
                    <button type="button" onClick={() => toggleCompare(v.id)} className="min-h-11 text-[0.85rem] text-fg-2 hover:text-fg">
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {items.length < 2 && (
          <p className="border-t border-line px-7 py-4 text-[0.9rem] text-fg-2">Adicione outro veículo pela frota para continuar comparando.</p>
        )}
      </motion.div>
    </motion.div>
  )
}
