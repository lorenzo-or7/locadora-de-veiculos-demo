import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { scrollToId } from '../../lib/scroll'
import { buttonClass } from '../ui/Button'
import { Magnetic } from '../ui/Magnetic'
import { Photo } from '../ui/Photo'

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [1.18, 1])
  const clip = useTransform(scrollYProgress, [0, 0.45], reduce ? ['inset(0% 0% 0% 0% round 2.25rem)', 'inset(0% 0% 0% 0% round 2.25rem)'] : ['inset(8% 6% 0% 6% round 2.25rem)', 'inset(0% 0% 0% 0% round 2.25rem)'])

  return (
    <section aria-labelledby="cta-title" className="px-2.5 pt-28 sm:px-4 sm:pt-40">
      <motion.div ref={ref} style={{ clipPath: clip }} className="on-photo relative isolate h-[42rem] overflow-hidden rounded-[1.75rem] bg-black text-white sm:h-[46rem] sm:rounded-[2.25rem] lg:h-[52rem]">
        <motion.div style={{ scale }} className="absolute inset-0 -z-10">
          <Photo
            id="1787178605268-36282fb87172"
            alt="Cupê preto fosco iluminado em uma garagem minimalista"
            focus="50% 70%"
            sizes="100vw"
            widths={[800, 1400, 2000]}
            tone="dark"
            className="h-full w-full"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.82)_0%,rgb(0_0_0/0.35)_45%,rgb(0_0_0/0.15)_70%,rgb(0_0_0/0.6)_100%)]" />

        <div className="flex h-full flex-col items-start px-5 pt-16 sm:px-10 sm:pt-20 lg:items-center lg:px-14 lg:pt-24 lg:text-center">
          <h2 id="cta-title" className="max-w-[16ch] font-display text-[clamp(2.5rem,7vw,6.25rem)] font-[620] leading-[0.94] tracking-[-0.045em]">
            Seu próximo destino merece começar bem.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1.08rem] text-white/75">
            Escolha o carro, simule o período e envie sua solicitação em poucos minutos.
          </p>
          <div className="mt-9">
            <Magnetic>
              <a
                href="#frota"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('frota')
                }}
                className={buttonClass('lime', 'lg')}
              >
                Encontrar meu veículo
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
