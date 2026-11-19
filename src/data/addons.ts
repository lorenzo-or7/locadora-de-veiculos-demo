import type { Addon } from '../lib/types'

/** Serviços adicionais demonstrativos. Valores ilustrativos. */
export const addons: Addon[] = [
  {
    id: 'protecao',
    name: 'Proteção adicional',
    description: 'Cobertura complementar demonstrativa para danos ao veículo.',
    price: 39,
    unit: 'dia',
    max: 1,
  },
  {
    id: 'condutor',
    name: 'Condutor extra',
    description: 'Inclui mais uma pessoa habilitada para dirigir.',
    price: 25,
    unit: 'dia',
    max: 2,
  },
  {
    id: 'cadeirinha',
    name: 'Cadeirinha infantil',
    description: 'Assento homologado, instalado na retirada.',
    price: 18,
    unit: 'dia',
    max: 3,
  },
  {
    id: 'gps',
    name: 'GPS',
    description: 'Aparelho de navegação com mapas atualizados.',
    price: 45,
    unit: 'locacao',
    max: 1,
  },
]
