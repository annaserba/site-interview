import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const questions = JSON.parse(readFileSync(join(__dirname, '../src/data/questions.json'), 'utf8'))

const stats = {
  totalQuestions: questions.length,
  companyCount: [...new Set(questions.flatMap(q => q.companies || []))].length,
  universalCount: questions.filter(q => q.scope === 'universal').length,
  topicCounts: questions.reduce((acc, q) => {
    const cat = q.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {}),
}

writeFileSync(join(__dirname, '../public/stats.json'), JSON.stringify(stats))
console.log(`✓ Generated stats.json: ${stats.totalQuestions} questions, ${stats.companyCount} companies`)
