import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Headset, Layers, MousePointerClick, Route, Sparkles, Wallet } from 'lucide-react'
import { useRef } from 'react'
import { benefits } from '../../data/content'
import { Photo } from '../ui/Photo'

const icons = [MousePointerClick, Layers, Wallet, Headset, Route, Sparkles]

export function Benefits() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section id="vantagens" aria-labelledby="vantagens-title" className="pt-28 sm:pt-40">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="mb-4 text-[0.95rem] text-fg-2">Vantagens</p>
          <h2 id="vantagens-title" className="font-display text-[clamp(2.2rem,4.8vw,4rem)] font-[620] leading-[0.98] tracking-[-0.04em]">
            Tudo o que importa antes de dar a partida.
          </h2>
          <div ref={ref} className="relative mt-10 aspect-[5/4] overflow-hidden rounded-[1.75rem] sm:aspect-[16/10] lg:aspect-[4/5]">
            <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
              <Photo
                id="1761040100341-6aeeda55d58c"
                alt="Interior com bancos de couro e acabamento em fibra de carbono"
                sizes="(min-width: 1024px) 40vw, 100vw"
                widths={[600, 900, 1200]}
                className="h-full w-full"
              />
            </motion.div>
          </div>
        </div>

        <ul className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:pt-28">
          {benefits.map((b, i) => {
            const Icon = icons[i]
            return (
              <motion.li
                key={b.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
                className="border-t border-line py-7"
              >
                <Icon className="size-6 text-accent-ink" strokeWidth={1.6} aria-hidden />
                <h3 className="mt-5 font-display text-[1.35rem] font-semibold tracking-[-0.02em]">{b.title}</h3>
                <p className="mt-2 max-w-[34ch] text-fg-2">{b.text}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
