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

// ─── Оценка кода (алгоритмическая секция) ───

const CODE_SIGNAL_RE = /(function\s|=>|\bconst\s|\blet\s|\bvar\s|\breturn\b|\bdef\s|\bclass\s|\bfor\s*\(|\bwhile\s*\(|public\s+|void\s+|\bfn\s|\bfunc\s)/
const LOOP_RE = /\b(for|while)\b|\.(forEach|map|filter|reduce)\s*\(/g
const BIG_O_RE = /O\s*\(\s*[^)]+\)/i

function analyzeComplexity(code) {
  const patterns = []
  let bigO = null

  const hasHash = /\bnew (Set|Map|WeakMap|WeakSet)\b|\{\s*\}|\.has\(|\.get\(|\.set\(|HashMap|HashSet|dict|defaultdict/.test(code)
  const hasSort = /\.sort\s*\(|sorted\s*\(|Arrays\.sort|sort\s*\(/.test(code)
  const hasBinarySearch = /(mid|middle)/.test(code) && /(left|lo|low|start)[^=]*=(.*?)(right|hi|high|end)/s.test(code) && /\bwhile\b/.test(code)
  const hasTwoPointers = /\b(left|right|slow|fast|first|second)\b/.test(code) && /\bwhile\b/.test(code) && !hasBinarySearch
  const hasRecursion = detectRecursion(code)

  // Вложенность циклов по уровням отступа
  const loopIndents = []
  for (const line of code.split('\n')) {
    LOOP_RE.lastIndex = 0
    if (LOOP_RE.test(line)) loopIndents.push(line.match(/^\s*/)[0].length)
  }
  const nestedLoops = loopIndents.length >= 2 && new Set(loopIndents).size >= 2

  if (hasBinarySearch) { bigO = 'O(log n)'; patterns.push('бинарный поиск') }
  else if (nestedLoops) { bigO = hasHash ? 'O(n²) или лучше' : 'O(n²)'; patterns.push('вложенные циклы') }
  else if (loopIndents.length >= 2 && hasHash) { bigO = 'O(n)'; patterns.push('два прохода с хэш-таблицей') }
  else if (loopIndents.length === 1 && hasHash) { bigO = 'O(n)'; patterns.push('один проход с хэш-таблицей') }
  else if (loopIndents.length >= 1 && hasTwoPointers) { bigO = 'O(n)'; patterns.push('два указателя') }
  else if (loopIndents.length >= 1 && hasSort) { bigO = 'O(n log n)'; patterns.push('сортировка + проход') }
  else if (loopIndents.length >= 1) { bigO = 'O(n)'; patterns.push('один проход') }
  else if (hasRecursion) { bigO = 'зависит от глубины рекурсии'; patterns.push('рекурсия') }
  else if (hasSort) { bigO = 'O(n log n)'; patterns.push('сортировка') }

  if (hasHash && !patterns.some((p) => p.includes('хэш'))) patterns.push('хэш-таблица (Set/Map)')
  if (hasRecursion && !patterns.includes('рекурсия')) patterns.push('рекурсия')

  return { bigO, patterns, nestedLoops, mentioned: BIG_O_RE.test(code) }
}

function detectRecursion(code) {
  const defs = [...code.matchAll(/function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:\(|function)|def\s+(\w+)/g)]
  return defs.some((match) => {
    const name = match[1] || match[2] || match[3]
    if (!name || name.length < 2) return false
    return code.split(name).length - 1 >= 3
  })
}

const EDGE_CASE_SIGNALS = [
  { re: /(length|size|len)\s*(===?|!==?|<=?|>=?)\s*[01]\b/, label: 'проверка пустого/единичного входа' },
  { re: /!\s*\w+\s*\)|===?\s*(null|undefined|None)\b/, label: 'защита от null/undefined' },
  { re: /if\s*\([^{}]{0,80}\)\s*{\s*return|if\s*\([^{}]{0,80}\)\s*return/, label: 'ранний выход (guard clause)' },
  { re: /return\s+(\[\]|\{\}|null|None|-1|0|false)\b/, label: 'возврат значения по умолчанию' },
  { re: /Math\.(min|max)|\bmin\(|\bmax\(/, label: 'обработка граничных значений' },
]

export function evaluateCode(question, code) {
  const trimmed = (code || '').trim()
  if (trimmed.length < 10 || !CODE_SIGNAL_RE.test(trimmed)) {
    return {
      score: 0,
      verdict: 'no',
      feedback: 'Это не похоже на код решения. Напишите функцию целиком: сигнатуру, основную логику и возврат результата.',
      coveredPoints: [],
      missedPoints: (question.keyPoints || []).map((point) => point.title),
      complexity: null,
      complexityMentioned: false,
      codePatterns: [],
      edgeCases: [],
    }
  }

  // Подход: близость к эталонному разбору (идея, структуры данных, ключевые точки)
  const base = evaluateAnswer(question, trimmed)

  const complexity = analyzeComplexity(trimmed)
  const edgeCases = EDGE_CASE_SIGNALS.filter((signal) => signal.re.test(trimmed)).map((signal) => signal.label)

  const approachScore = base.score / 100

  // Сложность: оптимальный паттерн (хэш/указатели/бинарный поиск) > вложенные циклы; плюс за проговаривание Big-O
  let structureScore = 0.5
  if (complexity.bigO === 'O(log n)' || (complexity.bigO === 'O(n)' && complexity.patterns.length)) structureScore = 1
  else if (complexity.bigO === 'O(n log n)') structureScore = 0.75
  else if (complexity.bigO === 'O(n)') structureScore = 0.85
  else if (complexity.nestedLoops) structureScore = 0.3
  const complexityScore = clamp01(structureScore * 0.7 + (complexity.mentioned ? 0.3 : 0))

  const edgeScore = edgeCases.length >= 2 ? 1 : edgeCases.length === 1 ? 0.6 : 0.15

  const raw = 0.45 * approachScore + 0.25 * complexityScore + 0.2 * edgeScore + 0.1 * clamp01(trimmed.length / 400)
  const score = Math.round(raw * 100)
  const verdict = score >= 60 ? 'yes' : score >= 35 ? 'partial' : 'no'

  const lines = []
  if (verdict === 'yes') lines.push('Сильное решение: подход совпадает с эталонным, код структурирован.')
  else if (verdict === 'partial') lines.push('Решение рабочее, но есть над чем поработать.')
  else lines.push('Решение пока слабое: подход заметно расходится с эталонным.')

  if (complexity.bigO) {
    lines.push(`Оценка сложности по структуре кода: ~${complexity.bigO} (${complexity.patterns.join(', ')}).`)
  }
  if (complexity.nestedLoops) {
    lines.push('Вложенные циклы — вероятно, квадратичная сложность. Подумайте о хэш-таблице (Set/Map) или двух указателях для оптимизации до O(n).')
  }
  if (!complexity.mentioned) {
    lines.push('Вы не указали сложность — на интервью всегда проговаривайте Big-O по времени и памяти.')
  }
  if (edgeCases.length) lines.push(`Edge-cases учтены: ${edgeCases.join('; ')}.`)
  else lines.push('Не видно обработки edge-cases: пустой массив, один элемент, null — интервьюер обязательно спросит.')
  if (base.missedPoints.length) lines.push(`По подходу добавить: ${base.missedPoints.join('; ')}.`)

  return {
    score,
    verdict,
    feedback: lines.join(' '),
    coveredPoints: base.coveredPoints,
    missedPoints: base.missedPoints,
    complexity: complexity.bigO,
    complexityMentioned: complexity.mentioned,
    codePatterns: complexity.patterns,
    edgeCases,
  }
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
