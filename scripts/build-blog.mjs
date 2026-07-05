import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'http://sobes-it.ru'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  const meta = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      let val = rest.join(':').trim()
      if (val.startsWith('[')) val = JSON.parse(val)
      meta[key.trim()] = val
    }
  }
  return { meta, content: match[2].trim() }
}

const blogDir = join(__dirname, '../content/blog')
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'))
const articles = []

for (const file of files) {
  const raw = readFileSync(join(blogDir, file), 'utf8')
  const parsed = parseFrontmatter(raw)
  if (parsed) articles.push({ ...parsed.meta, content: parsed.content })
}
console.log(`✓ Loaded ${articles.length} articles from content/blog/`)