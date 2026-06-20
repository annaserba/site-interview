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
  for (const chunk of markdown.split(/^## /m).slice(1)) {
    const newline = chunk.indexOf('\n')
    const title = chunk.slice(0, newline).trim()
    sections.set(title, chunk.slice(newline + 1).trim())
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

function questionFromMarkdown(source, filename) {
  const { metadata, body } = parseFrontmatter(source, filename)
  const sections = parseSections(body)
  const required = ['id', 'title', 'category', 'scope', 'languages', 'roles', 'companies', 'level', 'stage', 'tags', 'duration', 'difficulty']
  for (const field of required) if (metadata[field] === undefined) throw new Error(`${filename}: required field "${field}" is missing`)

  const answer = sections.get('Короткий ответ')
  if (!answer) throw new Error(`${filename}: section "Короткий ответ" is missing`)

  return {
    id: metadata.id,
    title: metadata.title,
    answer,
    context: sections.get('Контекст') || '',
    keyPoints: parseKeyPoints(sections.get('Как строить ответ')),
    pitfalls: parseList(sections.get('Частые ошибки')),
    followUps: parseList(sections.get('Дополнительные вопросы')),
    category: metadata.category,
    scope: metadata.scope,
    languages: metadata.languages,
    roles: metadata.roles,
    companies: metadata.companies,
    level: metadata.level,
    stage: metadata.stage,
    tags: metadata.tags,
    duration: metadata.duration,
    difficulty: metadata.difficulty,
    sources: [{
      company: metadata.sourceCompany || metadata.companies[0],
      url: metadata.sourceUrl || '',
      type: metadata.sourceType || 'candidate-report',
    }],
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
