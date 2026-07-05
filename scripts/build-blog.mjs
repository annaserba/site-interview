import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'http://sobes-it.ru'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  const meta = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      let val = rest.join(':').trim()
      if (val.startsWith('[')) val = JSON.parse(val)
      meta[key.trim()] = val
    }
  }
  return { meta, content: match[2].trim() }
}

const blogDir = join(__dirname, '../content/blog')
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'))
const articles = []

for (const file of files) {
  const raw = readFileSync(join(blogDir, file), 'utf8')
  const parsed = parseFrontmatter(raw)
  if (parsed) articles.push({ ...parsed.meta, content: parsed.content })
}
console.log(`✓ Loaded ${articles.length} articles from content/blog/`)

function renderArticle(article) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${article.title} — sobes-it</title>
  <meta name="description" content="${article.description}">
  <meta property="og:title" content="${article.title} — sobes-it">
  <meta property="og:description" content="${article.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE_URL}/blog/${article.id}.html">
  <link rel="canonical" href="${SITE_URL}/blog/${article.id}.html">
  <style>
    :root { --ink: #1a1a1a; --muted: #7a7a74; --acid: #b8ff00; --acid-glow: rgba(184,255,0,.15); --paper: #faf9f7; --line: #e8e6e0; --line-soft: #efeee9; --surface: #fff; --dark: #111210; --dark-line: #2c2e29; --radius-sm: 10px; --radius: 14px; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--paper); color: var(--ink); line-height: 1.7; }
    .container { max-width: 720px; margin: 0 auto; padding: 40px 20px 80px; }
    .back { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); text-decoration: none; font-size: 13px; margin-bottom: 24px; }
    .back:hover { color: var(--ink); }
    .meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
    .tag { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #b8ff00; background: var(--acid-glow); padding: 3px 8px; border-radius: 999px; font-weight: 600; }
    .read-time { font-size: 12px; color: var(--muted); }
    h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 32px; }
    .content { font-size: 15px; line-height: 1.7; color: #3a3b35; }
    .content h2 { font-size: 20px; font-weight: 700; color: var(--ink); margin: 32px 0 12px; letter-spacing: -0.01em; }
    .content h3 { font-size: 16px; font-weight: 600; color: var(--ink); margin: 24px 0 8px; }
    .content p { margin: 0 0 14px; }
    .content ul, .content ol { margin: 0 0 14px; padding-left: 24px; }
    .content li { margin: 4px 0; }
    .content strong { color: var(--ink); font-weight: 600; }
    .content code { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: var(--line-soft); padding: 2px 5px; border-radius: 4px; }
    .content pre { background: var(--dark); border: 1px solid var(--dark-line); border-radius: var(--radius); padding: 16px; overflow-x: auto; margin: 0 0 16px; }
    .content pre code { background: none; padding: 0; color: var(--acid); font-size: 12px; line-height: 1.6; }
    .content blockquote { border-left: 3px solid var(--acid); margin: 0 0 16px; padding: 12px 16px; background: var(--acid-glow); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
    .content blockquote p { margin: 0; }
    .home-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 40px; padding: 10px 16px; border: 1px solid var(--line); border-radius: 999px; color: var(--ink); text-decoration: none; font-size: 13px; font-weight: 600; }
    .home-link:hover { border-color: var(--acid); }
  </style>
</head>
<body>
  <div class="container">
    <a class="back" href="/blog.html">\u2190 \u041a \u0431\u043b\u043e\u0433\u0443</a>
    <article>
      <div class="meta">
        ${article.tags.map(t => `<span class="tag">${t}</span>`).join('\n        ')}
        <span class="read-time">\u23f1 ${article.readTime}</span>
      </div>
      <h1>${article.title}</h1>
      <div class="content">
        ${article.content}
      </div>
    </article>
    <a class="home-link" href="/">sobes-it \u2014 \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e</a>
  </div>
</body>
</html>`
}

function renderBlogIndex(articles) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>\u0411\u043b\u043e\u0433 \u2014 sobes-it</title>
  <meta name="description" content="\u041f\u0440\u0430\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430 \u043f\u043e \u043f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u044e \u0442\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0441\u043e\u0431\u0435\u0441\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0439: System Design, \u0430\u043b\u0433\u043e\u0440\u0438\u0442\u043c\u044b, \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435.">
  <link rel="canonical" href="${SITE_URL}/blog.html">
  <style>
    :root { --ink: #1a1a1a; --muted: #7a7a74; --acid: #b8ff00; --acid-glow: rgba(184,255,0,.15); --paper: #faf9f7; --line: #e8e6e0; --surface: #fff; --radius: 14px; --radius-lg: 18px; --shadow-sm: 0 1px 3px rgba(0,0,0,.04); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--paper); color: var(--ink); }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px 80px; }
    .back { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); text-decoration: none; font-size: 13px; margin-bottom: 24px; }
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .subtitle { color: var(--muted); font-size: 15px; margin-bottom: 32px; }
    .card { display: block; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 24px; text-decoration: none; color: inherit; margin-bottom: 16px; transition: border-color .2s, box-shadow .2s, transform .2s; }
    .card:hover { border-color: rgba(184,255,0,.4); box-shadow: var(--shadow-sm); transform: translateY(-2px); }
    .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .tag { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #b8ff00; background: var(--acid-glow); padding: 3px 8px; border-radius: 999px; font-weight: 600; }
    .card h2 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .card p { color: var(--muted); font-size: 14px; line-height: 1.5; margin-bottom: 16px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .read-time { font-size: 12px; color: var(--muted); }
    .read-more { font-size: 13px; font-weight: 600; color: var(--acid); }
  </style>
</head>
<body>
  <div class="container">
    <a class="back" href="/">\u2190 \u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e</a>
    <h1>\u0411\u043b\u043e\u0433</h1>
    <p class="subtitle">\u041f\u0440\u0430\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430 \u043f\u043e \u043f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u044e \u0442\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0441\u043e\u0431\u0435\u0441\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0439</p>
    ${articles.map(a => `
    <a class="card" href="/blog/${a.id}.html">
      <div class="card-tags">
        ${a.tags.map(t => `<span class="tag">${t}</span>`).join('\n        ')}
      </div>
      <h2>${a.title}</h2>
      <p>${a.description}</p>
      <div class="card-footer">
        <span class="read-time">\u23f1 ${a.readTime}</span>
        <span class="read-more">\u0427\u0438\u0442\u0430\u0442\u044c \u2192</span>
      </div>
    </a>`).join('\n')}
  </div>
</body>
</html>`
}

const outDir = join(__dirname, '../dist/blog')
mkdirSync(outDir, { recursive: true })

writeFileSync(join(outDir, 'index.html'), renderBlogIndex(articles))
console.log(`\u2713 blog/index.html`)

for (const article of articles) {
  writeFileSync(join(outDir, `${article.id}.html`), renderArticle(article))
  console.log(`\u2713 blog/${article.id}.html`)
}
