/** Wordmark tipográfico VÉLOR: o acento agudo vira um traço de movimento. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <span className="sr-only">VÉLOR</span>
      <span aria-hidden className="font-display text-[1.28rem] font-[650] leading-none tracking-[0.14em]">
        V<span className="relative inline-block">
          E
          <span className="absolute -top-[0.3em] left-[0.1em] h-[0.13em] w-[0.66em] -skew-x-[32deg] rounded-[1px] bg-lime" />
        </span>
        LOR
      </span>
    </span>
  )
}
