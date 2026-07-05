import pg from 'pg'
import crypto from 'crypto'
import http from 'http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { answerQuestion, retrieve } from './rag-core.mjs'
import { migrate } from './db/migrate.mjs'
import { seed } from './db/seed.mjs'

const PHONE_SALT = process.env.PHONE_SALT || 'site-interview-salt-2024'
function hashPhone(phone) {
  return crypto.createHash('sha256').update(phone + PHONE_SALT).digest('hex')
}

let pool = null
if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
    await migrate(pool)
    await seed(pool)
  } catch (e) {
    console.warn('DB init failed:', e.message)
    pool = null
  }
}

const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET
const YANDEX_REDIRECT_URI = process.env.YANDEX_REDIRECT_URI || 'http://192.144.59.118/api/auth/yandex/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://192.144.59.118'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days
const questionsPath = resolve(process.cwd(), 'public/data/questions.json')
const srcQuestionsPath = resolve(process.cwd(), 'src/data/questions.json')
let localQuestionsCache = null
let dbAvailable = Boolean(pool)

async function ensureDbAvailable() {
  if (!pool) return false
  if (dbAvailable) return true
  try {
    await pool.query('SELECT 1')
    dbAvailable = true
    return true
  } catch {
    return false
  }
}

const base64url = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
const sign = (value) => crypto.createHmac('sha256', PHONE_SALT).update(value).digest('base64url')

function yandexInfoToUser(yandexInfo) {
  const yandexId = String(yandexInfo.id)
  const phone = yandexInfo.default_phone?.number || yandexInfo.phone || ''
  return {
    id: `yandex:${yandexId}`,
    yandex_id: yandexId,
    phone_hash: phone ? hashPhone(phone) : `no_phone_${yandexId}`,
    display_name: yandexInfo.display_name || yandexInfo.real_name || 'User',
    avatar_url: yandexInfo.default_avatar_id
      ? `https://avatars.yandex.net/get-yapic/${yandexInfo.default_avatar_id}/islands-200`
      : null,
    default_email: yandexInfo.default_email || '',
  }
}

function createStatelessSession(yandexInfo) {
  const user = yandexInfoToUser(yandexInfo)
  const payload = base64url({ ...user, exp: Date.now() + SESSION_DURATION })
  return { token: `${payload}.${sign(payload)}`, user }
}

function readStatelessSession(token) {
  const [payload, signature] = token.split('.')
  if (!payload || !signature || sign(payload) !== signature) return null
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!session.exp || session.exp < Date.now()) return null
    return session
  } catch {
    return null
  }
}

function hasDatabaseUser(user) {
  return Number.isInteger(user?.id)
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

function redirect(res, url) {
  res.writeHead(302, { Location: url })
  res.end()
}

function parseCookies(req) {
  const cookies = {}
  const header = req.headers.cookie || ''
  for (const pair of header.split(';')) {
    const [key, ...val] = pair.split('=')
    if (key) cookies[key.trim()] = decodeURIComponent(val.join('='))
  }
  return cookies
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => body += chunk)
    req.on('end', () => { try { resolve(JSON.parse(body)) } catch { resolve({}) } })
  })
}

