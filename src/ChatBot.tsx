import { FormEvent, useRef, useState } from 'react'
import { Database, LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { fetchQuestionIndex, fetchQuestions } from './dataClient'
import type { Question, RagResponse } from './types'
import s from './ChatBot.module.css'

/* ── RAG engine (inline) ── */

const synonymGroups = [
  ['go', 'golang'],
  ['конкурентность', 'параллелизм', 'concurrency', 'многопоточность'],
  ['очередь', 'queue', 'задачи', 'воркеры'],
  ['самопрезентация', 'знакомство', 'себе', 'опыт'],
  ['кеш', 'кэш', 'cache', 'кешировать', 'кэшировать', 'кеширование', 'кэширование'],
  ['архитектура', 'проектирование', 'design', 'system'],
  ['данные', 'etl', 'pipeline', 'пайплайн'],
  ['ограничение', 'лимит', 'rate', 'limiter'],
  ['переобучение', 'переобучением', 'overfitting', 'generalization'],
]

const synonymMap = new Map(synonymGroups.flatMap((group) => group.map((word) => [word, group])))
const stopWords = new Set(['что', 'как', 'когда', 'где', 'зачем', 'почему', 'какой', 'какая', 'какие', 'такое', 'нужен', 'нужна', 'нужно', 'можно', 'между'])

const stem = (token: string) => {
  if (/^[а-я]+$/u.test(token) && token.length > 5) return token.replace(/(иями|ями|ами|ого|ему|ому|ыми|ими|иях|ах|ях|ов|ев|ей|ий|ый|ой|ая|яя|ое|ее|ые|ие|ам|ям|ом|ем|ами|ями|у|ю|а|я|ы|и|е)$/u, '')
  if (/^[a-z]+$/u.test(token) && token.length > 5) return token.replace(/(ing|ed|es|s)$/u, '')
  return token
}

const ragTokens = (text = '') => {
  const raw = (text.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').match(/[a-zа-я0-9+#.]+/giu) || []).filter((token) => !stopWords.has(token))
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
  question.title, ...(question.aliases || []), question.answer, question.context || '',
  question.codeSnippet || '', question.category, question.stage,
  ...question.tags, ...question.languages, ...question.roles, ...question.companies,
  ...(question.keyPoints || []).flatMap((point) => [point.title, point.text]),
  ...(question.pitfalls || []), ...(question.followUps || []),
].join(' ')

async function staticRag(query: string): Promise<RagResponse> {
  const [questions, index] = await Promise.all([fetchQuestions(), fetchQuestionIndex()])
  const queryVector = await browserEmbedding(query)
  const embeddings = new Map(index.documents.map((document) => [document.id, document.embedding]))
  const queryTokenSet = new Set(ragTokens(query))
  const normalizedQuery = query.toLocaleLowerCase('ru-RU')

  const sources = questions.map((question) => {
    const vector = embeddings.get(question.id) || []
    const cosine = vector.length === queryVector.length
      ? Math.max(0, vector.reduce((sum, value, position) => sum + value * queryVector[position], 0))
      : 0
    const titleTokens = new Set(ragTokens(`${question.title} ${(question.aliases || []).join(' ')} ${question.category} ${question.tags.join(' ')}`))
    const documentTokens = new Set(ragTokens(questionText(question)))
    const overlap = (tokens: Set<string>) => queryTokenSet.size ? [...queryTokenSet].filter((token) => tokens.has(token)).length / queryTokenSet.size : 0
    const normalize = (value: string) => value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replace(/[^a-zа-я0-9+#.]+/giu, ' ').trim()
    const exactTitleBonus = [question.title, ...(question.aliases || [])].some((title) => normalize(query) === normalize(title)) ? 0.35 : 0
    const lexical = overlap(titleTokens) * 0.65 + overlap(documentTokens) * 0.35 + exactTitleBonus
    const metadata = [...question.companies, ...question.languages, ...question.roles, question.level]
      .some((value) => value && normalizedQuery.includes(value.toLocaleLowerCase('ru-RU'))) ? 0.12 : 0
    return { ...question, score: cosine * 0.35 + lexical * 0.65 + metadata, retrieval: 'browser-json' }
  }).sort((left, right) => (right.score || 0) - (left.score || 0)).slice(0, 4)

  const threshold = sources.length ? Math.max(0.1, (sources[0].score || 0) * 0.38) : 1
  const relevant = sources.filter((source) => (source.score || 0) >= threshold).slice(0, 3)
  const primary = relevant[0]
  const answer = primary ? primary.answer : 'В базе пока нет подходящего материала.'

  return { answer, mode: 'local', sources: relevant }
}

/* ── Component ── */

type Message = { role: 'user' | 'bot'; text: string; sources?: Question[] }

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const ask = async (event?: FormEvent) => {
    event?.preventDefault()
    const question = prompt.trim()
    if (question.length < 2 || loading) return
    setPrompt('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setLoading(true)
    try {
      const response = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
        signal: AbortSignal.timeout(8_000),
      })
      if (!response.ok) throw new Error('API')
      const result: RagResponse = await response.json()
      setMessages((prev) => [...prev, { role: 'bot', text: result.answer, sources: result.sources }])
    } catch {
      try {
        const fallback = await staticRag(question)
        setMessages((prev) => [...prev, { role: 'bot', text: fallback.answer, sources: fallback.sources }])
      } catch {
        setMessages((prev) => [...prev, { role: 'bot', text: 'Не удалось подключиться к базе знаний.' }])
      }
    } finally {
      setLoading(false)
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
    }
  }

  return (
    <>
      <button className={`${s.fab} ${open ? s.hidden : ''}`} onClick={() => setOpen(true)} aria-label="Открыть AI-помощник">
        <MessageCircle size={22} />
        <span className={s.dot} />
      </button>

      {open && (
        <div className={s.panel}>
          <div className={s.head}>
            <span><Sparkles size={15} /> AI-помощник</span>
            <small>JSON RAG</small>
            <button onClick={() => setOpen(false)} aria-label="Закрыть"><X size={16} /></button>
          </div>

          <div className={s.body} ref={scrollRef}>
            {messages.length === 0 && (
              <div className={s.welcome}>
                <p>Задайте вопрос по реальным интервью</p>
                <div>
                  {['Как отвечать на «Расскажите о себе»?', 'Конкурентность в Go', 'System design собеседование'].map((q) => (
                    <button key={q} onClick={() => { setPrompt(q); ask() }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? s.userMsg : s.botMsg}>
                {msg.role === 'bot' ? (
                  <>
                    {msg.text.split('\n\n')[0] && (
                      <div className={s.msgText}>
                        {msg.text.split('\n\n')[0].split('\n').filter(Boolean).map((line, j) => <p key={j}>{line}</p>)}
                        {msg.sources && msg.sources.length > 0 && (
                          <button className={s.cardLink}
                            onClick={() => { setOpen(false); window.location.hash = `question/${msg.sources![0].id}` }}>
                            Читать полностью →
                          </button>
                        )}
                      </div>
                    )}
                    {msg.sources && msg.sources.length > 1 && (
                      <div className={s.sources}>
                        <small>Связанные вопросы</small>
                        {msg.sources.slice(1).map((src) => (
                          <button key={src.id}
                            className={s.sourceBtn}
                            onClick={() => { setOpen(false); window.location.hash = `question/${src.id}` }}>
                            {src.companies[0]} — {src.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={s.msgText}><p>{msg.text}</p></div>
                )}
              </div>
            ))}
            {loading && (
              <div className={s.botMsg}>
                <div className={s.msgText}><LoaderCircle size={16} className={s.spin} /> Ищу в базе…</div>
              </div>
            )}
          </div>

          <form className={s.input} onSubmit={ask}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask() } }}
              placeholder="Спросите про интервью…"
              rows={1}
            />
            <button type="submit" disabled={loading || prompt.trim().length < 2}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  )
}
