import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const questionsPath = resolve(root, 'public/data/questions.json')
const indexPath = resolve(root, 'public/data/questions-index.json')

export const VECTOR_SIZE = 512

const synonymGroups = [
  ['go', 'golang'],
  ['конкурентность', 'параллелизм', 'concurrency', 'многопоточность'],
  ['очередь', 'queue', 'задачи', 'воркеры'],
  ['самопрезентация', 'знакомство', 'себе', 'опыт'],
  ['кеш', 'кэш', 'cache', 'кешировать', 'кэшировать', 'кеширование', 'кэширование'],
  ['архитектура', 'проектирование', 'design', 'system'],
  ['данные', 'etl', 'pipeline', 'пайплайн'],
  ['ограничение', 'лимит', 'rate', 'limiter'],
  ['переобучение', 'переобучением', 'overfitting', 'generalization'],
]

const synonymMap = new Map(synonymGroups.flatMap((group) => group.map((word) => [word, group])))
const stopWords = new Set(['что', 'как', 'когда', 'где', 'зачем', 'почему', 'какой', 'какая', 'какие', 'такое', 'нужен', 'нужна', 'нужно', 'можно', 'между'])

function stem(token) {
  if (/^[а-я]+$/u.test(token) && token.length > 5) {
    return token.replace(/(иями|ями|ами|ого|ему|ому|ыми|ими|иях|ах|ях|ов|ев|ей|ий|ый|ой|ая|яя|ое|ее|ые|ие|ам|ям|ом|ем|ами|ями|у|ю|а|я|ы|и|е)$/u, '')
  }
  if (/^[a-z]+$/u.test(token) && token.length > 5) return token.replace(/(ing|ed|es|s)$/u, '')
  return token
}

export const tokenize = (text = '') => {
  const raw = (text.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').match(/[a-zа-я0-9+#.]+/giu) || []).filter((token) => !stopWords.has(token))
  return [...new Set(raw.flatMap((token) => {
    const normalized = stem(token)
    const synonyms = synonymMap.get(token) || synonymMap.get(normalized) || []
    return [normalized, ...synonyms.map(stem)]
  }))]
}

function features(text) {
  const tokens = tokenize(text)
  const bigrams = tokens.slice(0, -1).map((token, index) => `${token}_${tokens[index + 1]}`)
  const compact = tokens.join('_')
  const trigrams = Array.from({ length: Math.max(0, compact.length - 2) }, (_, index) => compact.slice(index, index + 3))
  return [...tokens, ...bigrams, ...trigrams]
}

export function localEmbedding(text) {
  const vector = new Array(VECTOR_SIZE).fill(0)
  for (const feature of features(text)) {
    const digest = createHash('sha256').update(feature).digest()
    const index = digest.readUInt16BE(0) % VECTOR_SIZE
    vector[index] += digest[2] % 2 === 0 ? 1 : -1
  }

  return normalize(vector)
}

function normalize(vector) {
  const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map((value) => value / length)
}

export function questionText(question) {
  return [
    question.title,
    ...(question.aliases || []),
    question.answer,
    question.context,
    question.codeSnippet || '',
    question.category,
    question.stage,
    ...question.tags,
    ...question.languages,
    ...question.roles,
    ...question.companies,
    ...(question.keyPoints || []).flatMap((point) => [point.title, point.text]),
    ...(question.pitfalls || []),
    ...(question.followUps || []),
  ].join(' ')
}

export async function loadQuestions() {
  return JSON.parse(await readFile(questionsPath, 'utf8'))
}

export async function loadIndex() {
  try {
    return JSON.parse(await readFile(indexPath, 'utf8'))
  } catch {
    const questions = await loadQuestions()
    return {
      provider: 'local-hash',
      model: 'hybrid-token-trigram-512',
      dimensions: VECTOR_SIZE,
      generatedAt: null,
      documents: questions.map((question) => ({ id: question.id, embedding: localEmbedding(questionText(question)) })),
    }
  }
}

function cosineSimilarity(left, right) {
  if (!left || !right || left.length !== right.length) return 0
  return left.reduce((sum, value, index) => sum + value * right[index], 0)
}

function lexicalScore(query, question) {
  const queryTokens = new Set(tokenize(query))
  if (!queryTokens.size) return 0
  const titleTokens = new Set(tokenize(`${question.title} ${(question.aliases || []).join(' ')} ${question.category} ${question.tags.join(' ')}`))
  const documentTokens = new Set(tokenize(questionText(question)))
  const overlap = (tokens) => [...queryTokens].filter((token) => tokens.has(token)).length / queryTokens.size
  const normalize = (value) => value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replace(/[^a-zа-я0-9+#.]+/giu, ' ').trim()
  const exactTitleBonus = [question.title, ...(question.aliases || [])].some((title) => normalize(query) === normalize(title)) ? 0.35 : 0
  return overlap(titleTokens) * 0.65 + overlap(documentTokens) * 0.35 + exactTitleBonus
}

function metadataBoost(query, question) {
  const normalized = query.toLocaleLowerCase('ru-RU')
  const values = [...question.companies, ...question.languages, ...question.roles, question.level]
  return values.some((value) => value && normalized.includes(value.toLocaleLowerCase('ru-RU'))) ? 0.12 : 0
}

function matchesFilters(question, filters = {}) {
  const companyMatch = !filters.company || filters.company === 'Все компании' || question.companies.includes(filters.company)
  const languageMatch = !filters.language || question.languages.length === 0 || question.languages.includes(filters.language)
  const roleMatch = !filters.role || question.roles.includes(filters.role)
  return companyMatch && languageMatch && roleMatch
}

export async function retrieve(query, filters = {}, limit = 4) {
  const [questions, index] = await Promise.all([loadQuestions(), loadIndex()])
  const queryVector = localEmbedding(query)

  const embeddings = new Map(index.documents.map((document) => [document.id, document.embedding]))
  return questions
    .filter((question) => matchesFilters(question, filters))
    .map((question) => {
      const lexical = lexicalScore(query, question)
      const vector = Math.max(0, cosineSimilarity(queryVector, embeddings.get(question.id)))
      return { ...question, score: vector * 0.35 + lexical * 0.65 + metadataBoost(query, question) }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((question) => ({ ...question, retrieval: index.provider }))
}

function selectRelevantSources(sources) {
  if (!sources.length) return []
  const threshold = Math.max(0.1, sources[0].score * 0.38)
  return sources.filter((source) => source.score >= threshold).slice(0, 3)
}

function buildAnswer(sources) {
  if (!sources.length) return 'В базе пока нет материала, который уверенно отвечает на этот вопрос.'
  const primary = sources[0]
  const sections = [`Короткий ответ\n${primary.answer}`]

  if (primary.keyPoints?.length) {
    sections.push(`Как раскрыть ответ на интервью\n${primary.keyPoints.map((point, index) => `${index + 1}. ${point.title}: ${point.text}`).join('\n')}`)
  }
  if (primary.pitfalls?.length) {
    sections.push(`Чего избегать\n${primary.pitfalls.slice(0, 3).map((item) => `— ${item}`).join('\n')}`)
  }
  if (sources.length > 1) {
    sections.push(`Связанные вопросы\n${sources.slice(1).map((source) => `— ${source.title}`).join('\n')}`)
  }
  return sections.join('\n\n')
}

export async function answerQuestion(query, filters = {}) {
  const sources = await retrieve(query, filters)
  const relevantSources = selectRelevantSources(sources)
  return { answer: buildAnswer(relevantSources), mode: 'local', sources: relevantSources }
}
