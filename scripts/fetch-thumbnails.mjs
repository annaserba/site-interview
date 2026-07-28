// Скачивает превью YouTube-видео в public/thumbnails/<id>.jpg
// Запуск: node scripts/fetch-thumbnails.mjs
// При заблокированном YouTube: HTTPS_PROXY=http://127.0.0.1:1081 node scripts/fetch-thumbnails.mjs
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDir = resolve('public/thumbnails')
const questionsPath = resolve('src/data/questions.json')

const extractVideoId = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('youtu.be')
      ? parsed.pathname.split('/').filter(Boolean)[0] || ''
      : parsed.searchParams.get('v') || ''
  } catch { return '' }
}

const questions = JSON.parse(await readFile(questionsPath, 'utf8'))
const ids = new Set()
for (const q of questions) {
  for (const source of q.sources || []) {
    if (source.type === 'youtube') {
      const id = extractVideoId(source.url)
      if (id) ids.add(id)
    }
  }
}

await mkdir(outputDir, { recursive: true })

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || ''
if (proxy) console.log(`Прокси: ${proxy}`)

let downloaded = 0, skipped = 0, failed = 0
for (const id of ids) {
  const target = resolve(outputDir, `${id}.jpg`)
  try {
    await access(target)
    skipped++
    continue
  } catch {}

  let ok = false
  for (const quality of ['hqdefault', 'mqdefault']) {
    try {
      const response = await fetch(`https://i.ytimg.com/vi/${id}/${quality}.jpg`, {
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) continue
      const buffer = Buffer.from(await response.arrayBuffer())
      // mqdefault/hqdefault-заглушка YouTube весит ~1-3 КБ, настоящие превью больше
      if (buffer.length < 1000) continue
      await writeFile(target, buffer)
      ok = true
      break
    } catch {}
  }
  if (ok) { downloaded++; console.log(`ok: ${id}`) }
  else { failed++; console.log(`FAIL: ${id}`) }
}

console.log(`\nГотово: скачано ${downloaded}, уже было ${skipped}, не удалось ${failed} из ${ids.size}`)
if (failed > 0) console.log('Подсказка: запустите с прокси — HTTPS_PROXY=http://127.0.0.1:1081 node scripts/fetch-thumbnails.mjs')
