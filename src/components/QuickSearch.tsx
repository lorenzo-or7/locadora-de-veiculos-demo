import { motion, useReducedMotion } from 'motion/react'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { usePeriodForm } from '../hooks/usePeriodForm'
import { pluralDays } from '../lib/pricing'
import type { Period } from '../lib/types'
import { scrollToId } from '../lib/scroll'
import { useBooking } from '../state/booking'
import { Button } from './ui/Button'
import { DateField, LocationSelect, TimeSelect } from './ui/Fields'

export function QuickSearch() {
  const { period, applySearch } = useBooking()
  const reduce = useReducedMotion()
  const [values, setValues] = useState<Period>(period)
  const [synced, setSynced] = useState(period)
  // mantém o painel em sincronia quando o período muda no simulador
  if (synced !== period) {
    setSynced(period)
    setValues(period)
  }
  const form = usePeriodForm(values, setValues)
  const { errors, check } = form

  const submit = (e: FormEvent) => {
    e.preventDefault()
    form.setTouched(true)
    if (!check.valid) {
      const first = (e.currentTarget as HTMLFormElement).querySelector<HTMLElement>('[aria-invalid="true"]')
      window.setTimeout(() => first?.focus(), 0)
      return
    }
    applySearch({ ...values, returnLocation: values.returnLocation || values.pickupLocation })
    scrollToId('frota')
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      aria-label="Busca rápida de veículos"
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.25 }}
      className="relative z-10 mx-auto -mt-20 w-[calc(100%-1.25rem)] max-w-[78rem] rounded-[1.5rem] border border-line bg-surface p-4 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)] sm:-mt-16 sm:w-[calc(100%-4rem)] sm:p-5 lg:rounded-[1.75rem]"
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-[1.35fr_1fr_0.72fr_1fr_0.72fr_auto] lg:items-start">
        <LocationSelect
          id="qs-local"
          label="Local de retirada"
          className="col-span-2 lg:col-span-1"
          value={values.pickupLocation}
          onChange={(v) => form.update({ pickupLocation: v })}
          error={errors.pickupLocation}
        />
        <DateField
          id="qs-data-ret"
          label="Data de retirada"
          value={values.pickupDate}
          min={form.minDate}
          max={form.maxDate}
          onChange={(v) => form.update({ pickupDate: v })}
          error={errors.pickupDate}
        />
        <TimeSelect
          id="qs-hora-ret"
          label="Horário de retirada"
          value={values.pickupTime}
          onChange={(v) => form.update({ pickupTime: v })}
          error={errors.pickupTime}
        />
        <DateField
          id="qs-data-dev"
          label="Data de devolução"
          value={values.returnDate}
          min={form.minReturn}
          max={form.maxReturn}
          onChange={(v) => form.update({ returnDate: v })}
          error={errors.returnDate ?? errors.range}
        />
        <TimeSelect
          id="qs-hora-dev"
          label="Horário de devolução"
          value={values.returnTime}
          onChange={(v) => form.update({ returnTime: v })}
          error={errors.returnTime}
        />
        <div className="col-span-2 flex flex-col gap-1.5 lg:col-span-1">
          <span aria-hidden className="hidden text-[0.8rem] lg:block">&nbsp;</span>
          <Button type="submit" size="md" className="w-full lg:w-auto lg:px-6">
            <Search className="size-4" aria-hidden />
            Encontrar veículos
          </Button>
        </div>
      </div>
      <p className="mt-3 text-[0.8rem] text-fg-2" aria-live="polite">
        {check.days ? `Período de ${pluralDays(check.days)}. ` : ''}Diárias de 24 horas; frações contam como uma diária a mais.
      </p>
    </motion.form>
  )
}
