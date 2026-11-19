import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

/** Número que interpola suavemente entre valores (feedback imediato do total). */
export function AnimatedNumber({ value, format, className = '' }: { value: number; format: (n: number) => string; className?: string }) {
  const reduce = useReducedMotion()
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 })
  const text = useTransform(spring, (n) => format(Math.round(n * 100) / 100))

  useEffect(() => {
    if (reduce) spring.jump(value)
    else spring.set(value)
  }, [value, reduce, spring])

  return (
    <>
      <motion.span aria-hidden className={className}>
        {text}
      </motion.span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}
