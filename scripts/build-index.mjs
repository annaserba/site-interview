import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadQuestions, localEmbedding, questionText, VECTOR_SIZE } from '../server/rag-core.mjs'

const questions = await loadQuestions()
const texts = questions.map(questionText)
const embeddings = texts.map(localEmbedding)
const provider = 'local-hash'
const model = 'hybrid-token-trigram-512'

const index = {
  version: 1,
  provider,
  model,
  dimensions: embeddings[0]?.length || VECTOR_SIZE,
  generatedAt: new Date().toISOString(),
  documents: questions.map((question, index) => ({ id: question.id, embedding: embeddings[index] })),
}

await mkdir(resolve('public/data'), { recursive: true })
await writeFile(resolve('public/data/questions-index.json'), `${JSON.stringify(index)}\n`)
console.log(`Indexed ${questions.length} questions with ${provider}/${model}`)
