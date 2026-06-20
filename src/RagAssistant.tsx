import { FormEvent, useState } from 'react'
import { Database, ExternalLink, LoaderCircle, MessageCircle, Send, Sparkles } from 'lucide-react'
import { fetchQuestionIndex, fetchQuestions } from './dataClient'
import type { Question, RagResponse } from './types'

const synonymGroups = [
  ['go', 'golang'],
  ['конкурентность', 'параллелизм', 'concurrency', 'многопоточность'],
  ['очередь', 'queue', 'задачи', 'воркеры'],
  ['самопрезентация', 'знакомство', 'себе', 'опыт'],
  ['кеш', 'кэш', 'cache', 'кэширование'],
  ['архитектура', 'проектирование', 'design', 'system'],
  ['данные', 'etl', 'pipeline', 'пайплайн'],
  ['ограничение', 'лимит', 'rate', 'limiter'],
]

const synonymMap = new Map(synonymGroups.flatMap((group) => group.map((word) => [word, group])))

const stem = (token: string) => {
  if (/^[а-я]+$/u.test(token) && token.length > 5) return token.replace(/(иями|ями|ами|ого|ему|ому|ыми|ими|иях|ах|ях|ов|ев|ей|ий|ый|ой|ая|яя|ое|ее|ые|ие|ам|ям|ом|ем|ами|ями|у|ю|а|я|ы|и|е)$/u, '')
  if (/^[a-z]+$/u.test(token) && token.length > 5) return token.replace(/(ing|ed|es|s)$/u, '')
  return token
}

const ragTokens = (text = '') => {
  const raw = text.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').match(/[a-zа-я0-9+#.]+/giu) || []
  return [...new Set(raw.flatMap((token) => {
    const normalized = stem(token)
    const synonyms = synonymMap.get(token) || synonymMap.get(normalized) || []
    return [normalized, ...synonyms.map(stem)]
  }))]
}

async function browserEmbedding(text: string) {
  const size = 512
  const vector = new Array(size).fill(0)
  const tokens = ragTokens(text)
  const compact = tokens.join('_')
  const features = [
    ...tokens,
    ...tokens.slice(0, -1).map((token, index) => `${token}_${tokens[index + 1]}`),
    ...Array.from({ length: Math.max(0, compact.length - 2) }, (_, index) => compact.slice(index, index + 3)),
  ]
  const digests = await Promise.all(features.map((feature) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(feature))))

  for (const digest of digests) {
    const bytes = new Uint8Array(digest)
    const index = ((bytes[0] << 8) | bytes[1]) % size
    vector[index] += bytes[2] % 2 === 0 ? 1 : -1
  }

  const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map((value) => value / length)
}

const questionText = (question: Question) => [
  question.title,
  question.answer,
  question.context || '',
  question.category,
  question.stage,
  ...question.tags,
  ...question.languages,
  ...question.roles,
  ...question.companies,
  ...(question.keyPoints || []).flatMap((point) => [point.title, point.text]),
  ...(question.pitfalls || []),
  ...(question.followUps || []),
].join(' ')

