import pg from 'pg'
import crypto from 'crypto'
import http from 'http'
import { hashPhone } from './db/migrate.mjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 })

const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET
const YANDEX_REDIRECT_URI = process.env.YANDEX_REDIRECT_URI || 'http://192.144.59.118/api/auth/yandex/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://192.144.59.118'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
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

  const result = await pool.query(
    `SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token]
  )
  return result.rows[0] || null
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
  const yandexId = String(yandexInfo.id)
  const phone = yandexInfo.default_phone?.number || yandexInfo.phone || ''
  const phoneHash = phone ? hashPhone(phone) : `no_phone_${yandexId}`
  const displayName = yandexInfo.display_name || yandexInfo.real_name || 'User'
  const avatarUrl = yandexInfo.default_avatar_id
    ? `https://avatars.yandex.net/get-yapic/${yandexInfo.default_avatar_id}/islands-200`
    : null
  const email = yandexInfo.default_email || ''

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
    // ─── AUTH ROUTES ───

    // Redirect to Yandex OAuth
    if (url === '/api/auth/yandex' && req.method === 'GET') {
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(YANDEX_REDIRECT_URI)}`
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
      const user = await findOrCreateUser(yandexInfo)
      const session = await createSession(user.id)

      res.writeHead(302, {
        Location: FRONTEND_URL,
        'Set-Cookie': `session_token=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION / 1000}`,
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
      if (token) {
        await pool.query('DELETE FROM sessions WHERE token = $1', [token])
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      })
      return res.end(JSON.stringify({ ok: true }))
    }

    // ─── EXISTING ROUTES ───

    // Health check
    if (url === '/api/health') {
      return json(res, { ok: true, storage: 'postgresql' })
    }

    // List questions with filters
    if (url === '/api/questions' && req.method === 'GET') {
      const params = parseQuery(req.url)
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

      sql += ' ORDER BY id'
      if (params.limit) { sql += ` LIMIT $${i}`; args.push(parseInt(params.limit)); i++ }
      if (params.offset) { sql += ` OFFSET $${i}`; args.push(parseInt(params.offset)); i++ }

      const result = await pool.query(sql, args)
      return json(res, { questions: result.rows, total: result.rowCount })
    }

    // Get question by ID
    if (url.startsWith('/api/questions/') && req.method === 'GET') {
      const id = url.split('/api/questions/')[1]
      const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id])
      if (result.rows.length === 0) return json(res, { error: 'Not found' }, 404)
      return json(res, result.rows[0])
    }

    // Get filter options
    if (url === '/api/filters') {
      const companies = await pool.query('SELECT DISTINCT unnest(companies) as val FROM questions ORDER BY val')
      const types = await pool.query('SELECT DISTINCT category as val FROM questions WHERE category IS NOT NULL ORDER BY val')
      const roles = await pool.query('SELECT DISTINCT unnest(roles) as val FROM questions ORDER BY val')
      return json(res, {
        companies: companies.rows.map(r => r.val),
        types: types.rows.map(r => r.val),
        roles: roles.rows.map(r => r.val),
      })
    }

    // Favorites (requires auth)
    if (url === '/api/favorites' && req.method === 'GET') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { favorites: [] })
      const result = await pool.query(
        'SELECT q.* FROM favorites f JOIN questions q ON q.id = f.question_id WHERE f.user_id = $1 ORDER BY f.created_at DESC',
        [user.id]
      )
      return json(res, { favorites: result.rows })
    }

    if (url === '/api/favorites' && req.method === 'POST') {
      const user = await getUserFromRequest(req)
      if (!user) return json(res, { error: 'Unauthorized' }, 401)
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
      const body = await parseBody(req)
      if (!body.question_id) return json(res, { error: 'question_id required' }, 400)
      await pool.query(
        'INSERT INTO view_history (user_id, question_id) VALUES ($1, $2)',
        [user.id, body.question_id]
      )
      return json(res, { ok: true })
    }

    // Stats
    if (url === '/api/stats') {
      const total = await pool.query('SELECT COUNT(*) FROM questions')
      const byCategory = await pool.query('SELECT category, COUNT(*) as count FROM questions GROUP BY category ORDER BY count DESC')
      const byCompany = await pool.query('SELECT unnest(companies) as company, COUNT(*) as count FROM questions GROUP BY company ORDER BY count DESC')
      return json(res, {
        total: parseInt(total.rows[0].count),
        byCategory: byCategory.rows,
        byCompany: byCompany.rows,
      })
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
