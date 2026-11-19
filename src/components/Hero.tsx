import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { getVehicle } from '../data/vehicles'
import { photoSrcSet, photoUrl } from '../lib/image'
import { formatBRLShort } from '../lib/pricing'
import { scrollToId } from '../lib/scroll'
import { useBooking } from '../state/booking'
import { buttonClass } from './ui/Button'
import { Magnetic } from './ui/Magnetic'
import { QuickSearch } from './QuickSearch'

const HERO_ID = 'solenne-noir'
const EASE = [0.16, 1, 0.3, 1] as const

const lines = ['A liberdade começa', 'no próximo destino.']

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { openDetail } = useBooking()
  const car = getVehicle(HERO_ID)!

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const carY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])
  const carScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.05])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section id="topo" ref={ref} aria-labelledby="hero-title" className="relative px-2.5 pt-2.5 sm:px-4 sm:pt-4">
      <div className="on-photo relative isolate h-[calc(100svh-1.25rem)] min-h-[40rem] overflow-hidden rounded-[1.75rem] bg-black text-white sm:h-[calc(100svh-2rem)] sm:min-h-[42rem] sm:rounded-[2.25rem] lg:max-h-[60rem]">
        {/* Veículo protagonista */}
        <motion.div
          style={{ y: carY, scale: carScale }}
          className="absolute inset-x-0 bottom-0 top-[40%] -z-10 origin-bottom will-change-transform sm:top-[34%] lg:left-[26%] lg:top-[24%]"
        >
          <motion.img
            src={photoUrl(car.photo.id, 1600)}
            srcSet={photoSrcSet(car.photo.id, [800, 1600, 2400])}
            sizes="(min-width: 1024px) 80vw, 170vw"
            alt={car.photo.alt}
            fetchPriority="high"
            decoding="async"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: '18%' }}
            animate={{ opacity: 1, x: '0%' }}
            transition={{ duration: reduce ? 0.4 : 1.8, ease: EASE, delay: 0.1 }}
            className="absolute bottom-[2%] left-[-38%] h-auto w-[175%] max-w-none sm:bottom-[-2%] sm:left-[-12%] sm:w-[125%] lg:bottom-[-12%] lg:left-auto lg:right-[-8%] lg:w-[108%]"
          />
          {/* luz rasante que acompanha a entrada */}
          {!reduce && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, x: '-30%' }}
              animate={{ opacity: [0, 0.6, 0], x: '70%' }}
              transition={{ duration: 2.4, ease: 'easeInOut', delay: 1 }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.07)_50%,transparent_70%)]"
            />
          )}
        </motion.div>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.5)_0%,transparent_30%,transparent_72%,rgb(0_0_0/0.6)_100%)]" />

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative flex h-full flex-col px-5 pb-28 pt-28 sm:px-10 sm:pt-32 lg:px-14 lg:pb-28 lg:pt-[max(8rem,17svh)]"
        >
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.5rem,min(10vw,11svh),7rem)] font-[620] leading-[0.95] tracking-[-0.045em] lg:text-[clamp(3rem,min(7.4vw,12.5svh),7.5rem)]"
          >
            {lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.07em]">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: '108%' }}
                  animate={reduce ? { opacity: 1 } : { y: '0%' }}
                  transition={{ duration: 1.05, ease: EASE, delay: 0.5 + i * 0.12 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-6 flex items-end justify-between gap-8 lg:mt-auto">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
              className="max-w-[23rem]"
            >
              <p className="text-[1.02rem] leading-relaxed text-white/75 sm:text-[1.08rem]">
                Encontre o carro ideal para cada jornada. Escolha, personalize e planeje sua locação com facilidade.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Magnetic>
                  <a href="#frota" onClick={go('frota')} className={buttonClass('lime', 'md')}>
                    Explorar veículos
                  </a>
                </Magnetic>
                <a href="#como-funciona" onClick={go('como-funciona')} className={buttonClass('photo', 'md')}>
                  Como funciona
                </a>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => openDetail(car.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="group absolute right-14 top-[max(8.5rem,18svh)] hidden min-h-11 items-center gap-4 rounded-full py-1 pl-1 pr-2 text-left text-sm text-white/80 transition-colors hover:text-white xl:flex"
            >
              <span className="grid size-11 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block font-medium text-white">
                  {car.brand} {car.model}
                </span>
                <span className="block text-white/65">Premium, a partir de {formatBRLShort(car.dailyRate)}/dia</span>
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* indicador de rolagem */}
        <motion.a
          href="#frota"
          onClick={go('frota')}
          aria-label="Rolar até a frota"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 p-2 text-[0.75rem] text-white/60 hover:text-white sm:flex lg:right-7"
        >
          <span className="[writing-mode:vertical-rl]">Rolar</span>
          <span className="relative block h-14 w-[1.5px] overflow-hidden rounded-full bg-white/20" aria-hidden>
            <span className="absolute inset-x-0 top-0 h-1/2 bg-lime motion-safe:animate-[scroll-cue_2.2s_ease-in-out_infinite]" />
          </span>
        </motion.a>
      </div>

      <QuickSearch />
    </section>
  )
}
