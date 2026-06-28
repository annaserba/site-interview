import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function seed(pool) {
  const client = await pool.connect()
  try {
    const jsonPath = join(__dirname, '../../src/data/questions.json')
    const questions = JSON.parse(readFileSync(jsonPath, 'utf8'))

    console.log(`Seeding ${questions.length} questions...`)

    for (const q of questions) {
      await client.query(`
        INSERT INTO questions (id, title, category, stage, difficulty, answer, context,
          companies, roles, tags, languages, level, duration,
          key_points, pitfalls, follow_ups, example_answer,
          code_snippet, code_language, sources, source_type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        ON CONFLICT (id) DO UPDATE SET
          title=EXCLUDED.title, category=EXCLUDED.category, stage=EXCLUDED.stage,
          difficulty=EXCLUDED.difficulty, answer=EXCLUDED.answer, context=EXCLUDED.context,
          companies=EXCLUDED.companies, roles=EXCLUDED.roles, tags=EXCLUDED.tags,
          languages=EXCLUDED.languages, level=EXCLUDED.level, duration=EXCLUDED.duration,
          key_points=EXCLUDED.key_points, pitfalls=EXCLUDED.pitfalls,
          follow_ups=EXCLUDED.follow_ups, example_answer=EXCLUDED.example_answer,
          code_snippet=EXCLUDED.code_snippet, code_language=EXCLUDED.code_language,
          sources=EXCLUDED.sources, source_type=EXCLUDED.source_type
      `, [
        q.id,
        q.title,
        q.category || null,
        q.stage || null,
        q.difficulty || 3,
        q.answer || null,
        q.context || null,
        q.companies || [],
        q.roles || [],
        q.tags || [],
        q.languages || [],
        q.level || 'Middle',
        q.duration || '10 мин',
        JSON.stringify(q.keyPoints || []),
        q.pitfalls || [],
        q.followUps || [],
        q.exampleAnswer || null,
        q.codeSnippet || null,
        q.codeLanguage || null,
        JSON.stringify(q.sources || []),
        q.sourceType || 'aggregated',
      ])
    }

    const count = await client.query('SELECT COUNT(*) FROM questions')
    console.log(`✓ Seeded ${count.rows[0].count} questions`)
  } finally {
    client.release()
  }
}

if (process.argv[1]?.endsWith('seed.mjs')) {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  seed(pool).then(() => pool.end()).catch(e => { console.error(e); process.exit(1) })
}