async function staticRag(query: string): Promise<RagResponse> {
  const [questions, index] = await Promise.all([
    fetchQuestions(),
    fetchQuestionIndex(),
  ])
  const queryVector = await browserEmbedding(query)
  const embeddings = new Map(index.documents.map((document) => [document.id, document.embedding]))
  const queryTokenSet = new Set(ragTokens(query))
  const normalizedQuery = query.toLocaleLowerCase('ru-RU')

  const sources = questions.map((question) => {
    const vector = embeddings.get(question.id) || []
    const cosine = vector.length === queryVector.length
      ? Math.max(0, vector.reduce((sum, value, position) => sum + value * queryVector[position], 0))
      : 0
    const titleTokens = new Set(ragTokens(`${question.title} ${question.category} ${question.tags.join(' ')}`))
    const documentTokens = new Set(ragTokens(questionText(question)))
    const overlap = (tokens: Set<string>) => queryTokenSet.size ? [...queryTokenSet].filter((token) => tokens.has(token)).length / queryTokenSet.size : 0
    const lexical = overlap(titleTokens) * 0.65 + overlap(documentTokens) * 0.35
    const metadata = [...question.companies, ...question.languages, ...question.roles, question.level]
      .some((value) => value && normalizedQuery.includes(value.toLocaleLowerCase('ru-RU'))) ? 0.12 : 0
    return { ...question, score: cosine * 0.5 + lexical * 0.5 + metadata, retrieval: 'browser-json' }
  }).sort((left, right) => (right.score || 0) - (left.score || 0)).slice(0, 4)

  const threshold = sources.length ? Math.max(0.1, (sources[0].score || 0) * 0.38) : 1
  const relevant = sources.filter((source) => (source.score || 0) >= threshold).slice(0, 3)
  const primary = relevant[0]
  const answer = primary ? [
    `Короткий ответ\n${primary.answer}`,
    primary.keyPoints?.length ? `Как раскрыть ответ на интервью\n${primary.keyPoints.map((point, index) => `${index + 1}. ${point.title}: ${point.text}`).join('\n')}` : '',
    primary.pitfalls?.length ? `Чего избегать\n${primary.pitfalls.slice(0, 3).map((item) => `— ${item}`).join('\n')}` : '',
    relevant.length > 1 ? `Связанные вопросы\n${relevant.slice(1).map((source) => `— ${source.title}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n') : 'В JSON-базе пока нет подходящего материала.'

  return { answer, mode: 'local', sources: relevant }
}

type RagAssistantProps = {
  variant?: 'hero' | 'section'
}

export function RagAssistant({ variant = 'section' }: RagAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<RagResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = async (event: FormEvent) => {
    event.preventDefault()
    const question = prompt.trim()
    if (question.length < 2 || loading) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
        signal: AbortSignal.timeout(8_000),
      })
      if (!response.ok) throw new Error('API недоступен')
      setResult(await response.json())
    } catch {
      try {
        setResult(await staticRag(question))
      } catch {
        setError('Не удалось прочитать JSON-индекс. Запустите npm run index.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'hero') {
    return (
      <div className="hero-rag" id="rag">
        <div className="hero-rag-head">
          <span><Sparkles size={15} /> AI-помощник</span>
          <small><i /> JSON RAG</small>
        </div>
        <form className="hero-rag-form" onSubmit={ask}>
          <MessageCircle size={20} />
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Спросите, что ждёт вас на интервью…"
            aria-label="Вопрос AI-помощнику"
            rows={1}
          />
          <button type="submit" disabled={loading || prompt.trim().length < 2}>
            {loading ? <LoaderCircle size={18} /> : <><span>Спросить</span><Send size={17} /></>}
          </button>
        </form>
        {error && <div className="hero-rag-error">{error}</div>}
        {result && !loading && (
          <div className="hero-rag-result" aria-live="polite">
            <div className="hero-rag-answer">
              <span>Ответ по базе</span>
              {result.answer.split('\n').filter(Boolean).map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
            </div>
            <div className="hero-rag-sources">
              <small>Источники · {result.sources.length}</small>
              {result.sources.map((source) => <a href={`#question/${source.id}`} key={source.id}>{source.companies[0]} — {source.title}<ExternalLink size={13} /></a>)}
            </div>
          </div>
        )}
        {!result && <div className="hero-rag-examples"><span>Например:</span><button type="button" onClick={() => setPrompt('Как отвечать на вопрос «Расскажите о себе»?')}>Расскажите о себе</button><button type="button" onClick={() => setPrompt('Что спрашивают по конкурентности в Go?')}>Конкурентность в Go</button></div>}
      </div>
    )
  }

  return (
    <section className="rag-section" id="rag">
      <div className="rag-heading">
        <div>
          <span className="section-index">02 / RAG-ПОИСК</span>
          <h2>Спроси базу.<br /><em>Не гадай.</em></h2>
        </div>
        <p>Вопрос превращается в вектор, сравнивается с JSON-индексом и получает ответ только из найденных материалов.</p>
      </div>

      <div className="rag-workspace">
        <div className="rag-console">
          <div className="rag-console-head">
            <span><MessageCircle size={17} /> AI-помощник</span>
            <span className="rag-status"><i /> JSON подключён</span>
          </div>
          <div className="rag-answer" aria-live="polite">
            {!result && !loading && (
              <div className="rag-placeholder">
                <Database size={32} />
                <h3>Что хотите узнать?</h3>
                <p>Например: «Как отвечать на расскажите о себе?» или «Что спрашивают по конкурентности в Go?»</p>
              </div>
            )}
            {loading && <div className="rag-loading"><LoaderCircle size={22} /> Ищу фрагменты и собираю ответ…</div>}
            {error && <div className="rag-error">{error}</div>}
            {result && !loading && (
              <>
                <div className="rag-mode">Лёгкий режим · браузер + JSON</div>
                {result.answer.split('\n').map((line, index) => line ? <p key={`${line}-${index}`}>{line}</p> : <br key={index} />)}
              </>
            )}
          </div>
          <form className="rag-form" onSubmit={ask}>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Задайте вопрос по интервью…"
              aria-label="Вопрос базе знаний"
              rows={2}
            />
            <button type="submit" disabled={loading || prompt.trim().length < 2} aria-label="Отправить вопрос"><Send size={18} /></button>
          </form>
        </div>

        <aside className="rag-sources">
          <div className="rag-sources-head"><span>Найденные источники</span><b>{result?.sources.length || 0}</b></div>
          {result?.sources.map((source, index) => (
            <article key={source.id}>
              <span className="source-number">0{index + 1}</span>
              <div>
                <small>{source.companies.join(', ')} · {source.stage}</small>
                <h3>{source.title}</h3>
                <span>{source.languages.length ? source.languages.slice(0, 3).join(' · ') : 'Для всех языков'}</span>
              </div>
              {source.sources[0]?.url && <a href={source.sources[0].url} target="_blank" rel="noreferrer" aria-label="Открыть источник"><ExternalLink size={15} /></a>}
            </article>
          ))}
          {!result && <p className="sources-empty">Здесь появятся вопросы, на которых основан ответ.</p>}
        </aside>
      </div>
    </section>
  )
}
