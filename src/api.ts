const API_BASE = '/api'

export interface ApiQuestion {
  id: string
  title: string
  category: string | null
  stage: string | null
  difficulty: number
  answer: string | null
  context: string | null
  companies: string[]
  roles: string[]
  tags: string[]
  languages: string[]
  level: string
  duration: string
  key_points: Array<{ title: string; text: string }>
  pitfalls: string[]
  follow_ups: string[]
  example_answer: string | null
  code_snippet: string | null
  code_language: string | null
  sources: Array<{ company: string; url: string; type: string; publishedAt?: string }>
  source_type: string
  aliases?: string[]
  scope?: 'universal' | 'multi-language' | 'language-specific'
  video_frequency?: number
  published_at?: string | null
}

export interface FiltersResponse {
  companies: string[]
  types: string[]
  roles: string[]
}

export interface QuestionsResponse {
  questions: ApiQuestion[]
  total: number
}

export interface StatsResponse {
  total: number
  byCategory: Array<{ category: string; count: string }>
  byCompany: Array<{ company: string; count: string }>
}

function getSessionId(): string {
  let id = localStorage.getItem('interview_session_id')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('interview_session_id', id)
  }
  return id
}

export async function fetchQuestions(params?: {
  company?: string
  type?: string
  role?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<QuestionsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.company && params.company !== 'all') searchParams.set('company', params.company)
  if (params?.type && params.type !== 'all') searchParams.set('type', params.type)
  if (params?.role && params.role !== 'all') searchParams.set('role', params.role)
  if (params?.search) searchParams.set('search', params.search)
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))

  const res = await fetch(`${API_BASE}/questions?${searchParams}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchQuestion(id: string): Promise<ApiQuestion> {
  const res = await fetch(`${API_BASE}/questions/${id}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchFilters(): Promise<FiltersResponse> {
  const res = await fetch(`${API_BASE}/filters`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/stats`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchFavorites(): Promise<ApiQuestion[]> {
  const res = await fetch(`${API_BASE}/favorites?session_id=${getSessionId()}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.favorites
}

export async function addFavorite(questionId: string): Promise<void> {
  await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: getSessionId(), question_id: questionId }),
  })
}

export async function removeFavorite(questionId: string): Promise<void> {
  await fetch(`${API_BASE}/favorites`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: getSessionId(), question_id: questionId }),
  })
}

export async function trackView(questionId: string): Promise<void> {
  await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id: questionId }),
  })
}

// Auth
export interface User {
  id: number
  displayName: string
  avatarUrl: string | null
  email: string
  phoneHash: string
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}

export function loginWithYandex() {
  window.location.href = `${API_BASE}/auth/yandex`
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  window.location.reload()
}

// User Answers
export interface UserAnswer {
  id: number
  user_id: number
  question_id: string
  answer: string
  context: string | null
  created_at: string
  updated_at: string
}

export async function fetchUserAnswers(questionId: string): Promise<UserAnswer[]> {
  const res = await fetch(`${API_BASE}/user-answers?question_id=${encodeURIComponent(questionId)}`, {
    credentials: 'include',
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.answers || []
}

export async function saveUserAnswer(questionId: string, answer: string, context?: string): Promise<number | null> {
  const res = await fetch(`${API_BASE}/user-answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ question_id: questionId, answer, context }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.id || null
}

export async function deleteUserAnswer(answerId: number): Promise<void> {
  await fetch(`${API_BASE}/user-answers/${answerId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
}

export interface UserAnswerWithQuestion extends UserAnswer {
  title: string
  category: string
  companies: string[]
  tags: string[]
}

export async function fetchAllUserAnswers(): Promise<UserAnswerWithQuestion[]> {
  const res = await fetch(`${API_BASE}/user-answers/all`, {
    credentials: 'include',
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.items || []
}
