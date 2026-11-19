import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { locations, timeSlots } from '../../config/site'

interface BaseProps {
  id: string
  label: string
  error?: string
  className?: string
  hint?: ReactNode
}

export function FieldShell({ id, label, error, className = '', hint, children }: BaseProps & { children: ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.8rem] font-medium text-fg-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="flex items-start gap-1.5 text-[0.8rem] leading-snug text-danger" role="alert">
          <CircleAlert aria-hidden className="mt-[1px] size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.8rem] text-fg-2">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: ReactNode) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined)

export function LocationSelect(props: BaseProps & { value: string; onChange: (v: string) => void }) {
  const { id, value, onChange, error, hint } = props
  return (
    <FieldShell {...props}>
      <select
        id={id}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required
      >
        <option value="" disabled>
          Selecione
        </option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function DateField(props: BaseProps & { value: string; min?: string; max?: string; onChange: (v: string) => void }) {
  const { id, value, onChange, error, min, max, hint } = props
  return (
    <FieldShell {...props}>
      <input
        id={id}
        type="date"
        className="field"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required
      />
    </FieldShell>
  )
}

export function TimeSelect(props: BaseProps & { value: string; onChange: (v: string) => void }) {
  const { id, value, onChange, error, hint } = props
  return (
    <FieldShell {...props}>
      <select
        id={id}
        className="field tabular-nums"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required
      >
        {timeSlots.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
