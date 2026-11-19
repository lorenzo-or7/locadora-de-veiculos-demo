import { AnimatePresence, LayoutGroup, MotionConfig, useInView } from 'motion/react'
import { lazy, Suspense, useRef } from 'react'
import { CompareTray } from './components/compare/CompareTray'
import { FleetSection } from './components/fleet/FleetSection'
import { VehicleDetail } from './components/fleet/VehicleDetail'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Benefits } from './components/sections/Benefits'
import { Faq } from './components/sections/Faq'
import { FinalCta } from './components/sections/FinalCta'
import { HowItWorks } from './components/sections/HowItWorks'
import { Journeys } from './components/sections/Journeys'
import { Simulator } from './components/simulator/Simulator'
import { Toast } from './components/Toast'
import { useTheme } from './hooks/useTheme'
import { BookingProvider, useBooking } from './state/booking'

const CompareDialog = lazy(() => import('./components/compare/CompareDialog'))

function Shell() {
  const { theme, toggle } = useTheme()
  const { compareOpen } = useBooking()
  const simRef = useRef<HTMLDivElement>(null)
  const simInView = useInView(simRef, { margin: '-20% 0px -20% 0px' })

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-3 font-medium text-on-accent focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <LayoutGroup>
        <main id="conteudo">
          <Hero />
          <FleetSection />
          <HowItWorks />
          <div ref={simRef}>
            <Simulator />
          </div>
          <Journeys />
          <Benefits />
          <Faq />
          <FinalCta />
        </main>
        <VehicleDetail />
      </LayoutGroup>
      <Footer />
      <CompareTray hidden={simInView} />
      <AnimatePresence>
        {compareOpen && (
          <Suspense fallback={null}>
            <CompareDialog />
          </Suspense>
        )}
      </AnimatePresence>
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <Shell />
      </BookingProvider>
    </MotionConfig>
  )
}
