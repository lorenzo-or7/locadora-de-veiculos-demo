/** Leitura e escrita seguras no localStorage (modo privado, cota, JSON inválido). */
export function readJSON<T>(key: string, guard: (v: unknown) => v is T): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return guard(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* armazenamento indisponível: segue sem persistir */
  }
}

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* noop */
  }
}

export const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
