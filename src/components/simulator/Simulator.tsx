import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Info, MessageCircle, Minus, Plus } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'
import { addons } from '../../data/addons'
import { categories, categoryLabel, vehicles } from '../../data/vehicles'
import { usePeriodForm } from '../../hooks/usePeriodForm'
import { locationName, useQuote } from '../../hooks/useQuote'
import { formatLongDate, formatShortDate } from '../../lib/period'
import { addonLine, formatBRL, formatBRLShort, pluralDays } from '../../lib/pricing'
import type { Addon, Period } from '../../lib/types'
import { buildQuoteMessage } from '../../lib/whatsapp'
import { useBooking, type SimStep } from '../../state/booking'
import { demoConditions } from '../../data/content'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { Button } from '../ui/Button'
import { DateField, LocationSelect, TimeSelect } from '../ui/Fields'
import { Photo } from '../ui/Photo'

const QuoteDialog = lazy(() => import('./QuoteDialog'))

const steps = ['Veículo', 'Período', 'Adicionais', 'Resumo'] as const

export function Simulator() {
  const booking = useBooking()
  const { step, setStep, vehicleId, period, setPeriod } = booking
  const { vehicle, check, quote } = useQuote()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { margin: '-30% 0px -30% 0px' })
  const panelRef = useRef<HTMLDivElement>(null)
  const [dir, setDir] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [vehicleError, setVehicleError] = useState(false)

  const form = usePeriodForm(period, (next: Period) => setPeriod(next))

  const canGo = (target: SimStep): boolean => {
    if (target >= 1 && !vehicleId) return false
    if (target >= 2 && !check.valid) return false
    return true
  }

  const goTo = (target: SimStep) => {
    if (target > step) {
      if (!vehicleId) {
        setVehicleError(true)
        if (step !== 0) setStep(0)
        return
      }
      if (target >= 2 && !check.valid) {
        form.setTouched(true)
        if (step !== 1) setStep(1)
        return
      }
    }
    setDir(target > step ? 1 : -1)
    setStep(target)
    // leva o foco ao topo do painel da etapa
    window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true })
      const top = panelRef.current?.getBoundingClientRect().top ?? 0
      if (top < 80 || top > window.innerHeight * 0.6) {
        sectionRef.current?.querySelector('#sim-steps')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }
    }, 30)
  }

  const requestQuote = () => {
    if (!vehicle || !quote) return
    setMessage(
      buildQuoteMessage({
        vehicle: { brand: vehicle.brand, model: vehicle.model, categoryLabel: categoryLabel(vehicle.category) },
        period,
        pickupLocationName: locationName(period.pickupLocation),
        returnLocationName: locationName(period.returnLocation),
        quote,
      }),
    )
  }

  return (
    <section id="reserva" ref={sectionRef} aria-labelledby="sim-title" className="relative scroll-mt-20 pb-28 pt-28 sm:pt-36 lg:pb-12">
      <div className="container-x">
        <header className="grid gap-6 lg:grid-cols-[1fr_26rem] lg:items-end">
          <div>
            <p className="mb-4 text-[0.95rem] text-fg-2">Simulador de locação</p>
            <h2 id="sim-title" className="font-display text-[clamp(2.4rem,6vw,5rem)] font-[620] leading-[0.95] tracking-[-0.045em]">
              Monte sua locação
              <br />
              em quatro etapas.
            </h2>
          </div>
          <p className="max-w-[40ch] text-[1.05rem] text-fg-2 lg:pb-2">
            Escolha o carro, defina o período e os serviços. O total é recalculado a cada ajuste e vira uma solicitação pronta para enviar.
          </p>
        </header>

        {/* Indicador de progresso */}
        <nav id="sim-steps" aria-label="Etapas da simulação" className="mt-12 scroll-mt-28">
          <ol className="grid grid-cols-4 gap-2">
            {steps.map((label, i) => {
              const s = i as SimStep
              const done = i < step
              const current = i === step
              const reachable = s <= step || canGo(s)
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => goTo(s)}
                    aria-current={current ? 'step' : undefined}
                    aria-disabled={!reachable || undefined}
                    className={`group flex w-full flex-col items-start gap-3 pt-0 text-left ${reachable ? '' : 'cursor-not-allowed'}`}
                  >
                    <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-line">
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={false}
                        animate={{ width: done ? '100%' : current ? '45%' : '0%' }}
                        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </span>
                    <span className="flex min-h-11 items-center gap-2.5">
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full border text-[0.78rem] font-semibold tabular-nums transition-colors ${
                          done ? 'border-accent bg-accent text-on-accent' : current ? 'border-fg text-fg' : 'border-line text-fg-2'
                        }`}
                      >
                        {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                      </span>
                      <span className={`hidden text-[0.95rem] sm:inline ${current ? 'font-medium text-fg' : 'text-fg-2 group-hover:text-fg'}`}>{label}</span>
                      <span className="sr-only sm:hidden">{label}</span>
                      {done && <span className="sr-only"> (concluída)</span>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-1 text-[0.9rem] font-medium sm:hidden">
            Etapa {step + 1} de 4: {steps[step]}
          </p>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
          {/* Painel da etapa */}
          <div ref={panelRef} tabIndex={-1} className="min-w-0 outline-none" aria-label={`Etapa ${step + 1}: ${steps[step]}`}>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -20 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && <StepVehicle error={vehicleError && !vehicleId} onPicked={() => setVehicleError(false)} />}
                {step === 1 && (
                  <fieldset>
                    <legend className="font-display text-2xl font-semibold">Quando e onde</legend>
                    <p className="mt-1 text-fg-2">Retiradas e devoluções entre 07:00 e 22:00. A devolução pode ser em outra unidade.</p>
                    <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
                      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
                        <p className="font-medium">Retirada</p>
                        <LocationSelect id="sim-local-ret" label="Local de retirada" value={period.pickupLocation} onChange={(v) => form.update({ pickupLocation: v })} error={form.errors.pickupLocation} />
                        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                          <DateField id="sim-data-ret" label="Data" value={period.pickupDate} min={form.minDate} max={form.maxDate} onChange={(v) => form.update({ pickupDate: v })} error={form.errors.pickupDate} />
                          <TimeSelect id="sim-hora-ret" label="Horário" value={period.pickupTime} onChange={(v) => form.update({ pickupTime: v })} error={form.errors.pickupTime} />
                        </div>
                      </div>
                      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
                        <p className="font-medium">Devolução</p>
                        <LocationSelect id="sim-local-dev" label="Local de devolução" value={period.returnLocation} onChange={(v) => form.update({ returnLocation: v })} error={form.errors.returnLocation} />
                        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                          <DateField id="sim-data-dev" label="Data" value={period.returnDate} min={form.minReturn} max={form.maxReturn} onChange={(v) => form.update({ returnDate: v })} error={form.errors.returnDate} />
                          <TimeSelect id="sim-hora-dev" label="Horário" value={period.returnTime} onChange={(v) => form.update({ returnTime: v })} error={form.errors.returnTime} />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`mt-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-[0.95rem] ${check.errors.range && (form.touched || check.days === null) ? 'bg-danger/10 text-danger' : 'bg-elevated'}`}
                      role="status"
                    >
                      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {check.days ? (
                        <p>
                          <span className="font-medium">{pluralDays(check.days)}</span> — {formatShortDate(period.pickupDate)}, {period.pickupTime} até{' '}
                          {formatShortDate(period.returnDate)}, {period.returnTime}. Cada 24 horas contam uma diária; frações viram uma diária a mais.
                        </p>
                      ) : (
                        <p>{check.errors.range ?? 'Preencha datas e horários válidos para calcular as diárias.'}</p>
                      )}
                    </div>
                  </fieldset>
                )}
                {step === 2 && <StepAddons days={check.days ?? 1} />}
                {step === 3 && <StepSummary onEdit={goTo} onRequest={requestQuote} />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
              <Button variant="ghost" onClick={() => goTo((step - 1) as SimStep)} disabled={step === 0} className="-ml-2">
                <ArrowLeft className="size-4" aria-hidden /> Voltar
              </Button>
              {step < 3 ? (
                <Button onClick={() => goTo((step + 1) as SimStep)}>
                  Continuar<span className="max-xs:sr-only"> para {steps[step + 1].toLowerCase()}</span> <ArrowRight className="size-4" aria-hidden />
                </Button>
              ) : (
                <Button onClick={requestQuote} disabled={!quote} className="max-lg:hidden">
                  <MessageCircle className="size-4" aria-hidden /> Solicitar orçamento no WhatsApp
                </Button>
              )}
            </div>
          </div>

          {/* Resumo lateral */}
          <aside aria-label="Resumo da simulação" className="hidden lg:block">
            <div className="sticky top-28">
              <SummaryCard />
            </div>
          </aside>
        </div>
      </div>

      {/* Barra de resumo móvel */}
      <AnimatePresence>
        {inView && step < 3 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem] text-fg-2">
                {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Nenhum veículo'} · {check.days ? pluralDays(check.days) : 'período inválido'}
              </p>
              <p className="font-display text-lg font-semibold tabular-nums">
                {quote ? <AnimatedNumber value={quote.total} format={formatBRL} /> : '—'}
              </p>
            </div>
            <Button size="sm" variant="solid" onClick={() => goTo(3)}>
              Ver resumo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <Suspense fallback={null}>
            <QuoteDialog message={message} onClose={() => setMessage(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  )
}

function StepVehicle({ error, onPicked }: { error: boolean; onPicked: () => void }) {
  const { vehicleId, selectVehicle } = useBooking()
  return (
    <fieldset aria-describedby={error ? 'sim-veh-err' : undefined}>
      <legend className="font-display text-2xl font-semibold">Escolha o veículo</legend>
      <p className="mt-1 text-fg-2">Você pode trocar a qualquer momento; o total acompanha.</p>
      {error && (
        <p id="sim-veh-err" role="alert" className="mt-3 text-[0.9rem] text-danger">
          Selecione um veículo para continuar.
        </p>
      )}
      <div className="mt-6 space-y-7">
        {categories.map((c) => (
          <div key={c.id}>
            <p className="mb-2.5 text-[0.85rem] font-medium text-fg-2">{c.label}</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {vehicles
                .filter((v) => v.category === c.id)
                .map((v) => {
                  const checked = vehicleId === v.id
                  return (
                    <label
                      key={v.id}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border p-2 pr-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        checked ? 'border-accent bg-accent/[0.07]' : 'border-line bg-surface hover:border-fg/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sim-veiculo"
                        className="sr-only"
                        checked={checked}
                        onChange={() => {
                          selectVehicle(v.id)
                          onPicked()
                        }}
                      />
                      <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Photo id={v.photo.id} alt="" focus={v.photo.focus} sizes="80px" widths={[160, 240]} className="h-full w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {v.brand} {v.model}
                        </span>
                        <span className="block text-[0.85rem] text-fg-2">
                          {formatBRLShort(v.dailyRate)}/dia · {v.passengers} lugares
                        </span>
                      </span>
                      <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${checked ? 'border-accent' : 'border-line'}`} aria-hidden>
                        {checked && <span className="size-2.5 rounded-full bg-accent" />}
                      </span>
                    </label>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

function AddonControl({ addon, qty, onChange }: { addon: Addon; qty: number; onChange: (q: number) => void }) {
  if (addon.max === 1) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={qty > 0}
        aria-label={addon.name}
        onClick={() => onChange(qty > 0 ? 0 : 1)}
        className="grid min-h-11 min-w-14 place-items-center"
      >
        <span className={`relative h-7 w-12 rounded-full transition-colors ${qty > 0 ? 'bg-accent' : 'bg-line'}`}>
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 600, damping: 34 }}
            className={`absolute top-1 size-5 rounded-full shadow ${qty > 0 ? 'right-1 bg-on-accent' : 'left-1 bg-fg'}`}
          />
        </span>
      </button>
    )
  }
  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-0.5" role="group" aria-label={`Quantidade de ${addon.name}`}>
      <button type="button" onClick={() => onChange(qty - 1)} disabled={qty === 0} aria-label={`Remover ${addon.name}`} className="grid size-10 place-items-center rounded-full hover:bg-elevated disabled:opacity-35">
        <Minus className="size-4" />
      </button>
      <output aria-live="polite" className="w-6 text-center font-medium tabular-nums">
        {qty}
      </output>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= addon.max}
        aria-label={`Adicionar ${addon.name}`}
        className="grid size-10 place-items-center rounded-full hover:bg-elevated disabled:opacity-35"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

