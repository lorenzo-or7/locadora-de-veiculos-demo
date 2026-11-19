import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { sections } from '../config/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useDialog } from '../hooks/useDialog'
import type { Theme } from '../hooks/useTheme'
import { scrollToId } from '../lib/scroll'
import { buttonClass } from './ui/Button'
import { Wordmark } from './ui/Wordmark'

const ids = sections.map((s) => s.id)

export function Navbar({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useDialog(panelRef, open, () => setOpen(false))

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 220 : 0)
    history.replaceState(null, '', `#${id}`)
  }

  const onPhoto = !solid && !open
  const tone = onPhoto ? 'text-white' : 'text-fg'

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 sm:px-4 sm:pt-4">
      <nav
        aria-label="Principal"
        className={`on-photo mx-auto flex h-16 max-w-[86rem] items-center gap-3 rounded-full pl-5 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:pl-7 ${
          onPhoto
            ? 'border border-transparent bg-transparent'
            : 'border border-line/80 bg-surface/85 shadow-[0_12px_40px_-24px_rgb(0_0_0/0.5)] backdrop-blur-xl'
        }`}
      >
        <a href="#topo" onClick={go('topo')} className={`flex min-h-11 items-center ${tone}`} aria-label="VÉLOR Mobility Studio, voltar ao início">
          <Wordmark />
          <span className={`ml-3 hidden text-[0.8rem] tracking-wide lg:inline ${onPhoto ? 'text-white/70' : 'text-fg-2'}`}>Mobility Studio</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {sections.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id} className="relative">
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative flex h-11 items-center rounded-full px-4 text-[0.92rem] transition-colors ${
                    onPhoto ? 'text-white/80 hover:text-white' : isActive ? 'text-fg' : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  {s.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-4 bottom-1.5 h-[2px] rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className={`grid size-11 place-items-center rounded-full transition-colors ${onPhoto ? 'text-white hover:bg-white/10' : 'text-fg hover:bg-fg/[0.07]'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {theme === 'dark' ? <Sun className="size-[1.15rem]" /> : <Moon className="size-[1.15rem]" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <a href="#reserva" onClick={go('reserva')} className={buttonClass('primary', 'sm', 'max-sm:hidden')}>
            Reservar veículo
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className={`grid size-11 place-items-center rounded-full md:hidden ${tone} ${onPhoto ? 'hover:bg-white/10' : 'hover:bg-fg/[0.07]'}`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 -z-10 bg-[rgb(var(--scrim)/0.5)] backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              id="menu-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="mx-auto mt-2 max-w-[86rem] origin-top rounded-[1.75rem] border border-line bg-surface p-3 shadow-2xl md:hidden"
            >
              <ul className="flex flex-col">
                {sections.map((s, i) => (
                  <motion.li key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                    <a
                      href={`#${s.id}`}
                      onClick={go(s.id)}
                      aria-current={active === s.id ? 'location' : undefined}
                      className="flex min-h-14 items-center justify-between rounded-2xl px-4 font-display text-xl font-medium hover:bg-elevated"
                    >
                      {s.label}
                      {active === s.id && <span className="size-2 rounded-full bg-accent" aria-hidden />}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a href="#reserva" onClick={go('reserva')} className={buttonClass('primary', 'lg', 'mt-2 w-full')}>
                Reservar veículo
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
