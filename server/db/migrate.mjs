import pg from 'pg'

const migrateSQL = `
CREATE TABLE IF NOT EXISTS questions (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE TABLE IF NOT EXISTS view_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_stage ON questions(stage);
CREATE INDEX IF NOT EXISTS idx_questions_companies ON questions USING GIN(companies);
CREATE INDEX IF NOT EXISTS idx_questions_roles ON questions USING GIN(roles);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_favorites_session ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_view_history_session ON view_history(session_id);
`

export async function migrate(pool) {
  const client = await pool.connect()
  try {
    await client.query(migrateSQL)
    console.log('✓ Migration complete')
  } finally {
    client.release()
  }
}

if (process.argv[1]?.endsWith('migrate.mjs')) {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  migrate(pool).then(() => pool.end()).catch(e => { console.error(e); process.exit(1) })
}
