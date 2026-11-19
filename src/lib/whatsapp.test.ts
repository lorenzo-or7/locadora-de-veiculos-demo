import { describe, expect, it } from 'vitest'
import { addons } from '../data/addons'
import { buildQuote } from './pricing'
import { buildQuoteMessage, buildWhatsAppUrl, cleanText, sanitizePhone } from './whatsapp'

const period = {
  pickupLocation: 'centro',
  pickupDate: '2026-11-20',
  pickupTime: '10:00',
  returnLocation: 'aeroporto',
  returnDate: '2026-11-23',
  returnTime: '10:00',
}

describe('sanitizePhone', () => {
  it('mantém só dígitos', () => {
    expect(sanitizePhone('+55 (11) 99999-0000')).toBe('5511999990000')
  })
  it('rejeita vazio ou tamanho inválido', () => {
    expect(sanitizePhone('')).toBeNull()
    expect(sanitizePhone('123')).toBeNull()
    expect(sanitizePhone(undefined)).toBeNull()
  })
})

describe('mensagem de orçamento', () => {
  const quote = buildQuote({ dailyRate: 200 }, 3, addons, { protecao: 1, cadeirinha: 2 })
  const msg = buildQuoteMessage({
    vehicle: { brand: 'Norra', model: 'Sena', categoryLabel: 'Sedã' },
    period,
    pickupLocationName: 'Unidade Centro',
    returnLocationName: 'Unidade Aeroporto',
    quote,
  })

  it('inclui modelo, datas, locais, adicionais e total', () => {
    expect(msg).toContain('Norra Sena')
    expect(msg).toContain('20/11/2026 às 10:00')
    expect(msg).toContain('Unidade Aeroporto')
    expect(msg).toContain('Proteção adicional')
    expect(msg).toContain('Cadeirinha infantil (2x)')
    expect(msg).toMatch(/Total estimado:\* R\$\s825,00/)
  })

  it('gera URL codificada somente com número válido', () => {
    expect(buildWhatsAppUrl('', msg)).toBeNull()
    const url = buildWhatsAppUrl('55 11 98888-7777', msg)!
    expect(url.startsWith('https://wa.me/5511988887777?text=')).toBe(true)
    expect(decodeURIComponent(url.split('text=')[1])).toBe(msg)
    expect(url).not.toContain(' ')
  })

  it('limpa caracteres de controle', () => {
    expect(cleanText('a\u0000b\n\nc')).toBe('a b c')
  })
})