function StepAddons({ days }: { days: number }) {
  const { addons: selection, setAddonQty } = useBooking()
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold">Serviços adicionais</h3>
      <p className="mt-1 text-fg-2">Opcionais. Valores ilustrativos, calculados para {pluralDays(days)}.</p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        {addons.map((a) => {
          const qty = selection[a.id] ?? 0
          const line = addonLine(a, qty, days)
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 sm:flex-nowrap sm:p-5">
              <div className="min-w-0 flex-1 basis-56">
                <p className="font-medium">{a.name}</p>
                <p className="text-[0.9rem] text-fg-2">{a.description}</p>
                <p className="mt-1 text-[0.85rem] text-fg-2">
                  {formatBRLShort(a.price)} {a.unit === 'dia' ? 'por dia' : 'por locação'}
                  {a.max > 1 ? ` · até ${a.max}` : ''}
                </p>
              </div>
              <p className={`w-24 text-right tabular-nums transition-colors ${qty ? 'text-fg' : 'text-fg-2/60'}`}>{qty ? formatBRL(line.total) : '—'}</p>
              <AddonControl addon={a} qty={qty} onChange={(q) => setAddonQty(a.id, q)} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function StepSummary({ onEdit, onRequest }: { onEdit: (s: SimStep) => void; onRequest: () => void }) {
  const { period } = useBooking()
  const { vehicle, quote } = useQuote()
  if (!vehicle || !quote) {
    return <p className="text-fg-2">Complete as etapas anteriores para ver o resumo.</p>
  }
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold">Resumo da solicitação</h3>
      <p className="mt-1 text-fg-2">Confira os dados. Nada é cobrado aqui: você envia uma solicitação de orçamento.</p>

      <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl max-xs:hidden">
            <Photo id={vehicle.photo.id} alt="" focus={vehicle.photo.focus} sizes="96px" widths={[200]} className="h-full w-full" />
          </span>
          <div className="min-w-0 flex-1">
            <dt className="text-[0.82rem] text-fg-2">Veículo</dt>
            <dd className="font-medium">
              {vehicle.brand} {vehicle.model} <span className="text-fg-2">· {categoryLabel(vehicle.category)}</span>
            </dd>
          </div>
          <EditLink to={0} onEdit={onEdit} />
        </div>
        <div className="flex items-start gap-4 p-4 sm:p-5">
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[0.82rem] text-fg-2">Retirada</dt>
              <dd>
                {formatLongDate(period.pickupDate)} às {period.pickupTime}
                <span className="block text-fg-2">{locationName(period.pickupLocation)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[0.82rem] text-fg-2">Devolução</dt>
              <dd>
                {formatLongDate(period.returnDate)} às {period.returnTime}
                <span className="block text-fg-2">{locationName(period.returnLocation)}</span>
              </dd>
            </div>
          </div>
          <EditLink to={1} onEdit={onEdit} />
        </div>
        <div className="flex items-start gap-4 p-4 sm:p-5">
          <div className="min-w-0 flex-1">
            <dt className="text-[0.82rem] text-fg-2">Adicionais</dt>
            <dd>
              {quote.addons.length
                ? quote.addons.map((l) => `${l.addon.name}${l.addon.max > 1 ? ` (${l.quantity}x)` : ''}`).join(', ')
                : 'Nenhum adicional'}
            </dd>
          </div>
          <EditLink to={2} onEdit={onEdit} />
        </div>
      </dl>

      <div className="mt-6 rounded-2xl border border-line p-4 text-[0.88rem] text-fg-2 sm:p-5">
        <p className="font-medium text-fg">Condições demonstrativas</p>
        <ul className="mt-2 space-y-1.5">
          {demoConditions.map((c) => (
            <li key={c} className="flex gap-2.5">
              <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-fg-2" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 lg:hidden">
        <SummaryCard />
        <Button size="lg" onClick={onRequest} className="mt-4 w-full">
          <MessageCircle className="size-4" aria-hidden /> Solicitar orçamento no WhatsApp
        </Button>
      </div>
    </div>
  )
}

function SummaryCard() {
  const { period } = useBooking()
  const { vehicle, check, quote } = useQuote()
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface">
      {vehicle ? (
        <div className="relative aspect-[16/9]">
          <Photo id={vehicle.photo.id} alt={vehicle.photo.alt} focus={vehicle.photo.focus} sizes="370px" widths={[400, 800]} className="h-full w-full" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 text-white">
            <p className="text-[0.8rem] text-white/75">{categoryLabel(vehicle.category)}</p>
            <p className="font-display text-xl font-semibold">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid aspect-[16/9] place-items-center bg-elevated px-6 text-center text-[0.9rem] text-fg-2">Selecione um veículo para começar.</div>
      )}
      <div className="p-5">
        <p className="text-[0.85rem] text-fg-2">
          {check.days
            ? `${formatShortDate(period.pickupDate)}, ${period.pickupTime} → ${formatShortDate(period.returnDate)}, ${period.returnTime}`
            : 'Período ainda inválido'}
        </p>
        <dl className="mt-4 space-y-2.5 text-[0.92rem]">
          <div className="flex justify-between gap-3">
            <dt className="text-fg-2">{check.days && vehicle ? `${pluralDays(check.days)} × ${formatBRLShort(vehicle.dailyRate)}` : 'Diárias'}</dt>
            <dd className="tabular-nums">{quote ? formatBRL(quote.dailyTotal) : '—'}</dd>
          </div>
          {quote?.addons.map((l) => (
            <div key={l.addon.id} className="flex justify-between gap-3">
              <dt className="text-fg-2">
                {l.addon.name}
                {l.addon.max > 1 ? ` (${l.quantity}x)` : ''}
              </dt>
              <dd className="tabular-nums">{formatBRL(l.total)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <p className="text-[0.85rem] text-fg-2">
            Total estimado
            <span className="block text-[0.75rem]">valor ilustrativo</span>
          </p>
          <p className="font-display text-[1.9rem] font-semibold leading-none tabular-nums">
            {quote ? <AnimatedNumber value={quote.total} format={formatBRL} /> : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}

function EditLink({ to, onEdit }: { to: SimStep; onEdit: (s: SimStep) => void }) {
  return (
    <button
      type="button"
      onClick={() => onEdit(to)}
      className="min-h-11 px-1 text-[0.88rem] text-fg-2 underline decoration-line underline-offset-4 hover:text-fg"
    >
      Alterar
    </button>
  )
}
