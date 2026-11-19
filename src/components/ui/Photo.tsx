import { Car } from 'lucide-react'
import { useState } from 'react'
import { photoSrcSet, photoUrl } from '../../lib/image'

interface PhotoProps {
  id: string
  alt: string
  sizes: string
  widths?: number[]
  /** largura/altura do recorte; omitido = proporção original */
  ratio?: number
  focus?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  /** Fundo do esqueleto: em fotos escuras (hero) usa tom fixo. */
  tone?: 'theme' | 'dark'
}

/**
 * Imagem responsiva com esqueleto durante o carregamento e
 * alternativa local caso a fotografia não carregue.
 */
export function Photo({
  id,
  alt,
  sizes,
  widths = [480, 800, 1200, 1600],
  ratio,
  focus = '50% 50%',
  priority = false,
  className = '',
  imgClassName = '',
  tone = 'theme',
}: PhotoProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const largest = widths[widths.length - 1]

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {state !== 'loaded' && (
        <div
          aria-hidden
          className={`absolute inset-0 ${state === 'loading' ? (tone === 'dark' ? 'bg-[#14171b]' : 'skeleton') : 'bg-elevated'}`}
        />
      )}
      {state === 'error' ? (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center text-fg-2">
          <div className="flex flex-col items-center gap-2 text-sm">
            <Car aria-hidden className="size-8 opacity-60" strokeWidth={1.4} />
            <span>Imagem indisponível</span>
          </div>
        </div>
      ) : (
        <img
          src={photoUrl(id, largest, ratio ? Math.round(largest / ratio) : undefined)}
          srcSet={photoSrcSet(id, widths, ratio)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          style={{ objectPosition: focus }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
