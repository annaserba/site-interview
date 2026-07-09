import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'content/questions'
const files = readdirSync(dir).filter(f => f.endsWith('.md'))

const issues = []

for (const f of files) {
  const content = readFileSync(join(dir, f), 'utf8')
  const id = f.replace('.md', '')

  const get = (name) => {
    const m = content.match(new RegExp('## ' + name + '\\n\\n([\\s\\S]*?)(?=\\n## |\\n---|\$)'))
    return m ? m[1].trim() : ''
  }

  const short = get('Короткий ответ')
  const example = get('Пример ответа')
  const expects = get('Что ожидают в ответе')
  const how = get('Как строить ответ')
  const pitfalls = get('Частые ошибки')

  // Check: short answer too vague (< 60 chars)
  if (short.length < 60) issues.push({ id, issue: 'Короткий ответ < 60 симв' })

  // Check: short answer starts weakly
  if (/^(Это|Данный|Такой|Вопрос|Здесь)\s/.test(short)) issues.push({ id, issue: 'Слабый старт: ' + short.slice(0, 60) })

  // Check: short answer is just rephrased title
  const title = (content.match(/title:\s*(.+)/) || ['',''])[1].replace(/['"]/g, '').toLowerCase()
  const shortLower = short.toLowerCase()
  if (shortLower.includes(title.slice(0, 30)) && short.length < 200) {
    // Could be rephrasing — flag for review
  }

  // Check: behavioral/HR questions missing example
  const cat = (content.match(/category:\s*(.+)/) || ['',''])[1]
  if ((cat === 'HR' || cat === 'Behavioral') && (!example || example.length < 100)) {
    issues.push({ id, issue: 'HR/Behavioral без примера ответа' })
  }

  // Check: has how-to structure but no example
  if (how.length > 200 && (!example || example.length < 50)) {
    issues.push({ id, issue: 'Структура есть, примера нет' })
  }

  // Check: pitfalls too generic
  if (pitfalls.includes('Не подготовиться') || pitfalls.includes('Не знать')) {
    issues.push({ id, issue: 'Слишком общие ошибки' })
  }
}

console.log('Найдено проблем:', issues.length, '\n')
issues.forEach(i => console.log(i.id, '-', i.issue))