function cookieOptions(maxAge) {
  const parts = [
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(maxAge)}`,
  ]
  if (process.env.SESSION_COOKIE_SECURE === 'true') parts.push('Secure')
  return parts.join('; ')
}

function parseQuery(url) {
  const idx = url.indexOf('?')
  if (idx === -1) return {}
  const params = new URLSearchParams(url.slice(idx + 1))
  const q = {}
  for (const [k, v] of params) q[k] = v
  return q
}

async function getUserFromRequest(req) {
  const cookies = parseCookies(req)
  const token = cookies['session_token']
  if (!token) return null

  if (await ensureDbAvailable()) {
    try {
      const result = await pool.query(
        `SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id
         WHERE s.token = $1 AND s.expires_at > NOW()`,
        [token]
      )
      if (result.rows[0]) return result.rows[0]
    } catch (error) {
      dbAvailable = false
      console.warn('DB session lookup failed, falling back to stateless auth:', error.message)
    }
  }

  return readStatelessSession(token)
}

async function loadLocalQuestions() {
  if (!localQuestionsCache) {
    try {
      localQuestionsCache = JSON.parse(await readFile(questionsPath, 'utf8'))
    } catch {
      localQuestionsCache = JSON.parse(await readFile(srcQuestionsPath, 'utf8'))
    }
  }
  return localQuestionsCache
}

function toApiQuestion(question) {
  return {
    id: question.id,
    title: question.title,
    aliases: question.aliases || [],
    category: question.category || null,
    stage: question.stage || null,
    difficulty: question.difficulty || 3,
    answer: question.answer || null,
    context: question.context || null,
    companies: question.companies || [],
    roles: question.roles || [],
    tags: question.tags || [],
    languages: question.languages || [],
    level: question.level || 'Middle',
    duration: question.duration || '10 мин',
    key_points: question.keyPoints || question.key_points || [],
    pitfalls: question.pitfalls || [],
    follow_ups: question.followUps || question.follow_ups || [],
    example_answer: question.exampleAnswer || question.example_answer || null,
    code_snippet: question.codeSnippet || question.code_snippet || null,
    code_language: question.codeLanguage || question.code_language || null,
    sources: question.sources || [],
    source_type: question.sourceType || question.source_type || 'aggregated',
    scope: question.scope || 'universal',
    video_frequency: question.videoFrequency || question.video_frequency || 0,
    published_at: question.publishedAt || question.published_at || null,
  }
}

function filterLocalQuestions(questions, params) {
  const search = params.search?.toLocaleLowerCase('ru-RU')
  return questions.filter((question) => {
    if (params.company && params.company !== 'all' && !question.companies?.includes(params.company)) return false
    if (params.type && params.type !== 'all' && question.category !== params.type) return false
    if (params.role && params.role !== 'all' && !question.roles?.includes(params.role)) return false
    if (!search) return true
    return [
      question.title,
      ...(question.aliases || []),
      question.answer,
      ...(question.tags || []),
    ].join(' ').toLocaleLowerCase('ru-RU').includes(search)
  })
}

async function exchangeCodeForToken(code) {
  const res = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: YANDEX_CLIENT_ID,
      client_secret: YANDEX_CLIENT_SECRET,
    }),
  })
  if (!res.ok) throw new Error('Failed to exchange code')
  return res.json()
}

async function fetchYandexUserInfo(accessToken) {
  const res = await fetch('https://login.yandex.ru/info?format=json', {
    headers: { Authorization: `OAuth ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user info')
  return res.json()
}

