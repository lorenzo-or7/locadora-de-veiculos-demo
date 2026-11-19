import { formatLongDate } from './period'
import { formatBRL, pluralDays, type Quote } from './pricing'
import type { Period, Vehicle } from './types'

/** Mantém somente dígitos. Retorna `null` se o resultado não parecer um número internacional válido. */
export function sanitizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  return digits
}

/** Remove caracteres de controle e limita o tamanho de textos livres. */
export function cleanText(value: string, max = 120): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

export interface MessageInput {
  vehicle: Pick<Vehicle, 'brand' | 'model'> & { categoryLabel: string }
  period: Period
  pickupLocationName: string
  returnLocationName: string
  quote: Quote
}

/** Monta a mensagem estruturada da solicitação de orçamento. */
export function buildQuoteMessage({ vehicle, period, pickupLocationName, returnLocationName, quote }: MessageInput): string {
  const lines: string[] = [
    'Olá! Gostaria de solicitar um orçamento de locação.',
    '',
    `*Veículo:* ${cleanText(`${vehicle.brand} ${vehicle.model}`)} (${cleanText(vehicle.categoryLabel)})`,
    `*Retirada:* ${formatLongDate(period.pickupDate)} às ${period.pickupTime} — ${cleanText(pickupLocationName)}`,
    `*Devolução:* ${formatLongDate(period.returnDate)} às ${period.returnTime} — ${cleanText(returnLocationName)}`,
    `*Período:* ${pluralDays(quote.days)} × ${formatBRL(quote.dailyRate)} = ${formatBRL(quote.dailyTotal)}`,
  ]
  if (quote.addons.length) {
    lines.push('*Adicionais:*')
    for (const l of quote.addons) {
      const qty = l.addon.max > 1 ? ` (${l.quantity}x)` : ''
      lines.push(`• ${cleanText(l.addon.name)}${qty}: ${formatBRL(l.total)}`)
    }
  } else {
    lines.push('*Adicionais:* nenhum')
  }
  lines.push(`*Total estimado:* ${formatBRL(quote.total)}`)
  lines.push('')
  lines.push('Valores estimados no simulador, sujeitos à confirmação de disponibilidade e condições.')
  return lines.join('\n')
}

/** Gera o link wa.me com número sanitizado e texto codificado. `null` se o número for inválido. */
export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string | null {
  const n = sanitizePhone(phone)
  if (!n) return null
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}
