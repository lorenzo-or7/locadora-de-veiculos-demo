import { priceRanges } from '../../lib/fleet'
import type { FleetFilters } from '../../lib/types'
import { ChoiceGroup } from '../ui/ChoiceGroup'

interface Props {
  filters: FleetFilters
  onChange: (patch: Partial<FleetFilters>) => void
  idPrefix: string
}

export function FilterControls({ filters, onChange, idPrefix }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
      <ChoiceGroup
        name={`${idPrefix}-preco`}
        legend="Diária"
        value={filters.price}
        onChange={(price) => onChange({ price })}
        options={priceRanges.map((r) => ({ value: r.id, label: r.id === 'qualquer' ? 'Qualquer' : r.label }))}
      />
      <ChoiceGroup
        name={`${idPrefix}-cambio`}
        legend="Transmissão"
        value={filters.transmission}
        onChange={(transmission) => onChange({ transmission })}
        options={[
          { value: 'qualquer', label: 'Qualquer' },
          { value: 'automatico', label: 'Automático' },
          { value: 'manual', label: 'Manual' },
        ]}
      />
      <ChoiceGroup
        name={`${idPrefix}-pax`}
        legend="Passageiros"
        value={filters.minPassengers}
        onChange={(minPassengers) => onChange({ minPassengers })}
        options={[
          { value: 0, label: 'Qualquer' },
          { value: 5, label: '5 ou mais' },
          { value: 7, label: '7 lugares' },
        ]}
      />
      <ChoiceGroup
        name={`${idPrefix}-malas`}
        legend="Malas"
        value={filters.minLuggage}
        onChange={(minLuggage) => onChange({ minLuggage })}
        options={[
          { value: 0, label: 'Qualquer' },
          { value: 3, label: '3 ou mais' },
          { value: 4, label: '4 ou mais' },
        ]}
      />
    </div>
  )
}