async function findOrCreateUser(yandexInfo) {
  const userInfo = yandexInfoToUser(yandexInfo)
  const { yandex_id: yandexId, phone_hash: phoneHash, display_name: displayName, avatar_url: avatarUrl, default_email: email } = userInfo

  const existing = await pool.query('SELECT * FROM users WHERE yandex_id = $1', [yandexId])
  if (existing.rows.length > 0) {
    const user = existing.rows[0]
    await pool.query(
      'UPDATE users SET display_name=$1, avatar_url=$2, default_email=$3, last_login_at=NOW() WHERE id=$4',
      [displayName, avatarUrl, email, user.id]
    )
    return user
  }

  const result = await pool.query(
    `INSERT INTO users (yandex_id, phone_hash, display_name, avatar_url, default_email)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [yandexId, phoneHash, displayName, avatarUrl, email]
  )
  return result.rows[0]
}

async function createSession(userId) {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  await pool.query(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
    [token, userId, expiresAt]
  )
  return { token, expiresAt }
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0]

  try {
    if (req.method === 'OPTIONS') return json(res, {}, 204)

    // ─── AUTH ROUTES ───

    // Redirect to Yandex OAuth
    if (url === '/api/auth/yandex' && req.method === 'GET') {
      if (!YANDEX_CLIENT_ID || !YANDEX_CLIENT_SECRET) {
        return redirect(res, `${FRONTEND_URL}#auth-config-required`)
      }
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${encodeURIComponent(YANDEX_CLIENT_ID)}&redirect_uri=${encodeURIComponent(YANDEX_REDIRECT_URI)}`
      return redirect(res, authUrl)
    }

    // Yandex OAuth callback
    if (url === '/api/auth/yandex/callback' && req.method === 'GET') {
      const { code, error } = parseQuery(req.url)
      if (error || !code) {
        return redirect(res, `${FRONTEND_URL}#auth-error`)
      }

      const tokenData = await exchangeCodeForToken(code)
      const yandexInfo = await fetchYandexUserInfo(tokenData.access_token)
      let session
      if (await ensureDbAvailable()) {
        try {
          const user = await findOrCreateUser(yandexInfo)
          session = await createSession(user.id)
        } catch (error) {
          dbAvailable = false
          console.warn('DB auth failed, using stateless session:', error.message)
          session = createStatelessSession(yandexInfo)
        }
      } else {
        session = createStatelessSession(yandexInfo)
      }

      res.writeHead(302, {
        Location: FRONTEND_URL,
        'Set-Cookie': `session_token=${session.token}; ${cookieOptions(SESSION_DURATION / 1000)}`,
      })
      return res.end()
    }

    // Get current user
    if (url === '/api/auth/me' && req.method === 'GET') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { user: null })
      return json(res, {
        user: {
          id: user.id,
          displayName: user.display_name,
          avatarUrl: user.avatar_url,
          email: user.default_email,
          phoneHash: user.phone_hash,
        }
      })
    }

    // Logout
    if (url === '/api/auth/logout' && req.method === 'POST') {
      const cookies = parseCookies(req)
      const token = cookies['session_token']
      if (token && await ensureDbAvailable()) {
        await pool.query('DELETE FROM sessions WHERE token = $1', [token])
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `session_token=; ${cookieOptions(0)}`,
      })
      return res.end(JSON.stringify({ ok: true }))
    }

    // ─── EXISTING ROUTES ───

    if (url === '/api/auth/status' && req.method === 'GET') {
      const databaseAvailable = await ensureDbAvailable()
      return json(res, {
        yandexConfigured: Boolean(YANDEX_CLIENT_ID && YANDEX_CLIENT_SECRET),
        databaseConfigured: Boolean(process.env.DATABASE_URL),
        databaseAvailable,
        authStorage: databaseAvailable ? 'postgresql' : 'signed-cookie',
        redirectUri: YANDEX_REDIRECT_URI,
        frontendUrl: FRONTEND_URL,
      })
    }

    if (url === '/api/rag/health' && req.method === 'GET') {
      return json(res, { ok: true, storage: 'json-cache' })
    }

    if (req.method === 'POST' && ['/api/rag/search', '/api/rag/ask'].includes(url)) {
      const apiKey = req.headers['x-api-key']
      if (apiKey && apiKey !== process.env.RAG_API_KEY) {
        return json(res, { error: 'Invalid API key' }, 403)
      }
      const { query, filters = {} } = await parseBody(req)
      if (typeof query !== 'string' || query.trim().length < 2) return json(res, { error: 'Введите вопрос длиннее одного символа.' }, 400)
      if (query.length > 1_000) return json(res, { error: 'Запрос слишком длинный.' }, 400)
      const result = url.endsWith('/ask')
        ? await answerQuestion(query.trim(), filters)
        : { sources: await retrieve(query.trim(), filters) }
      return json(res, result)
    }

    // Health check
    if (url === '/api/health') {
      if (!await ensureDbAvailable()) return json(res, {
        ok: true,
        storage: 'json-cache',
        database: process.env.DATABASE_URL ? 'unavailable' : 'not-configured',
      })
      try {
        await pool.query('SELECT 1')
        return json(res, { ok: true, storage: 'postgresql' })
      } catch (error) {
        dbAvailable = false
        return json(res, { ok: true, storage: 'json-cache', database: 'unavailable', error: error.message })
      }
    }

    // List questions with filters
    if (url === '/api/questions' && req.method === 'GET') {
      const params = parseQuery(req.url)
      if (!await ensureDbAvailable()) {
        const all = await loadLocalQuestions()
        const filtered = filterLocalQuestions(all, params)
        const offset = Number(params.offset || 0)
        const limit = Number(params.limit || filtered.length)
        return json(res, { questions: filtered.slice(offset, offset + limit).map(toApiQuestion), total: filtered.length, storage: 'json-cache' })
      }
      let sql = 'SELECT * FROM questions WHERE 1=1'
      const args = []
      let i = 1

      if (params.company && params.company !== 'all') {
        sql += ` AND $${i} = ANY(companies)`
        args.push(params.company); i++
      }
      if (params.type && params.type !== 'all') {
        sql += ` AND category = $${i}`
        args.push(params.type); i++
      }
      if (params.role && params.role !== 'all') {
        sql += ` AND $${i} = ANY(roles)`
        args.push(params.role); i++
      }
      if (params.search) {
        sql += ` AND (title ILIKE $${i} OR answer ILIKE $${i} OR $${i} = ANY(tags))`
        args.push(`%${params.search}%`); i++
      }

      sql += ' ORDER BY video_frequency DESC, published_at DESC NULLS LAST, id'
      if (params.limit) { sql += ` LIMIT $${i}`; args.push(parseInt(params.limit)); i++ }
      if (params.offset) { sql += ` OFFSET $${i}`; args.push(parseInt(params.offset)); i++ }

      try {
        const result = await pool.query(sql, args)
        return json(res, { questions: result.rows, total: result.rowCount })
      } catch (error) {
        dbAvailable = false
        const all = await loadLocalQuestions()
        const filtered = filterLocalQuestions(all, params)
        const offset = Number(params.offset || 0)
        const limit = Number(params.limit || filtered.length)
        return json(res, { questions: filtered.slice(offset, offset + limit).map(toApiQuestion), total: filtered.length, storage: 'json-cache' })
      }
    }

    // Get question by ID
    if (url.startsWith('/api/questions/') && req.method === 'GET') {
      const id = url.split('/api/questions/')[1]
      if (!await ensureDbAvailable()) {
        const question = (await loadLocalQuestions()).find((item) => item.id === id)
        if (!question) return json(res, { error: 'Not found' }, 404)
        return json(res, { ...toApiQuestion(question), storage: 'json-cache' })
      }
      try {
        const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id])
        if (result.rows.length === 0) return json(res, { error: 'Not found' }, 404)
        return json(res, result.rows[0])
      } catch {
        dbAvailable = false
        const question = (await loadLocalQuestions()).find((item) => item.id === id)
        if (!question) return json(res, { error: 'Not found' }, 404)
        return json(res, toApiQuestion(question))
      }
    }

    // Get filter options
    if (url === '/api/filters') {
      if (!await ensureDbAvailable()) {
        const questions = await loadLocalQuestions()
        return json(res, {
          companies: [...new Set(questions.flatMap((question) => question.companies || []))].sort((a, b) => a.localeCompare(b, 'ru')),
          types: [...new Set(questions.map((question) => question.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')),
          roles: [...new Set(questions.flatMap((question) => question.roles || []))].sort((a, b) => a.localeCompare(b, 'ru')),
          storage: 'json-cache',
        })
      }
      try {
        const companies = await pool.query('SELECT DISTINCT unnest(companies) as val FROM questions ORDER BY val')
        const types = await pool.query('SELECT DISTINCT category as val FROM questions WHERE category IS NOT NULL ORDER BY val')
        const roles = await pool.query('SELECT DISTINCT unnest(roles) as val FROM questions ORDER BY val')
        return json(res, {
          companies: companies.rows.map(r => r.val),
          types: types.rows.map(r => r.val),
          roles: roles.rows.map(r => r.val),
        })
      } catch {
        dbAvailable = false
        const questions = await loadLocalQuestions()
        return json(res, {
          companies: [...new Set(questions.flatMap((question) => question.companies || []))].sort((a, b) => a.localeCompare(b, 'ru')),
          types: [...new Set(questions.map((question) => question.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')),
          roles: [...new Set(questions.flatMap((question) => question.roles || []))].sort((a, b) => a.localeCompare(b, 'ru')),
          storage: 'json-cache',
        })
      }
    }

    // Favorites (requires auth)
    if (url === '/api/favorites' && req.method === 'GET') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { favorites: [] })
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { favorites: [], storage: 'signed-cookie' })
      const result = await pool.query(
        'SELECT q.* FROM favorites f JOIN questions q ON q.id = f.question_id WHERE f.user_id = $1 ORDER BY f.created_at DESC',
        [user.id]
      )
      return json(res, { favorites: result.rows })
    }

    if (url === '/api/favorites' && req.method === 'POST') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { error: 'Unauthorized' }, 401)
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { error: 'Database storage is not enabled' }, 503)
      const body = await parseBody(req)
      if (!body.question_id) return json(res, { error: 'question_id required' }, 400)
      await pool.query(
        'INSERT INTO favorites (user_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.id, body.question_id]
      )
      return json(res, { ok: true })
    }

    if (url === '/api/favorites' && req.method === 'DELETE') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { error: 'Unauthorized' }, 401)
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { ok: true, storage: 'signed-cookie' })
      const body = await parseBody(req)
      if (!body.question_id) return json(res, { error: 'question_id required' }, 400)
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND question_id = $2',
        [user.id, body.question_id]
      )
      return json(res, { ok: true })
    }

    // View history (requires auth)
    if (url === '/api/history' && req.method === 'POST') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { ok: true })
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { ok: true, storage: 'signed-cookie' })
      const body = await parseBody(req)
      if (!body.question_id) return json(res, { error: 'question_id required' }, 400)
      await pool.query(
        'INSERT INTO view_history (user_id, question_id) VALUES ($1, $2)',
        [user.id, body.question_id]
      )
      return json(res, { ok: true })
    }

    // User answers (requires auth)
    if (url === '/api/user-answers' && req.method === 'GET') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { answers: [] })
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { answers: [], storage: 'signed-cookie' })
      const params = parseQuery(req.url)
      if (params.question_id) {
        const result = await pool.query(
          'SELECT * FROM user_answers WHERE user_id = $1 AND question_id = $2 ORDER BY created_at DESC',
          [user.id, params.question_id]
        )
        return json(res, { answers: result.rows })
      }
      const result = await pool.query(
        'SELECT * FROM user_answers WHERE user_id = $1 ORDER BY updated_at DESC',
        [user.id]
      )
      return json(res, { answers: result.rows })
    }

    if (url === '/api/user-answers' && req.method === 'POST') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { error: 'Unauthorized' }, 401)
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { error: 'Database storage is not enabled' }, 503)
      const body = await parseBody(req)
      if (!body.question_id) return json(res, { error: 'question_id required' }, 400)
      if (typeof body.answer !== 'string' || body.answer.trim().length === 0) {
        return json(res, { error: 'answer required' }, 400)
      }
      const answer = body.answer.trim()
      const context = body.context?.trim() || null
      const result = await pool.query(
        `INSERT INTO user_answers (user_id, question_id, answer, context)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [user.id, body.question_id, answer, context]
      )
      return json(res, { ok: true, id: result.rows[0].id })
    }

    if (url.startsWith('/api/user-answers/') && req.method === 'DELETE') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { error: 'Unauthorized' }, 401)
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { ok: true, storage: 'signed-cookie' })
      const id = url.split('/api/user-answers/')[1]
      await pool.query(
        'DELETE FROM user_answers WHERE id = $1 AND user_id = $2',
        [id, user.id]
      )
      return json(res, { ok: true })
    }

    // All user answers with question data (requires auth)
    if (url === '/api/user-answers/all' && req.method === 'GET') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { items: [] })
      if (!pool || !dbAvailable || !hasDatabaseUser(user)) return json(res, { items: [], storage: 'signed-cookie' })
      const result = await pool.query(
        `SELECT ua.*, q.title, q.category, q.companies, q.tags
         FROM user_answers ua
         JOIN questions q ON q.id = ua.question_id
         WHERE ua.user_id = $1
         ORDER BY ua.updated_at DESC`,
        [user.id]
      )
      return json(res, { items: result.rows })
    }

    // Stats
    if (url === '/api/stats') {
      if (!await ensureDbAvailable()) {
        const questions = await loadLocalQuestions()
        const countBy = (values) => Object.entries(values.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1
          return acc
        }, {})).map(([key, count]) => ({ [key.includes('company:') ? 'company' : 'category']: key.replace(/^company:/, ''), count: String(count) }))
        return json(res, {
          total: questions.length,
          byCategory: countBy(questions.map((question) => question.category || '')),
          byCompany: countBy(questions.flatMap((question) => (question.companies || []).map((company) => `company:${company}`))),
        })
      }
      try {
        const total = await pool.query('SELECT COUNT(*) FROM questions')
        const byCategory = await pool.query('SELECT category, COUNT(*) as count FROM questions GROUP BY category ORDER BY count DESC')
        const byCompany = await pool.query('SELECT unnest(companies) as company, COUNT(*) as count FROM questions GROUP BY company ORDER BY count DESC')
        return json(res, {
          total: parseInt(total.rows[0].count),
          byCategory: byCategory.rows,
          byCompany: byCompany.rows,
        })
      } catch {
        dbAvailable = false
        const questions = await loadLocalQuestions()
        const countBy = (values) => Object.entries(values.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1
          return acc
        }, {})).map(([key, count]) => ({ [key.includes('company:') ? 'company' : 'category']: key.replace(/^company:/, ''), count: String(count) }))
        return json(res, {
          total: questions.length,
          byCategory: countBy(questions.map((question) => question.category || '')),
          byCompany: countBy(questions.flatMap((question) => (question.companies || []).map((company) => `company:${company}`))),
          storage: 'json-cache',
        })
      }
    }

    json(res, { error: 'Not found' }, 404)
  } catch (err) {
    console.error('API error:', err.message)
    json(res, { error: err.message }, 500)
  }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on :${PORT}`)
})
