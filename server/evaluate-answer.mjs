import { localEmbedding, tokenize } from './rag-core.mjs'

function cosineSimilarity(left, right) {
  if (!left || !right || left.length !== right.length) return 0
  return left.reduce((sum, value, index) => sum + value * right[index], 0)
}

const clamp01 = (value) => Math.min(1, Math.max(0, value))

// Хэш-эмбеддинги дают низкие косинусы даже для хороших ответов — нормализуем
const SEMANTIC_FULL_MARK = 0.45
const POINT_COVERED_THRESHOLD = 0.4

function pointCoverage(answerTokens, answerVector, point) {
  const pointText = `${point.title} ${point.text || ''}`
  const pointTokens = new Set(tokenize(pointText))
  if (!pointTokens.size) return 0
  const lexical = [...pointTokens].filter((token) => answerTokens.has(token)).length / pointTokens.size
  const semantic = Math.max(0, cosineSimilarity(answerVector, localEmbedding(pointText)))
  return Math.max(lexical, clamp01(semantic / SEMANTIC_FULL_MARK))
}

export function evaluateAnswer(question, userAnswer) {
  const answerTokens = new Set(tokenize(userAnswer))
  const tokenCount = answerTokens.size
  if (tokenCount < 3) {
    return {
      score: 0,
      verdict: 'no',
      feedback: 'Ответ слишком короткий, чтобы его оценить. Расскажите подробнее: определение, как работает, trade-offs и пример из практики.',
      coveredPoints: [],
      missedPoints: (question.keyPoints || []).map((point) => point.title),
    }
  }

  const reference = [question.title, question.answer, question.exampleAnswer || '', question.context || ''].join(' ')
  const answerVector = localEmbedding(userAnswer)
  const semantic = Math.max(0, cosineSimilarity(answerVector, localEmbedding(reference)))
  const semanticScore = clamp01(semantic / SEMANTIC_FULL_MARK)

  const points = (question.keyPoints || []).filter((point) => point && point.title)
  const coverage = points.map((point) => ({ title: point.title, value: pointCoverage(answerTokens, answerVector, point) }))
  const coveredPoints = coverage.filter((item) => item.value >= POINT_COVERED_THRESHOLD).map((item) => item.title)
  const missedPoints = coverage.filter((item) => item.value < POINT_COVERED_THRESHOLD).map((item) => item.title)
  const coverageScore = points.length ? coveredPoints.length / points.length : semanticScore

  // Длина: полноценный ответ — от ~30 значимых слов
  const lengthScore = clamp01(tokenCount / 30)

  const raw = 0.35 * semanticScore + 0.45 * coverageScore + 0.2 * lengthScore
  const score = Math.round(raw * 100)
  const verdict = score >= 60 ? 'yes' : score >= 35 ? 'partial' : 'no'

  const lines = []
  if (verdict === 'yes') lines.push('Сильный ответ: ключевые моменты раскрыты, формулировки близки к эталону.')
  else if (verdict === 'partial') lines.push('Ответ в правильном направлении, но часть важных моментов упущена.')
  else lines.push('Ответ пока слабый: мало пересечений с эталонным ответом.')
  if (coveredPoints.length) lines.push(`Хорошо раскрыто: ${coveredPoints.join('; ')}.`)
  if (missedPoints.length) lines.push(`Стоит добавить: ${missedPoints.join('; ')}.`)
  if (lengthScore < 0.4) lines.push('Ответ коротковат — на интервью ждут развёрнутое рассуждение с примерами.')

  return { score, verdict, feedback: lines.join(' '), coveredPoints, missedPoints }
}

// Оценка всей дизайн-сессии: среднее по этапам + покрытие ключевых точек кейса полным транскриптом
export function evaluateDesignSession(caseQuestion, stageEntries) {
  const answered = stageEntries.filter((entry) => entry && typeof entry.answer === 'string' && entry.answer.trim())
  if (!answered.length) {
    return { score: 0, verdict: 'no', feedback: 'Нет ответов для оценки.', stages: [], coveredPoints: [], missedPoints: [] }
  }

  const stageResults = answered.map((entry) => {
    const target = entry.question || caseQuestion
    const result = evaluateAnswer(target, entry.answer.trim())
    return {
      title: entry.title || 'Этап',
      score: result.score,
      verdict: result.verdict,
      feedback: result.feedback,
      missedPoints: result.missedPoints,
    }
  })

  // Полный транскрипт против кейса: покрывает ли кандидат ключевые аспекты задачи в целом
  const transcript = answered.map((entry) => entry.answer.trim()).join('\n')
  const caseResult = evaluateAnswer(caseQuestion, transcript)

  const stageAverage = Math.round(stageResults.reduce((sum, item) => sum + item.score, 0) / stageResults.length)
  const score = Math.round(0.5 * stageAverage + 0.5 * caseResult.score)
  const verdict = score >= 60 ? 'yes' : score >= 35 ? 'partial' : 'no'

  const strong = stageResults.filter((item) => item.verdict === 'yes').map((item) => item.title)
  const weak = stageResults.filter((item) => item.verdict === 'no').map((item) => item.title)

  const lines = []
  if (verdict === 'yes') lines.push('Сильная дизайн-сессия: этапы раскрыты, ключевые аспекты кейса покрыты.')
  else if (verdict === 'partial') lines.push('Сессия в правильном направлении, но часть этапов или аспектов кейса упущена.')
  else lines.push('Сессия пока слабая: рассуждения мало пересекаются с эталонным разбором кейса.')
  if (strong.length) lines.push(`Сильные этапы: ${strong.join('; ')}.`)
  if (weak.length) lines.push(`Слабые этапы: ${weak.join('; ')}.`)
  if (caseResult.missedPoints.length) lines.push(`По кейсу стоит добавить: ${caseResult.missedPoints.join('; ')}.`)

  return {
    score,
    verdict,
    feedback: lines.join(' '),
    stages: stageResults,
    coveredPoints: caseResult.coveredPoints,
    missedPoints: caseResult.missedPoints,
  }
}
