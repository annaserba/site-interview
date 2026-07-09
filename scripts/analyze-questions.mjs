import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'content/questions'
const files = readdirSync(dir).filter(f => f.endsWith('.md'))

const stats = {
  total: 0,
  missingExample: [],
  missingContext: [],
  missingHowTo: [],
  missingPitfalls: [],
  missingFollowUps: [],
  hasInterviewerExpects: [],
  shortIsInstructions: [],
  shortIsTooLong: [],
  exampleIsTemplate: [],
  emptySections: [],
}

const metaPatterns = [
  'Интервьюер проверяет', 'Интервьюер ожидает', 'Ожидается знание',
  'Ожидается понимание', 'Проверяют способность', 'Проверяют умение',
  'Проверяет понимание', 'HR проверяет', 'оценивает способность',
  'проверяет знание', 'Типичный вопрос на', 'Один из частых',
  'Классический вопрос', 'Популярный вопрос', 'Цель вопроса',
  'Вопрос проверяет', 'Этот вопрос', 'Спрашивают чтобы',
  'Интервьюер хочет', 'Здесь проверяют',
]

const instructionPatterns = [
  'Назовите', 'Покажите', 'Объясните', 'Опишите', 'Расскажите',
  'Приведите пример', 'Избегайте', 'Не говорите', 'Говорите о',
  'Свяжите', 'Изучите', 'Подготовьте', 'Упомяните',
  'Сформулируйте', 'Перечислите', 'Сравните',
]

for (const f of files) {
  const content = readFileSync(join(dir, f), 'utf8')
  const id = f.replace('.md', '')
  stats.total++

  const getSection = (name) => {
    const m = content.match(new RegExp(`## ${name}\\n\\n([\\s\\S]*?)(?=\\n## |\\n---|$)`))
    return m ? m[1].trim() : ''
  }

  const short = getSection('Короткий ответ')
  const example = getSection('Пример ответа')
  const context = getSection('Контекст')
  const howTo = getSection('Как строить ответ')
  const pitfalls = getSection('Частые ошибки')
  const followUps = getSection('Дополнительные вопросы')
  const expects = getSection('Что ожидают в ответе')

  // Check for missing sections
  if (!example) stats.missingExample.push(id)
  if (!context) stats.missingContext.push(id)
  if (!howTo) stats.missingHowTo.push(id)
  if (!pitfalls) stats.missingPitfalls.push(id)
  if (!followUps) stats.missingFollowUps.push(id)
  if (expects) stats.hasInterviewerExpects.push(id)

  // Check if short answer is really instructions for the interviewee
  const hasMeta = metaPatterns.some(p => short.includes(p))
  if (hasMeta && short.length < 400) stats.shortIsInstructions.push(id)

  // Check if short answer is too long
  if (short.length > 500) stats.shortIsTooLong.push(id)

  // Check if example answer has placeholder templates
  if (example.includes('[компания]') || example.includes('[продукт]') || example.includes('[конкретный')) {
    stats.exampleIsTemplate.push(id)
  }

  // Check for empty or suspiciously short sections
  if (pitfalls && pitfalls.length < 10 && pitfalls !== '- Нет') stats.emptySections.push(`${id}: pitfalls (${pitfalls.length} chars)`)
  if (followUps && followUps.length < 10) stats.emptySections.push(`${id}: followUps (${followUps.length} chars)`)
}

console.log('=== АНАЛИЗ 389 ВОПРОСОВ ===\n')

console.log('Пропущенные секции:')
console.log('  Пример ответа:', stats.missingExample.length)
console.log('  Контекст:', stats.missingContext.length)
console.log('  Как строить ответ:', stats.missingHowTo.length)
console.log('  Частые ошибки:', stats.missingPitfalls.length)
console.log('  Доп. вопросы:', stats.missingFollowUps.length)

console.log('\nИспользуют новое поле "Что ожидают в ответе":', stats.hasInterviewerExpects.length)
stats.hasInterviewerExpects.forEach(id => console.log(' ', id))

console.log('\nКраткий ответ — инструкция вместо ответа:', stats.shortIsInstructions.length)
stats.shortIsInstructions.forEach(id => console.log(' ', id))

console.log('\nКраткий ответ слишком длинный (>500):', stats.shortIsTooLong.length)
console.log('  (первые 20):')
stats.shortIsTooLong.slice(0, 20).forEach(id => console.log(' ', id))

console.log('\nПример ответа с шаблонными плейсхолдерами:', stats.exampleIsTemplate.length)
stats.exampleIsTemplate.forEach(id => console.log(' ', id))

console.log('\nПодозрительно короткие секции:', stats.emptySections.length)
stats.emptySections.forEach(s => console.log(' ', s))

console.log('\n=== РЕКОМЕНДАЦИИ ===')
if (stats.shortIsInstructions.length > 0) {
  console.log(`\n1. ${stats.shortIsInstructions.length} вопросов — заменить краткий ответ на реальный, а инструкции перенести в "Что ожидают в ответе":`)
  stats.shortIsInstructions.forEach(id => console.log(`   ${id}`))
}

if (stats.missingExample.length > 0) {
  console.log(`\n2. ${stats.missingExample.length} вопросов без примера ответа: добавить или ок?`)
}

if (stats.exampleIsTemplate.length > 0) {
  console.log(`\n3. ${stats.exampleIsTemplate.length} вопросов с шаблонными плейсхолдерами: заменить на живые примеры`)
  stats.exampleIsTemplate.forEach(id => console.log(`   ${id}`))
}

console.log('\n4. Поле "Что ожидают в ответе" используется только в 1 вопросе — можно добавить ещё в проблемные.')
