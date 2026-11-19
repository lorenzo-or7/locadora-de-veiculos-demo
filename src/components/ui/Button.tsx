import { motion, type HTMLMotionProps } from 'motion/react'
import { forwardRef } from 'react'

type Variant = 'primary' | 'lime' | 'solid' | 'outline' | 'ghost' | 'photo'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:brightness-[1.06] shadow-[0_1px_0_rgb(255_255_255/0.25)_inset]',
  lime: 'bg-lime text-ink hover:brightness-[1.05]',
  solid: 'bg-fg text-bg hover:opacity-90',
  outline: 'border border-line text-fg hover:border-fg/50 hover:bg-fg/[0.04]',
  ghost: 'text-fg hover:bg-fg/[0.06]',
  photo: 'border border-white/30 text-white bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.14] hover:border-white/50',
}

const sizes: Record<Size, string> = {
  sm: 'h-11 px-4 text-[0.9rem] gap-2',
  md: 'h-12 px-5 text-[0.95rem] gap-2.5',
  lg: 'h-14 px-7 text-base gap-3',
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  size?: Size
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-[-0.005em] transition-[background-color,border-color,opacity,filter,color] duration-200 select-none disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${extra}`

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={rest.disabled ? undefined : { scale: 0.965 }}
      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
      className={buttonClass(variant, size, className)}
      {...rest}
    />
  )
})
