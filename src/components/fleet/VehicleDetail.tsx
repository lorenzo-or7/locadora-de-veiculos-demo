import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, CalendarClock, Check, ChevronLeft, ChevronRight, Info, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { demoConditions } from '../../data/content'
import { categoryLabel, getVehicle, interiorByCategory } from '../../data/vehicles'
import { useDialog } from '../../hooks/useDialog'
import { locationName } from '../../hooks/useQuote'
import { formatShortDate, validatePeriod } from '../../lib/period'
import { formatBRL, formatBRLShort, pluralDays } from '../../lib/pricing'
import type { Vehicle } from '../../lib/types'
import { scrollToId } from '../../lib/scroll'
import { useBooking } from '../../state/booking'
import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'
import { specItems } from './Specs'
import { CompareToggle } from './VehicleCard'


interface View {
  key: string
  label: string
  photoId: string
  alt: string
  focus?: string
  zoom?: string
}

function viewsFor(v: Vehicle): View[] {
  const interior = interiorByCategory[v.category]
  return [
    { key: 'ext', label: 'Exterior', photoId: v.photo.id, alt: v.photo.alt, focus: v.photo.focus },
    { key: 'frente', label: 'Aproximação', photoId: v.photo.id, alt: `${v.photo.alt} — aproximação`, focus: '82% 60%', zoom: 'scale-[1.7] origin-[78%_62%]' },
    { key: 'traseira', label: 'Detalhe', photoId: v.photo.id, alt: `${v.photo.alt} — detalhe`, focus: '18% 60%', zoom: 'scale-[1.7] origin-[22%_62%]' },
    { key: 'int', label: 'Interior ilustrativo', photoId: interior.id, alt: interior.alt },
  ]
}

export function VehicleDetail() {
  const { detailId } = useBooking()
  const vehicle = getVehicle(detailId)
  return <AnimatePresence>{vehicle && <DetailPanel key={vehicle.id} vehicle={vehicle} />}</AnimatePresence>
}

