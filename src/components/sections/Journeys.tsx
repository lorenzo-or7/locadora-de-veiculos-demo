import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { journeys } from '../../data/content'
import { photoSrcSet, photoUrl } from '../../lib/image'
import { scrollToId } from '../../lib/scroll'
import { useBooking } from '../../state/booking'
import { buttonClass } from '../ui/Button'

export function Journeys() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const { setFilters } = useBooking()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const j = journeys[index]

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % journeys.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + journeys.length) % journeys.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = journeys.length - 1
    else return
    e.preventDefault()
    setIndex(next)
    tabsRef.current[next]?.focus()
  }

  const explore = () => {
    setFilters({ category: j.category })
    scrollToId('frota')
  }

  return (
    <section aria-labelledby="jornadas-title" className="pt-28 sm:pt-40">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <p className="mb-4 text-[0.95rem] text-fg-2">Para cada ocasião</p>
            <h2 id="jornadas-title" className="font-display text-[clamp(2.4rem,6vw,5rem)] font-[620] leading-[0.95] tracking-[-0.045em]">
              Built for Every
              <br />
              Journey
            </h2>
          </div>
          <p className="max-w-[38ch] text-[1.05rem] text-fg-2 lg:pb-2">Cada viagem pede um carro diferente. Escolha um cenário e veja a categoria que costuma combinar.</p>
        </div>
      </div>

      <div className="mt-10 px-2.5 sm:mt-14 sm:px-4">
        <div className="on-photo relative isolate overflow-hidden rounded-[1.75rem] bg-black text-white sm:rounded-[2.25rem]">
          <div className="relative h-[34rem] sm:h-[40rem] lg:h-[46rem]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={j.id}
                src={photoUrl(j.photo.id, 1600)}
                srcSet={photoSrcSet(j.photo.id, [800, 1600, 2200])}
                sizes="100vw"
                alt={j.photo.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: j.photo.focus }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.78)_0%,rgb(0_0_0/0.35)_45%,transparent_75%),linear-gradient(0deg,rgb(0_0_0/0.6),transparent_45%)]" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 lg:p-14">
              <div id="jornadas-painel" role="tabpanel" aria-labelledby={`tab-${j.id}`} className="max-w-[34rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={j.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-[0.95rem] text-lime">{j.kicker}</p>
                    <h3 className="mt-2 font-display text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1] tracking-[-0.035em]">{j.title}</h3>
                    <p className="mt-4 max-w-[44ch] text-[1.05rem] text-white/80">{j.text}</p>
                    <button type="button" onClick={explore} className={buttonClass('lime', 'md', 'mt-7')}>
                      {j.cta} <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Cenários de uso" className="no-scrollbar grid grid-cols-2 border-t border-white/15 sm:grid-cols-4">
            {journeys.map((x, i) => {
              const selected = i === index
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabsRef.current[i] = el
                  }}
                  id={`tab-${x.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="jornadas-painel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setIndex(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`relative min-h-16 border-white/15 px-5 py-4 text-left text-[0.95rem] transition-colors odd:border-r sm:border-r sm:last:border-r-0 sm:px-8 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 ${
                    selected ? 'text-white' : 'text-white/55 hover:text-white/85'
                  }`}
                >
                  {selected && (
                    <motion.span layoutId="journey-indicator" className="absolute inset-x-0 top-0 h-[2px] bg-lime" transition={{ type: 'spring', stiffness: 400, damping: 36 }} />
                  )}
                  {x.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
