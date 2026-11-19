import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { faqs } from '../../data/content'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <section aria-labelledby="faq-title" className="pt-28 sm:pt-40">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mb-4 text-[0.95rem] text-fg-2">Dúvidas frequentes</p>
          <h2 id="faq-title" className="font-display text-[clamp(2.2rem,4.8vw,4rem)] font-[620] leading-[0.98] tracking-[-0.04em]">
            Antes de você perguntar.
          </h2>
          <p className="mt-5 max-w-[36ch] text-fg-2">As respostas são demonstrativas. Em um site real, refletem a política de cada locadora.</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-b border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i
              const id = `faq-${i}`
              return (
                <li key={f.q} className="border-t border-line">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[4.5rem] w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.15rem] font-medium tracking-[-0.01em] transition-colors hover:text-fg sm:text-[1.3rem]"
                    >
                      {f.q}
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                          isOpen ? 'rotate-45 border-accent bg-accent text-on-accent' : 'border-line'
                        }`}
                        aria-hidden
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${id}-panel`}
                        role="region"
                        aria-labelledby={`${id}-btn`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[60ch] pb-6 pr-14 text-fg-2">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