function DetailPanel({ vehicle: v }: { vehicle: Vehicle }) {
  const { closeDetail, selectVehicle, period, vehicleId } = useBooking()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const views = viewsFor(v)
  const view = views[index]
  const check = validatePeriod(period)
  const close = useCallback(() => closeDetail(), [closeDetail])
  useDialog(ref, true, close)

  const step = (dir: 1 | -1) => setIndex((i) => (i + dir + views.length) % views.length)
  const titleId = `detalhe-${v.id}`

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.3 }}
    >
      <div className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={close} className="-ml-3">
            <ArrowLeft className="size-4" aria-hidden /> Voltar à frota
          </Button>
          <p className="truncate text-[0.9rem] text-fg-2">
            {categoryLabel(v.category)} · {v.brand} {v.model}
          </p>
          <button type="button" onClick={close} aria-label="Fechar detalhes" className="grid size-11 place-items-center rounded-full hover:bg-elevated">
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="container-x grid gap-10 pb-32 pt-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14 lg:pb-20 lg:pt-10">
        {/* Galeria */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-elevated sm:aspect-[16/10]"
            role="group"
            aria-roledescription="galeria"
            aria-label={`Fotos do ${v.brand} ${v.model}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1)
              if (e.key === 'ArrowLeft') step(-1)
            }}
          >
            <motion.div layoutId={`photo-${v.id}`} className="absolute inset-0" transition={{ type: "spring", stiffness: 220, damping: 30 }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={view.key}
                  className="absolute inset-0 overflow-hidden"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Photo
                    id={view.photoId}
                    alt={view.alt}
                    focus={view.focus}
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    widths={[800, 1200, 1600]}
                    className="h-full w-full"
                    imgClassName={view.zoom ?? ''}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <span className="rounded-full bg-black/60 px-3 py-1.5 text-[0.8rem] text-white backdrop-blur-md" aria-live="polite">
                {view.label} · {index + 1}/{views.length}
              </span>
              <div className="on-photo flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Foto anterior" className="grid size-11 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80">
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Próxima foto" className="grid size-11 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80">
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
            {views.map((vw, i) => (
              <button
                key={vw.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                aria-label={`Mostrar foto: ${vw.label}`}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl ring-offset-2 ring-offset-bg transition-[box-shadow,opacity] ${
                  i === index ? 'opacity-100 ring-2 ring-accent' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Photo id={vw.photoId} alt="" focus={vw.focus} sizes="160px" widths={[240, 400]} className="h-full w-full" imgClassName={vw.zoom ?? ''} />
              </button>
            ))}
          </div>
          {view.key === 'int' && (
            <p className="mt-3 flex items-center gap-2 text-[0.82rem] text-fg-2">
              <Info className="size-3.5" aria-hidden /> Imagem de interior representativa da categoria.
            </p>
          )}
        </div>

        {/* Informações */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <p className="text-fg-2">
            {v.brand} · {categoryLabel(v.category)}
          </p>
          <h2 id={titleId} className="mt-1 font-display text-[clamp(2.4rem,5vw,4rem)] font-[620] leading-[0.98] tracking-[-0.04em]">
            {v.model}
          </h2>
          <p className="mt-4 text-[1.15rem] leading-snug">{v.tagline}</p>
          <p className="mt-3 text-fg-2">{v.description}</p>

          <p className="mt-7 flex items-baseline gap-2">
            <span className="font-display text-[2.5rem] font-semibold leading-none tabular-nums">{formatBRLShort(v.dailyRate)}</span>
            <span className="text-fg-2">por diária, valor ilustrativo</span>
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {specItems(v).map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-surface p-4">
                <dt className="flex items-center gap-2 text-[0.8rem] text-fg-2">
                  <Icon className="size-4" aria-hidden strokeWidth={1.8} /> {label}
                </dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-9 font-display text-lg font-semibold">Recursos</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {v.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-accent-ink" aria-hidden strokeWidth={2.4} />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-9 rounded-2xl border border-line bg-surface p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
              <CalendarClock className="size-5 text-accent-ink" aria-hidden /> Seu período
            </h3>
            {check.days ? (
              <>
                <p className="mt-2 text-fg-2">
                  {formatShortDate(period.pickupDate)}, {period.pickupTime} até {formatShortDate(period.returnDate)}, {period.returnTime} ·{' '}
                  {locationName(period.pickupLocation)}
                </p>
                <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3">
                  <span>
                    {pluralDays(check.days)} × {formatBRLShort(v.dailyRate)}
                  </span>
                  <span className="font-display text-xl font-semibold tabular-nums">{formatBRL(v.dailyRate * check.days)}</span>
                </p>
                <p className="mt-1 text-[0.82rem] text-fg-2">Sem adicionais. Você pode incluí-los no simulador.</p>
              </>
            ) : (
              <p className="mt-2 text-fg-2">Defina datas válidas no simulador para ver o valor estimado.</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-display text-lg font-semibold">Condições demonstrativas</h3>
            <ul className="mt-3 space-y-2 text-[0.92rem] text-fg-2">
              {demoConditions.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-fg-2" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-10 flex items-center gap-2 border-t border-line bg-bg/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:static lg:mt-9 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <Button size="lg" className="flex-1 lg:flex-none" onClick={() => selectVehicle(v.id, { goToSimulator: true })}>
              {vehicleId === v.id ? 'Continuar simulação' : 'Simular locação'}
            </Button>
            <CompareToggle vehicle={v} />
          </div>
          <p className="mt-4 hidden text-[0.85rem] text-fg-2 lg:block">
            Prefere ajustar o período antes?{' '}
            <button
              type="button"
              className="min-h-11 underline decoration-line underline-offset-4 hover:text-fg"
              onClick={() => {
                close()
                window.setTimeout(() => scrollToId('reserva'), 60)
              }}
            >
              Ir para o simulador
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
