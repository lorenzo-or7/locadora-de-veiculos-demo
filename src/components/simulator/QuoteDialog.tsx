import { motion, useReducedMotion } from 'motion/react'
import { Check, Copy, MessageCircle, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { site } from '../../config/site'
import { useDialog } from '../../hooks/useDialog'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { Button, buttonClass } from '../ui/Button'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export default function QuoteDialog({ message, onClose }: { message: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [copy, setCopy] = useState<'idle' | 'ok' | 'fail'>('idle')
  const close = useCallback(() => onClose(), [onClose])
  useDialog(ref, true, close)

  const url = buildWhatsAppUrl(site.whatsappNumber, message)

  const preRef = useRef<HTMLPreElement>(null)

  const doCopy = async () => {
    const ok = await copyText(message)
    setCopy(ok ? 'ok' : 'fail')
    if (!ok && preRef.current) {
      // seleciona o texto para cópia manual
      const range = document.createRange()
      range.selectNodeContents(preRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    window.setTimeout(() => setCopy('idle'), 2600)
  }

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[rgb(var(--scrim)/0.7)] backdrop-blur-sm" onClick={close} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        aria-describedby="quote-desc"
        initial={{ y: reduce ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="relative flex max-h-[92svh] w-full max-w-[38rem] flex-col overflow-hidden rounded-t-[1.75rem] border border-line bg-surface sm:rounded-[1.75rem]"
      >
        <div className="flex items-start gap-3 px-6 pb-2 pt-5">
          <div className="flex-1">
            <h2 id="quote-title" className="font-display text-2xl font-semibold">
              {url ? 'Revise e envie pelo WhatsApp' : 'Sua solicitação está pronta'}
            </h2>
            <p id="quote-desc" className="mt-1 text-[0.92rem] text-fg-2">
              {url
                ? 'A mensagem abaixo será aberta no WhatsApp. Você pode editá-la antes de enviar.'
                : 'Este protótipo não tem um número de WhatsApp configurado. Copie a mensagem para enviá-la pelo canal que preferir.'}
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Fechar" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-elevated">
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-3">
          <pre
            ref={preRef}
            tabIndex={0}
            aria-label="Prévia da mensagem"
            className="whitespace-pre-wrap break-words rounded-2xl border border-line bg-bg p-4 font-sans text-[0.9rem] leading-relaxed"
          >
            {message}
          </pre>
        </div>

        <div className="flex flex-col gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6">
          <Button variant={url ? 'outline' : 'primary'} onClick={doCopy} data-autofocus={!url || undefined}>
            {copy === 'ok' ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copy === 'ok' ? 'Mensagem copiada' : copy === 'fail' ? 'Texto selecionado: use Ctrl+C' : 'Copiar mensagem'}
          </Button>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'md')} data-autofocus>
              <MessageCircle className="size-4" aria-hidden />
              Abrir WhatsApp
            </a>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {copy === 'ok' ? 'Mensagem copiada para a área de transferência.' : copy === 'fail' ? 'Não foi possível copiar. Selecione o texto manualmente.' : ''}
        </p>
        {!url && (
          <p className="px-6 pb-5 text-[0.8rem] text-fg-2">
            Para ativar o envio direto, defina <code className="rounded bg-elevated px-1.5 py-0.5">VITE_WHATSAPP_NUMBER</code> com o número da locadora.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
