import pg from 'pg'
import http from 'http'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 })

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
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

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const url = req.url.split('?')[0]

  try {
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

    // Get filter options (companies, types, roles)
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

    // Favorites
    if (url === '/api/favorites' && req.method === 'GET') {
      const sessionId = parseQuery(req.url).session_id
      if (!sessionId) return json(res, { error: 'session_id required' }, 400)
      const result = await pool.query(
        'SELECT q.* FROM favorites f JOIN questions q ON q.id = f.question_id WHERE f.session_id = $1 ORDER BY f.created_at DESC',
        [sessionId]
      )
      return json(res, { favorites: result.rows })
    }

    if (url === '/api/favorites' && req.method === 'POST') {
      const body = await parseBody(req)
      if (!body.session_id || !body.question_id) return json(res, { error: 'session_id and question_id required' }, 400)
      await pool.query(
        'INSERT INTO favorites (session_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [body.session_id, body.question_id]
      )
      return json(res, { ok: true })
    }

    if (url === '/api/favorites' && req.method === 'DELETE') {
      const body = await parseBody(req)
      if (!body.session_id || !body.question_id) return json(res, { error: 'session_id and question_id required' }, 400)
      await pool.query(
        'DELETE FROM favorites WHERE session_id = $1 AND question_id = $2',
        [body.session_id, body.question_id]
      )
      return json(res, { ok: true })
    }

    // View history
    if (url === '/api/history' && req.method === 'POST') {
      const body = await parseBody(req)
      if (!body.session_id || !body.question_id) return json(res, { error: 'session_id and question_id required' }, 400)
      await pool.query(
        'INSERT INTO view_history (session_id, question_id) VALUES ($1, $2)',
        [body.session_id, body.question_id]
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
