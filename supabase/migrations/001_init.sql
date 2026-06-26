CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  stage TEXT,
  difficulty INTEGER,
  answer TEXT,
  companies TEXT[],
  roles TEXT[],
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT REFERENCES questions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE TABLE IF NOT EXISTS view_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT REFERENCES questions(id),
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);
