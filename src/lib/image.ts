const BASE = 'https://images.unsplash.com/photo-'

/** URL otimizada (AVIF/WebP automático via `auto=format`). */
export function photoUrl(id: string, width: number, height?: number, quality = 70): string {
  const h = height ? `&h=${height}` : ''
  return `${BASE}${id}?auto=format&fit=crop&w=${width}${h}&q=${quality}`
}

export function photoSrcSet(id: string, widths: number[], ratio?: number): string {
  return widths.map((w) => `${photoUrl(id, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`).join(', ')
}
