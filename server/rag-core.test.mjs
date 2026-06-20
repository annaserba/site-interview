import test from 'node:test'
import assert from 'node:assert/strict'
import { answerQuestion, retrieve } from './rag-core.mjs'

const cases = [
  ['Как лучше рассказать о себе и опыте?', 'universal-tell-about-yourself'],
  ['Как реализовать конкурентность и rate limiter в Go?', 'ozon-api-rate-limiter'],
  ['Как кешировать большую ленту в React?', 'avito-feed-cache'],
  ['Почему тормозит ETL пайплайн Kafka?', 'tbank-etl-degradation'],
  ['Как спроектировать отложенную очередь задач с приоритетом?', 'yandex-priority-queue'],
]

for (const [query, expectedId] of cases) {
  test(`retrieves ${expectedId}`, async () => {
    const [result] = await retrieve(query)
    assert.equal(result?.id, expectedId)
  })
}

test('local answer is structured and cites only relevant sources', async () => {
  const result = await answerQuestion('Как рассказать о себе на интервью?')
  assert.equal(result.mode, 'local')
  assert.match(result.answer, /Короткий ответ/)
  assert.match(result.answer, /Как раскрыть ответ/)
  assert.equal(result.sources[0]?.id, 'universal-tell-about-yourself')
})
