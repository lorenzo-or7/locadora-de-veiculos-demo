import { motion } from 'motion/react'
import { Check, Plus } from 'lucide-react'
import { categoryLabel } from '../../data/vehicles'
import { formatBRL, formatBRLShort, pluralDays } from '../../lib/pricing'
import type { Vehicle } from '../../lib/types'
import { useBooking } from '../../state/booking'
import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'
import { SpecRow } from './Specs'

interface Props {
  vehicle: Vehicle
  days: number | null
  layout: 'feature' | 'wide' | 'narrow'
}

export function CompareToggle({ vehicle, className = '', tone = 'theme' }: { vehicle: Vehicle; className?: string; tone?: 'theme' | 'photo' }) {
  const { compare, toggleCompare } = useBooking()
  const active = compare.includes(vehicle.id)
  const photo = tone === 'photo'
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggleCompare(vehicle.id)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.88rem] transition-colors ${
        photo
          ? `bg-black/55 text-white backdrop-blur-md hover:bg-black/75 ${active ? 'ring-1 ring-lime' : ''}`
          : active
            ? 'text-accent-ink'
            : 'text-fg-2 hover:text-fg'
      } ${className}`}
    >
      <span
        className={`grid size-5 place-items-center rounded-md border transition-colors ${
          active ? (photo ? 'border-lime bg-lime text-ink' : 'border-accent bg-accent text-on-accent') : photo ? 'border-white/60' : 'border-line'
        }`}
        aria-hidden
      >
        {active ? <Check className="size-3.5" strokeWidth={3} /> : <Plus className="size-3.5" />}
      </span>
      {active ? 'Na comparação' : 'Comparar'}
      <span className="sr-only">
        {' '}
        {vehicle.brand} {vehicle.model}
      </span>
    </button>
  )
}

export function VehicleCard({ vehicle: v, days, layout }: Props) {
  const { openDetail, selectVehicle, vehicleId } = useBooking()
  const selected = vehicleId === v.id
  const feature = layout === 'feature'
  const titleId = `veh-${v.id}`

  return (
    <article
      aria-labelledby={titleId}
      className={`group relative flex h-full flex-col ${feature ? 'lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10' : ''}`}
    >
      <div
        className={`on-photo relative ${
          feature ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[30rem]' : layout === 'wide' ? 'aspect-[16/10]' : 'aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1'
        }`}
      >
      <button
        type="button"
        onClick={() => openDetail(v.id)}
        className="absolute inset-0 block overflow-hidden rounded-[1.25rem] text-left lg:rounded-[1.5rem]"
        aria-label={`Ver detalhes do ${v.brand} ${v.model}`}
      >
        <motion.div layoutId={`photo-${v.id}`} className="absolute inset-0" transition={{ type: 'spring', stiffness: 220, damping: 30 }}>
          <Photo
            id={v.photo.id}
            alt={v.photo.alt}
            focus={v.photo.focus}
            sizes={feature ? '(min-width: 1024px) 60vw, 100vw' : layout === 'wide' ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 40vw, 100vw'}
            widths={[480, 800, 1200]}
            className="h-full w-full"
            imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          />
        </motion.div>
        <span className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-black/55 px-3 py-1.5 text-[0.78rem] font-medium text-white backdrop-blur-md">{categoryLabel(v.category)}</span>
          {selected && (
            <span className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-[0.78rem] font-semibold text-ink">
              <Check className="size-3.5" strokeWidth={3} aria-hidden /> Selecionado
            </span>
          )}
        </span>
      </button>
      <CompareToggle vehicle={v} tone="photo" className="absolute right-3 top-3 !min-h-10" />
      </div>

      <div className={`flex flex-col ${feature ? 'pt-5 lg:justify-end lg:pb-2 lg:pt-0' : 'pt-4'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.85rem] text-fg-2">{v.brand}</p>
            <h3 id={titleId} className={`font-display font-semibold leading-[1.05] ${feature ? 'text-[clamp(2rem,4vw,3.25rem)]' : 'text-[1.6rem]'}`}>
              {v.model}
            </h3>
          </div>
          {!feature && (
            <p className="shrink-0 text-right">
              <span className="font-display text-[1.35rem] font-semibold tabular-nums">{formatBRLShort(v.dailyRate)}</span>
              <span className="block text-[0.8rem] text-fg-2">por dia</span>
            </p>
          )}
        </div>

        {feature && (
          <>
            <p className="mt-4 max-w-[34ch] text-[1.15rem] leading-snug">{v.tagline}</p>
            <p className="mt-3 max-w-[46ch] text-fg-2">{v.description}</p>
            <p className="mt-6">
              <span className="font-display text-[2.25rem] font-semibold tabular-nums leading-none">{formatBRLShort(v.dailyRate)}</span>
              <span className="ml-2 text-fg-2">por dia</span>
            </p>
          </>
        )}

        <SpecRow vehicle={v} className={feature ? 'mt-5' : 'mt-3'} />

        {days && (
          <p className="mt-3 text-[0.88rem] text-fg-2">
            {pluralDays(days)} no período escolhido:{' '}
            <span className="font-medium tabular-nums text-fg">{formatBRL(v.dailyRate * days)}</span>
          </p>
        )}

        <div className={`flex flex-wrap items-center gap-2 ${feature ? 'mt-7' : 'mt-4'}`}>
          <Button variant={selected ? 'solid' : 'primary'} size="sm" onClick={() => selectVehicle(v.id, { goToSimulator: true })}>
            {selected ? 'Continuar simulação' : 'Selecionar veículo'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => openDetail(v.id)}>
            Ver detalhes
          </Button>
        </div>
      </div>
    </article>
  )
}

