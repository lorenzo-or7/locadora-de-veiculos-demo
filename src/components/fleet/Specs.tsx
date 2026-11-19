import { Cog, Fuel, Luggage, Users } from 'lucide-react'
import type { Vehicle } from '../../lib/types'

export const transmissionLabel = (t: Vehicle['transmission']) => (t === 'automatico' ? 'Automático' : 'Manual')

export function specItems(v: Vehicle) {
  return [
    { icon: Users, label: 'Passageiros', value: `${v.passengers} lugares` },
    { icon: Luggage, label: 'Bagagens', value: `${v.luggage} ${v.luggage === 1 ? 'mala' : 'malas'}` },
    { icon: Cog, label: 'Transmissão', value: transmissionLabel(v.transmission) },
    { icon: Fuel, label: 'Combustível', value: v.fuel },
  ]
}

/** Linha compacta de especificações com ícones e rótulos acessíveis. */
export function SpecRow({ vehicle, tone = 'theme', className = '' }: { vehicle: Vehicle; tone?: 'theme' | 'light'; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[0.86rem] ${tone === 'light' ? 'text-white/75' : 'text-fg-2'} ${className}`}>
      {specItems(vehicle).map(({ icon: Icon, label, value }) => (
        <li key={label} className="flex items-center gap-1.5">
          <Icon aria-hidden className="size-[0.95rem] shrink-0 opacity-80" strokeWidth={1.8} />
          <span className="sr-only">{label}: </span>
          {value}
        </li>
      ))}
    </ul>
  )
}
