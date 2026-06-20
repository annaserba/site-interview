import { createServer } from 'node:http'
import { answerQuestion, retrieve } from './rag-core.mjs'

const port = Number(process.env.RAG_PORT || 8787)

function send(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5174',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  })
  response.end(JSON.stringify(body))
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 50_000) throw new Error('Request too large')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, {})
  if (request.method === 'GET' && request.url === '/api/rag/health') {
    return send(response, 200, { ok: true, storage: 'json' })
  }

  if (request.method === 'POST' && ['/api/rag/search', '/api/rag/ask'].includes(request.url)) {
    try {
      const { query, filters = {} } = await readBody(request)
      if (typeof query !== 'string' || query.trim().length < 2) return send(response, 400, { error: 'Введите вопрос длиннее одного символа.' })
      if (query.length > 1_000) return send(response, 400, { error: 'Запрос слишком длинный.' })
      const result = request.url.endsWith('/ask')
        ? await answerQuestion(query.trim(), filters)
        : { sources: await retrieve(query.trim(), filters) }
      return send(response, 200, result)
    } catch (error) {
      return send(response, 500, { error: error instanceof Error ? error.message : 'RAG error' })
    }
  }

  return send(response, 404, { error: 'Not found' })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`RAG API: http://127.0.0.1:${port}`)
})
