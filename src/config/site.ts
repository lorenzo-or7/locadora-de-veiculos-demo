/**
 * Configuração da marca demonstrativa. Para usar com um cliente real,
 * substitua os valores abaixo e o conteúdo de `src/data`.
 */
export const site = {
  brand: 'VÉLOR',
  descriptor: 'Mobility Studio',
  /**
   * Número de WhatsApp no formato internacional, somente dígitos (ex.: 5511999999999).
   * Configure via variável de ambiente `VITE_WHATSAPP_NUMBER`.
   * Vazio = o fluxo exibe a prévia da mensagem com opção de copiar.
   */
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '',
  contact: {
    email: 'contato@exemplo.com',
    hours: 'Seg. a sáb., 8h às 20h (horário ilustrativo)',
  },
} as const

export interface Location {
  id: string
  name: string
  detail: string
}

/** Unidades fictícias — não correspondem a endereços reais. */
export const locations: Location[] = [
  { id: 'centro', name: 'Unidade Centro', detail: 'Ponto demonstrativo A' },
  { id: 'aeroporto', name: 'Unidade Aeroporto', detail: 'Ponto demonstrativo B' },
  { id: 'zona-sul', name: 'Unidade Zona Sul', detail: 'Ponto demonstrativo C' },
  { id: 'rodoviaria', name: 'Unidade Rodoviária', detail: 'Ponto demonstrativo D' },
]

/** Horários de retirada e devolução disponíveis (intervalos de 30 min). */
export const timeSlots: string[] = (() => {
  const out: string[] = []
  for (let h = 7; h <= 22; h++) {
    out.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 22) out.push(`${String(h).padStart(2, '0')}:30`)
  }
  return out
})()

export const MAX_RENTAL_DAYS = 60

export const sections = [
  { id: 'frota', label: 'Frota' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'vantagens', label: 'Vantagens' },
  { id: 'contato', label: 'Contato' },
] as const
