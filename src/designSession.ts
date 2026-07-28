import type { Question } from './types'

export interface DesignStage {
  id: string
  title: string
  hint: string
  questions: Question[]
}

export interface DesignSession {
  caseQuestion: Question
  stages: DesignStage[]
}

// Кейс дизайн-сессии — вопрос формата «Спроектируйте …»
export function isDesignCase(q: Question): boolean {
  return q.title.toLocaleLowerCase('ru-RU').includes('спроектиру')
}

// Пул для дизайн-сессии: системный дизайн + смежные технические темы
export function designPool(questions: Question[]): Question[] {
  return questions.filter((q) =>
    ['System Design', 'Backend', 'Frontend Architecture', 'Delivery'].includes(q.category) || isDesignCase(q))
}

const STAGE_DEFS = [
  {
    id: 'requirements',
    title: 'Шаг 1. Уточнение требований',
    hint: 'Договоритесь о рамках: функциональные и нефункциональные требования, что в scope, а что нет. Не проектируйте, пока не уточнили задачу.',
    terms: ['требован', 'функциональн', 'уточнен', 'api', 'контракт', 'scope'],
  },
  {
    id: 'scale',
    title: 'Шаг 2. Оценка масштаба',
    hint: 'Прикиньте нагрузку вслух: пользователи, RPS, объёмы данных, рост. Цифры определяют архитектуру — интервьюер ждёт back-of-envelope расчёт.',
    terms: ['нагруз', 'трафик', 'масштаб', 'миллион', 'rps', 'qps', 'производительн', 'пропускн'],
  },
  {
    id: 'high-level',
    title: 'Шаг 3. High-level архитектура',
    hint: 'Крупные блоки и потоки данных между ними: клиент, балансировщик, сервисы, хранилища. Пока без деталей реализации.',
    terms: ['архитектур', 'компонент', 'микросервис', 'балансиров', 'cdn', 'gateway', 'шлюз', 'сервис'],
  },
  {
    id: 'data',
    title: 'Шаг 4. Данные и хранение',
    hint: 'Модель данных, выбор хранилищ, шардирование и репликация, кеш и очереди. Обоснуйте каждый выбор.',
    terms: ['баз', 'данн', 'хранен', 'шардирован', 'репликац', 'кеш', 'индекс', 'sql', 'очеред', 'kafka'],
  },
  {
    id: 'reliability',
    title: 'Шаг 5. Надёжность и компромиссы',
    hint: 'Точки отказа, деградация, мониторинг, trade-offs. Назовите цену каждого решения — это отличает сеньора.',
    terms: ['надёжност', 'отказ', 'circuit', 'cap', 'компромисс', 'trade', 'мониторинг', 'slo', 'деградац', 'идемпотент'],
  },
]

const countMatches = (q: Question, terms: string[]): number => {
  const text = `${q.title} ${(q.tags || []).join(' ')}`.toLocaleLowerCase('ru-RU')
  return terms.reduce((acc, term) => acc + (text.includes(term) ? 1 : 0), 0)
}

export function buildDesignSession(questions: Question[], random: () => number = Math.random): DesignSession | null {
  const pool = designPool(questions)
  const cases = pool.filter(isDesignCase)
  if (cases.length === 0) return null

  const caseQuestion = cases[Math.floor(random() * cases.length)]
  const used = new Set<string>([caseQuestion.id])

  const stages: DesignStage[] = STAGE_DEFS.map((def) => {
    const matched = pool
      .filter((q) => !used.has(q.id) && !isDesignCase(q))
      .map((q) => ({ q, score: countMatches(q, def.terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.q.difficulty - b.q.difficulty)
      .slice(0, 4)
    matched.forEach((entry) => used.add(entry.q.id))
    return { id: def.id, title: def.title, hint: def.hint, questions: matched.map((entry) => entry.q) }
  })

  return { caseQuestion, stages }
}
