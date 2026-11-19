import { motion } from 'motion/react'

interface Option<T extends string | number> {
  value: T
  label: string
  count?: number
}

interface Props<T extends string | number> {
  name: string
  legend: string
  value: T
  options: Option<T>[]
  onChange: (v: T) => void
  variant?: 'chips' | 'tabs'
  hideLegend?: boolean
  className?: string
}

/** Grupo de opções exclusivas com rádios nativos (setas do teclado funcionam). */
export function ChoiceGroup<T extends string | number>({
  name,
  legend,
  value,
  options,
  onChange,
  variant = 'chips',
  hideLegend,
  className = '',
}: Props<T>) {
  return (
    <fieldset className={className}>
      <legend className={hideLegend ? 'sr-only' : 'mb-2.5 text-[0.8rem] font-medium text-fg-2'}>{legend}</legend>
      <div className={variant === 'tabs' ? 'no-scrollbar -mx-1 flex overflow-x-auto px-1' : 'flex flex-wrap gap-2'}>
        {options.map((o) => {
          const checked = o.value === value
          const id = `${name}-${o.value}`
          return (
            <label key={String(o.value)} htmlFor={id} className="relative shrink-0 cursor-pointer">
              <input
                id={id}
                type="radio"
                name={name}
                className="peer sr-only"
                checked={checked}
                onChange={() => onChange(o.value)}
              />
              {variant === 'tabs' ? (
                <span
                  className={`relative flex h-12 items-center gap-2 px-3.5 text-[0.95rem] font-medium transition-colors peer-focus-visible:rounded-md peer-focus-visible:outline-2 peer-focus-visible:outline-accent sm:px-4 ${
                    checked ? 'text-fg' : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  {o.label}
                  {o.count !== undefined && (
                    <span className={`text-[0.75rem] tabular-nums ${checked ? 'text-accent-ink' : 'text-fg-2/80'}`}>{o.count}</span>
                  )}
                  {checked && (
                    <motion.span
                      layoutId={`${name}-indicator`}
                      className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-accent sm:inset-x-4"
                      transition={{ type: 'spring', stiffness: 460, damping: 38 }}
                    />
                  )}
                </span>
              ) : (
                <span
                  className={`flex min-h-11 items-center rounded-full border px-4 text-[0.9rem] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                    checked ? 'border-fg bg-fg text-bg' : 'border-line text-fg hover:border-fg/40'
                  }`}
                >
                  {o.label}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
