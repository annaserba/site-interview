import pg from 'pg'
import crypto from 'crypto'

const PHONE_SALT = process.env.PHONE_SALT || 'site-interview-salt-2024'

function hashPhone(phone) {
  return crypto.createHash('sha256').update(phone + PHONE_SALT).digest('hex')
}

const statements = [
  `CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    stage TEXT,
    difficulty INTEGER DEFAULT 3,
    answer TEXT,
    context TEXT,
    companies TEXT[] DEFAULT '{}',
    roles TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    level TEXT DEFAULT 'Middle',
    duration TEXT DEFAULT '10 мин',
    key_points JSONB DEFAULT '[]',
    pitfalls TEXT[] DEFAULT '{}',
    follow_ups TEXT[] DEFAULT '{}',
    example_answer TEXT,
    code_snippet TEXT,
    code_language TEXT,
    sources JSONB DEFAULT '[]',
    source_type TEXT DEFAULT 'aggregated',
    aliases TEXT[] DEFAULT '{}',
    scope TEXT DEFAULT 'universal',
    video_frequency INTEGER DEFAULT 0,
    published_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE questions ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'`,
  `ALTER TABLE questions ADD COLUMN IF NOT EXISTS scope TEXT DEFAULT 'universal'`,
  `ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_frequency INTEGER DEFAULT 0`,
  `ALTER TABLE questions ADD COLUMN IF NOT EXISTS published_at DATE`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    yandex_id TEXT UNIQUE NOT NULL,
    phone_hash TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    default_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
  )`,
  `CREATE TABLE IF NOT EXISTS view_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_stage ON questions(stage)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_companies ON questions USING GIN(companies)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_roles ON questions USING GIN(roles)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN(tags)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_aliases ON questions USING GIN(aliases)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_video_frequency ON questions(video_frequency DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_published_at ON questions(published_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_users_yandex_id ON users(yandex_id)`,
  `CREATE INDEX IF NOT EXISTS idx_users_phone_hash ON users(phone_hash)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_view_history_user ON view_history(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_answers_question ON user_answers(question_id)`
]

export async function migrate(pool) {
  const client = await pool.connect()
  try {
    for (const sql of statements) {
      await client.query(sql)
    }
    console.log('✓ Migration complete')
  } finally {
    client.release()
  }
}

export { hashPhone }

if (process.argv[1]?.endsWith('migrate.mjs')) {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  migrate(pool).then(() => pool.end()).catch(e => { console.error(e); process.exit(1) })
}
