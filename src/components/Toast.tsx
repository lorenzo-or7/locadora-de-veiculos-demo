import { AnimatePresence, motion } from 'motion/react'
import { useBooking } from '../state/booking'

export function Toast() {
  const { toast } = useBooking()
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 top-24 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="max-w-[28rem] rounded-full border border-line bg-surface px-5 py-3 text-[0.9rem] shadow-[0_18px_50px_-20px_rgb(0_0_0/0.5)]"
          >
            {toast.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
