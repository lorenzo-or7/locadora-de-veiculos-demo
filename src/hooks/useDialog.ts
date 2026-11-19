import { useEffect, type RefObject } from 'react'

let locks = 0

/** Esc para fechar, foco preso no diálogo, restauração de foco e bloqueio de rolagem. */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const node = ref.current

    // bloqueio de rolagem com compensação da barra
    locks++
    const sbw = window.innerWidth - document.documentElement.clientWidth
    if (locks === 1) {
      document.body.style.overflow = 'hidden'
      if (sbw > 0) document.body.style.paddingRight = `${sbw}px`
    }

    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.offsetParent !== null || el === document.activeElement)
        : []

    const t = window.setTimeout(() => {
      const target = node?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0] ?? node
      target?.focus({ preventScroll: true })
    }, 30)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const list = focusables()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      locks = Math.max(0, locks - 1)
      if (locks === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, ref])
}
