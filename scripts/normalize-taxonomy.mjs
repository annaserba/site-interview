// Одноразовая миграция таксономии: нормализует category и roles в content/questions/*.md
// Запуск: node scripts/normalize-taxonomy.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const contentDirectory = resolve('content/questions')

// Целевой набор категорий:
// Algorithms, Backend, Behavioral, Browser, CSS, Data Engineering, Delivery,
// Frontend Architecture, Game Development, JavaScript, Machine Learning,
// Product Analytics, React, Statistics, System Design, TypeScript
const CATEGORY_MAP = {
  'Browser Performance': 'Browser',
  'Web Platform': 'Browser',
  'Frontend': 'Frontend Architecture',
  'Python': 'Backend',
  'C++': 'Backend',
  'Concurrency': 'Backend',
  'Experimentation': 'Statistics',
  'Data Quality': 'Data Engineering',
  'Data Analytics': 'Product Analytics',
  'BI': 'Product Analytics',
  'Web Architecture': 'System Design',
  'HR': 'Behavioral',
  'Soft Skills': 'Delivery',
  'Performance': 'Algorithms',
}

// Точечные исключения по id вопроса
const CATEGORY_OVERRIDES = {
  'data-pandas-loc-iloc': 'Data Engineering', // loc vs iloc в Pandas — это про данные, не про бэкенд
  'ue-gc-uobject': 'Game Development', // GC в Unreal — Game Dev, не бэкенд
}

const ROLE_MAP = {
  'C++': 'Backend',
  'SRE': 'DevOps',
}

let changedFiles = 0

for (const filename of await readdir(contentDirectory)) {
  if (!filename.endsWith('.md')) continue
  const filePath = resolve(contentDirectory, filename)
  const source = await readFile(filePath, 'utf8')
  const id = filename.replace(/\.md$/, '')
  let updated = source
  let changed = false

  const categoryMatch = updated.match(/^category:\s*(.+)$/m)
  if (categoryMatch) {
    const current = categoryMatch[1].trim()
    const next = CATEGORY_OVERRIDES[id] ?? CATEGORY_MAP[current]
    if (next && next !== current) {
      updated = updated.replace(/^category:.*$/m, `category: ${next}`)
      changed = true
    }
  }

  const rolesMatch = updated.match(/^roles:\s*(\[.*\])$/m)
  if (rolesMatch) {
    const current = JSON.parse(rolesMatch[1])
    let next = current.map((role) => ROLE_MAP[role] ?? role)
    // Game Dev-вопросы не дублируем бэкенд-ролью
    if (next.includes('Game Dev')) next = next.filter((role) => role !== 'Backend' || !current.includes('C++'))
    next = [...new Set(next)]
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      updated = updated.replace(/^roles:.*$/m, `roles: ${JSON.stringify(next)}`)
      changed = true
    }
  }

  if (changed) {
    await writeFile(filePath, updated)
    changedFiles++
    console.log(`обновлён: ${filename}`)
  }
}

console.log(`\nГотово: изменено ${changedFiles} файлов`)
