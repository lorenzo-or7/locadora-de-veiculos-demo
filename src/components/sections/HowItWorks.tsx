import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { howSteps } from '../../data/content'
import { Photo } from '../ui/Photo'

function Step({ index, active, onActive }: { index: number; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-48% 0px -48% 0px' })
  const s = howSteps[index]
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <li ref={ref} className="relative pl-14 sm:pl-20 lg:min-h-[62svh] lg:pt-[12svh]">
      <span
        className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full border bg-bg font-display text-[0.95rem] font-semibold tabular-nums transition-colors duration-500 sm:size-12 lg:top-[12svh] ${
          active ? 'border-accent text-accent-ink' : 'border-line text-fg-2'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'lg:opacity-40'}`}>
        <h3 className="font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{s.title}</h3>
        <p className="mt-4 max-w-[42ch] text-[1.08rem] text-fg-2">{s.text}</p>
      </div>
      <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:hidden">
        <Photo id={s.photo.id} alt={s.photo.alt} focus={s.photo.focus} sizes="100vw" widths={[480, 800]} className="h-full w-full" />
      </div>
    </li>
  )
}

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const current = howSteps[active]

  return (
    <section id="como-funciona" aria-labelledby="como-title" className="pt-28 sm:pt-40">
      <div className="container-x">
        <header className="max-w-[56rem]">
          <p className="mb-4 text-[0.95rem] text-fg-2">Como funciona</p>
          <h2 id="como-title" className="font-display text-[clamp(2.4rem,6vw,5rem)] font-[620] leading-[0.95] tracking-[-0.045em]">
            Do primeiro clique à chave na mão.
          </h2>
        </header>

        <div className="mt-14 grid gap-12 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Visual fixo (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50svh-17rem)] aspect-[4/5] max-h-[34rem] w-full overflow-hidden rounded-[2rem] bg-elevated">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, clipPath: 'inset(100% 0 0 0)' }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Photo id={current.photo.id} alt={current.photo.alt} focus={current.photo.focus} sizes="45vw" widths={[600, 900, 1200]} className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-5 left-5 flex gap-1.5" aria-hidden>
                {howSteps.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-lime' : 'w-1.5 bg-white/50'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Trilho de progresso ligado à rolagem */}
            <div aria-hidden className="absolute bottom-0 left-5 top-0 w-px bg-line sm:left-6">
              <motion.div style={{ scaleY: reduce ? 1 : fill }} className="h-full w-full origin-top bg-accent" />
            </div>
            <ol ref={listRef} className="relative space-y-16 lg:space-y-0 lg:pb-[20svh]">
              {howSteps.map((_, i) => (
                <Step key={i} index={i} active={active === i} onActive={setActive} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
