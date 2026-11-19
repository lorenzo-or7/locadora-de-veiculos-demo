import { useCallback, useEffect, useState } from 'react'
import { readString, writeString } from '../lib/storage'

export type Theme = 'dark' | 'light'

const KEY = 'velor:theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0D10' : '#F5F5F1')
  }, [theme])

  // Acompanha o sistema enquanto o usuário não escolher manualmente
  useEffect(() => {
    if (readString(KEY)) return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => !readString(KEY) && setTheme(mq.matches ? 'light' : 'dark')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      writeString(KEY, next)
      return next
    })
  }, [])

  return { theme, toggle }
}
