import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const contentDirectory = resolve('content/questions')
const outputPath = resolve('public/data/questions.json')

function parseValue(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"') || /^(true|false|null|-?\d+(\.\d+)?)$/.test(trimmed)) {
    return JSON.parse(trimmed)
  }
  return trimmed
}

function parseFrontmatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`${filename}: frontmatter not found`)

  const metadata = {}
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error(`${filename}: invalid frontmatter line "${line}"`)
    metadata[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1))
  }
  return { metadata, body: match[2] }
}

function parseSections(markdown) {
  const sections = new Map()
  const lines = markdown.split('\n')
  let currentTitle = null
  let currentLines = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      currentLines.push(line)
      continue
    }
    if (!inCodeBlock && /^## /.test(line)) {
      if (currentTitle !== null) {
        sections.set(currentTitle, currentLines.join('\n').trim())
      }
      currentTitle = line.slice(3).trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  if (currentTitle !== null) {
    sections.set(currentTitle, currentLines.join('\n').trim())
  }
  return sections
}

function parseKeyPoints(section = '') {
  return section.split(/^### /m).slice(1).map((chunk) => {
    const newline = chunk.indexOf('\n')
    return { title: chunk.slice(0, newline).trim(), text: chunk.slice(newline + 1).trim() }
  }).filter((point) => point.title && point.text)
}

function parseList(section = '') {
  return section.split(/\r?\n/).map((line) => line.match(/^[-*]\s+(.+)$/)?.[1]).filter(Boolean)
}

function parseCode(section = '') {
  const match = section.trim().match(/^```([\w+-]*)\r?\n([\s\S]*?)\r?\n```$/)
  return match ? { language: match[1] || 'text', code: match[2] } : { language: 'text', code: section.trim() }
}

function youtubeVideoId(url = '') {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.split('/').filter(Boolean)[0] || ''
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1] || ''
  } catch {
    return ''
  }
  return ''
}

function questionFromMarkdown(source, filename) {
  const { metadata, body } = parseFrontmatter(source, filename)
  const sections = parseSections(body)
  const required = ['id', 'title', 'category', 'scope', 'languages', 'roles', 'companies', 'level', 'stage', 'tags', 'duration', 'difficulty']
  for (const field of required) if (metadata[field] === undefined) throw new Error(`${filename}: required field "${field}" is missing`)

  const answer = sections.get('Короткий ответ')
  if (!answer) throw new Error(`${filename}: section "Короткий ответ" is missing`)

  const code = parseCode(sections.get('Код из интервью') || '')
  const legacySource = {
    company: metadata.sourceCompany || metadata.companies[0],
    url: metadata.sourceUrl || '',
    type: metadata.sourceType || 'candidate-report',
  }
  const videoSources = Array.isArray(metadata.sourceVideos)
    ? metadata.sourceVideos.map((source) => ({ ...source, type: 'youtube' }))
    : []
  const reportSources = Array.isArray(metadata.sourceReports)
    ? metadata.sourceReports.map((source) => ({ ...source, url: source.url || '', type: 'candidate-report' }))
    : []
  const collectedSources = [...videoSources, ...reportSources, legacySource].filter((source, index, list) => (
    list.findIndex((candidate) => `${candidate.type}:${candidate.url || candidate.company}` === `${source.type}:${source.url || source.company}`) === index
  ))
  const sources = collectedSources.some((source) => source.company && source.company !== 'Несколько компаний')
    ? collectedSources.filter((source) => source.company !== 'Несколько компаний')
    : collectedSources
  const collectedCompanies = [...new Set([
    ...metadata.companies,
    ...videoSources.map((source) => source.company).filter((company) => company && company !== 'Frontend-интервью'),
    ...reportSources.map((source) => source.company).filter(Boolean),
  ])]
  const companies = collectedCompanies.length > 1
    ? collectedCompanies.filter((company) => company !== 'Несколько компаний')
    : collectedCompanies
  const videoFrequency = new Set(sources.filter((source) => source.type === 'youtube').map((source) => youtubeVideoId(source.url)).filter(Boolean)).size
  return {
    id: metadata.id,
    title: metadata.title,
    aliases: metadata.aliases || [],
    answer,
    exampleAnswer: sections.get('Пример ответа') || '',
    context: sections.get('Контекст') || '',
    keyPoints: parseKeyPoints(sections.get('Как строить ответ')),
    pitfalls: parseList(sections.get('Частые ошибки')),
    followUps: parseList(sections.get('Дополнительные вопросы')),
    codeSnippet: code.code || undefined,
    codeLanguage: code.code ? code.language : undefined,
    category: metadata.category,
    scope: metadata.scope,
    languages: metadata.languages,
    roles: metadata.roles,
    companies,
    level: metadata.level,
    stage: metadata.stage,
    tags: metadata.tags,
    duration: metadata.duration,
    difficulty: metadata.difficulty,
    sources,
    videoFrequency,
  }
}

const filenames = (await readdir(contentDirectory)).filter((filename) => filename.endsWith('.md')).sort()
const questions = await Promise.all(filenames.map(async (filename) => questionFromMarkdown(await readFile(resolve(contentDirectory, filename), 'utf8'), filename)))
const ids = new Set()
for (const question of questions) {
  if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`)
  ids.add(question.id)
}

await writeFile(outputPath, `${JSON.stringify(questions, null, 2)}\n`)
console.log(`Built ${questions.length} questions from Markdown`)
