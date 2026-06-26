import type { Question } from './types'

export type QuestionIndex = {
  documents: Array<{ id: string; embedding: number[] }>
}

const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_PREFIX = 'in-depth:data:v6:'

type CacheEntry<T> = {
  expiresAt: number
  value: T
}

function readCache<T>(url: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${url}`)
    return raw ? JSON.parse(raw) as CacheEntry<T> : null
  } catch {
    return null
  }
}

function writeCache<T>(url: string, value: T) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${url}`, JSON.stringify({
      expiresAt: Date.now() + CACHE_TTL_MS,
      value,
    } satisfies CacheEntry<T>))
  } catch {
    // HTTP-кэш браузера продолжит работать, даже если localStorage недоступен.
  }
}

async function fetchJsonCached<T>(fileName: string, signal?: AbortSignal): Promise<T> {
  const url = `/data/${fileName}`
  const cached = readCache<T>(url)

  if (cached && cached.expiresAt > Date.now()) return cached.value

  try {
    const response = await fetch(url, { cache: 'default', signal })
    if (!response.ok) throw new Error(`Не удалось загрузить ${fileName}: ${response.status}`)
    const value = await response.json() as T
    writeCache(url, value)
    return value
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    if (cached) return cached.value
    throw error
  }
}

export const fetchQuestions = (signal?: AbortSignal) => fetchJsonCached<Question[]>('questions.json', signal)

export const fetchQuestionIndex = (signal?: AbortSignal) => fetchJsonCached<QuestionIndex>('questions-index.json', signal)
