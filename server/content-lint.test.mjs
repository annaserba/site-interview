import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Контентный линт: валидирует markdown-источники вопросов (content/questions/*.md).
// build-content.mjs проверяет наличие полей, здесь — КАНОНИЧЕСКИЕ ЗНАЧЕНИЯ.
// Списки держать в синхронизации с src/filters.ts (topicDefinitions/roleOrder/companyOrder).

const contentDirectory = resolve('content/questions')

// src/filters.ts topicDefinitions.categories + Behavioral (поведенческие вне тем)
const CANONICAL_CATEGORIES = new Set([
  'JavaScript', 'TypeScript', 'React', 'CSS', 'Browser', 'Frontend Architecture',
  'Backend', 'Machine Learning', 'Statistics', 'Data Engineering', 'Product Analytics',
  'System Design', 'Algorithms', 'Delivery', 'Game Development', 'Behavioral',
])

// Каноническая таксономия этапов интервью (бейдж на карточках)
const CANONICAL_STAGES = new Set([
  'Техническое', 'Архитектура', 'HR', 'Управление', 'Live coding', 'Знакомство',
  'Финал', 'Командное интервью', 'Кейс', 'Ситуационное интервью', 'Язык', 'Скрининг', 'Алгоритмы',
])

// src/filters.ts roleOrder
const CANONICAL_ROLES = new Set([
  'Frontend', 'Backend', 'Fullstack', 'Mobile', 'QA', 'DevOps',
  'Data Engineering', 'Data Science', 'Product Analytics', 'Leadership', 'Game Dev',
])

// src/filters.ts companyOrder + агрегированные вопросы без единой компании
const KNOWN_COMPANIES = new Set([
  'Яндекс', 'Ozon', 'Avito', 'Т-Банк', 'VK', 'Wildberries', 'Okko', 'Сбер',
  'Гознак', 'Лига Ставок', 'IT One', 'Usetech', 'Rutube', 'Несколько компаний',
])

const CANONICAL_LEVELS = new Set(['Junior', 'Middle', 'Senior'])
// src/types.ts Question['scope']
const CANONICAL_SCOPES = new Set(['universal', 'multi-language', 'language-specific', 'system-design', 'game-dev'])

const REQUIRED_FIELDS = ['id', 'title', 'category', 'scope', 'languages', 'roles', 'companies', 'level', 'stage', 'tags', 'duration', 'difficulty']

function parseValue(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"') || /^(true|false|null|-?\d+(\.\d+)?)$/.test(trimmed)) {
    return JSON.parse(trimmed)
  }
  return trimmed
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
      if (currentTitle !== null) sections.set(currentTitle, currentLines.join('\n').trim())
      currentTitle = line.slice(3).trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  if (currentTitle !== null) sections.set(currentTitle, currentLines.join('\n').trim())
  return sections
}

function parseQuestion(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { error: `${filename}: frontmatter not found` }
  const metadata = {}
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue
    const separator = line.indexOf(':')
    if (separator < 1) return { error: `${filename}: invalid frontmatter line "${line}"` }
    try {
      metadata[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1))
    } catch {
      return { error: `${filename}: unparseable value in line "${line}"` }
    }
  }
  return { metadata, answer: parseSections(match[2]).get('Короткий ответ') || '' }
}

const normalize = (text) => (typeof text === 'string' ? text.toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/gi, ' ').trim().replace(/\s+/g, ' ') : '')

const filenames = (await readdir(contentDirectory)).filter((name) => name.endsWith('.md')).sort()
const questions = []
const parseErrors = []
for (const filename of filenames) {
  const parsed = parseQuestion(await readFile(resolve(contentDirectory, filename), 'utf8'), filename)
  if (parsed.error) parseErrors.push(parsed.error)
  else questions.push({ filename, ...parsed })
}

const collect = (check) => questions.flatMap((q) => check(q) || [])

test('frontmatter parses for every question file', () => {
  assert.deepEqual(parseErrors, [])
})

test('required fields are present', () => {
  const violations = collect(({ filename, metadata }) =>
    REQUIRED_FIELDS.filter((field) => metadata[field] === undefined).map((field) => `${filename}: missing "${field}"`))
  assert.deepEqual(violations, [])
})

test('id matches filename', () => {
  const violations = collect(({ filename, metadata }) =>
    metadata.id !== filename.replace(/\.md$/, '') ? [`${filename}: id "${metadata.id}"`] : [])
  assert.deepEqual(violations, [])
})

test('category is canonical', () => {
  const violations = collect(({ filename, metadata }) =>
    !CANONICAL_CATEGORIES.has(metadata.category) ? [`${filename}: category "${metadata.category}"`] : [])
  assert.deepEqual(violations, [])
})

test('stage is from canonical taxonomy', () => {
  const violations = collect(({ filename, metadata }) =>
    !CANONICAL_STAGES.has(metadata.stage) ? [`${filename}: stage "${metadata.stage}"`] : [])
  assert.deepEqual(violations, [])
})

test('level is canonical', () => {
  const violations = collect(({ filename, metadata }) =>
    !CANONICAL_LEVELS.has(metadata.level) ? [`${filename}: level "${metadata.level}"`] : [])
  assert.deepEqual(violations, [])
})

test('scope is canonical', () => {
  const violations = collect(({ filename, metadata }) =>
    !CANONICAL_SCOPES.has(metadata.scope) ? [`${filename}: scope "${metadata.scope}"`] : [])
  assert.deepEqual(violations, [])
})

test('duration is a string in "N мин" format', () => {
  const violations = collect(({ filename, metadata }) =>
    typeof metadata.duration !== 'string' || !/^\d+ мин$/.test(metadata.duration)
      ? [`${filename}: duration ${JSON.stringify(metadata.duration)}`] : [])
  assert.deepEqual(violations, [])
})

test('difficulty is an integer 1-5', () => {
  const violations = collect(({ filename, metadata }) =>
    !Number.isInteger(metadata.difficulty) || metadata.difficulty < 1 || metadata.difficulty > 5
      ? [`${filename}: difficulty ${JSON.stringify(metadata.difficulty)}`] : [])
  assert.deepEqual(violations, [])
})

test('roles are non-empty and canonical', () => {
  const violations = collect(({ filename, metadata }) => {
    if (!Array.isArray(metadata.roles) || metadata.roles.length === 0) return [`${filename}: roles is empty`]
    return metadata.roles.filter((role) => !CANONICAL_ROLES.has(role)).map((role) => `${filename}: role "${role}"`)
  })
  assert.deepEqual(violations, [])
})

test('companies are known (empty allowed for video-sourced questions)', () => {
  const violations = collect(({ filename, metadata }) => {
    if (!Array.isArray(metadata.companies)) return [`${filename}: companies is not an array`]
    return metadata.companies.filter((company) => !KNOWN_COMPANIES.has(company)).map((company) => `${filename}: company "${company}"`)
  })
  assert.deepEqual(violations, [])
})

test('languages and tags are string arrays, tags non-empty', () => {
  const violations = collect(({ filename, metadata }) => {
    const issues = []
    if (!Array.isArray(metadata.languages) || metadata.languages.some((lang) => typeof lang !== 'string')) issues.push(`${filename}: languages must be a string array`)
    if (!Array.isArray(metadata.tags) || metadata.tags.length === 0 || metadata.tags.some((tag) => typeof tag !== 'string')) issues.push(`${filename}: tags must be a non-empty string array`)
    return issues
  })
  assert.deepEqual(violations, [])
})

test('title is a meaningful string', () => {
  const violations = collect(({ filename, metadata }) =>
    typeof metadata.title !== 'string' || metadata.title.trim().length < 10 ? [`${filename}: title ${JSON.stringify(metadata.title)}`] : [])
  assert.deepEqual(violations, [])
})

test('"Короткий ответ" section is present and non-empty', () => {
  const violations = collect(({ filename, answer }) => (!answer ? [`${filename}: empty "Короткий ответ"`] : []))
  assert.deepEqual(violations, [])
})

test('no duplicate ids, titles or alias collisions', () => {
  const ids = new Map()
  const titles = new Map()
  const aliases = new Map()
  const violations = []
  for (const { filename, metadata } of questions) {
    if (ids.has(metadata.id)) violations.push(`${filename}: duplicate id "${metadata.id}" (also in ${ids.get(metadata.id)})`)
    ids.set(metadata.id, filename)
    const title = normalize(metadata.title)
    if (titles.has(title)) violations.push(`${filename}: title duplicates ${titles.get(title)}`)
    titles.set(title, filename)
    for (const alias of metadata.aliases || []) {
      const key = normalize(alias)
      if (!key) continue
      if (titles.has(key) && titles.get(key) !== filename) violations.push(`${filename}: alias "${alias}" is the title of ${titles.get(key)}`)
      if (aliases.has(key) && aliases.get(key) !== filename) violations.push(`${filename}: alias "${alias}" also used in ${aliases.get(key)}`)
      aliases.set(key, filename)
    }
  }
  assert.deepEqual(violations, [])
})
