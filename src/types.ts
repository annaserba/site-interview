export type Question = {
  id: string
  title: string
  answer: string
  context?: string
  keyPoints?: Array<{ title: string; text: string }>
  pitfalls?: string[]
  followUps?: string[]
  category: string
  scope: 'universal' | 'multi-language' | 'language-specific'
  languages: string[]
  roles: string[]
  companies: string[]
  level: string
  stage: string
  tags: string[]
  duration: string
  difficulty: number
  fresh?: string
  sources: Array<{ company: string; url: string; type: string }>
  score?: number
  retrieval?: string
}

export type RagResponse = {
  answer: string
  mode: 'local'
  sources: Question[]
}
