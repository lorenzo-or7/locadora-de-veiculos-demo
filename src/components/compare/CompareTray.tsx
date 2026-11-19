import { AnimatePresence, motion } from 'motion/react'
import { GitCompareArrows, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getVehicle } from '../../data/vehicles'
import { MAX_COMPARE } from '../../lib/fleet'
import { useBooking } from '../../state/booking'
import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'

/** Bandeja flutuante com os veículos marcados para comparação. */
export function CompareTray({ hidden }: { hidden: boolean }) {
  const { compare, toggleCompare, setCompareOpen, clearCompare, detailId, compareOpen } = useBooking()
  const items = compare.map(getVehicle).filter((v) => !!v)
  // não cobre a busca rápida da hero
  const [pastHero, setPastHero] = useState(false)
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const show = items.length > 0 && pastHero && !hidden && !detailId && !compareOpen

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          aria-label="Comparação de veículos"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[calc(100%-1.25rem)] max-w-[34rem] items-center gap-2 rounded-full border border-line bg-surface/95 p-1.5 pl-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] backdrop-blur-xl sm:bottom-5"
        >
          <ul className="flex items-center -space-x-2">
            {items.map((v) => (
              <li key={v.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleCompare(v.id)}
                  className="group relative block size-11 overflow-hidden rounded-full border-2 border-surface"
                  aria-label={`Remover ${v.brand} ${v.model} da comparação`}
                >
                  <Photo id={v.photo.id} alt="" focus={v.photo.focus} sizes="44px" widths={[120]} className="h-full w-full" />
                  <span className="absolute inset-0 grid place-items-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <X className="size-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="min-w-0 flex-1 truncate pl-1 text-[0.88rem] text-fg-2">
            <span className="font-medium text-fg">{items.length}</span> de {MAX_COMPARE}
            <span className="hidden xs:inline"> selecionados</span>
          </p>
          <button type="button" onClick={clearCompare} className="hidden min-h-11 rounded-full px-3 text-[0.85rem] text-fg-2 hover:text-fg sm:block">
            Limpar
          </button>
          <Button size="sm" onClick={() => setCompareOpen(true)} disabled={items.length < 2} aria-describedby={items.length < 2 ? 'cmp-hint' : undefined}>
            <GitCompareArrows className="size-4" aria-hidden />
            Comparar
          </Button>
          {items.length < 2 && (
            <span id="cmp-hint" className="sr-only">
              Selecione ao menos dois veículos para comparar.
            </span>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
