import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Code2, ExternalLink, Layers3, Save, ShieldAlert, Trash2, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import type { Question } from './types'
import { fetchUserAnswers, saveUserAnswer, deleteUserAnswer, type UserAnswer } from './api'
import s from './QuestionDetail.module.css'

type QuestionDetailProps = { question: Question; onBack: () => void }
const formatDate = (date?: string) => {
  if (!date) return ''
  const value = new Date(date)
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
}

const companyStyles: Record<string, { mark: string; color: string }> = {
  'Яндекс': { mark: 'Я', color: '#ffcc00' },
  Ozon: { mark: 'O', color: '#1969ff' },
  Avito: { mark: 'A', color: '#9b4dff' },
  'Т-Банк': { mark: 'T', color: '#ffdc2d' },
}

function answerChecklist(question: Question) {
  const category = question.category.toLocaleLowerCase('ru-RU')
  const stage = question.stage.toLocaleLowerCase('ru-RU')
  const tags = question.tags.join(' ').toLocaleLowerCase('ru-RU')

  if (category === 'behavioral' || /hr|знакомство|командное|ситуационное/.test(stage))
    return ['Привёл конкретную ситуацию', 'Обозначил свою роль', 'Объяснил действия и выбор', 'Назвал измеримый результат', 'Сформулировал вывод']
  if (/system design|architecture|архитектура/.test(`${category} ${stage}`))
    return ['Уточнил требования и нагрузку', 'Определил API и модель данных', 'Разделил систему на компоненты', 'Разобрал сбои и масштабирование', 'Назвал компромиссы и метрики']
  if (question.codeSnippet || /algorithms|алгоритмы|live coding/.test(`${category} ${stage}`))
    return ['Уточнил входные данные и ограничения', 'Проговорил решение до кода', 'Оценил время и память', 'Проверил крайние случаи', 'Предложил тесты и улучшения']
  if (/machine learning|statistics|analytics|bi|experimentation|data quality/.test(category))
    return ['Определил задачу и целевую метрику', 'Назвал допущения и ограничения', 'Объяснил метод и альтернативы', 'Проверил качество и ошибки', 'Связал результат с бизнес-решением']
  if (/data engineering/.test(category))
    return ['Уточнил источники и контракт данных', 'Описал поток и преобразования', 'Разобрал качество и идемпотентность', 'Учёл сбои и повторную обработку', 'Добавил мониторинг и SLA']
  if (/performance/.test(`${category} ${tags}`))
    return ['Назвал измеряемую метрику', 'Нашёл вероятное узкое место', 'Предложил способ диагностики', 'Объяснил оптимизацию и цену', 'Проверил эффект измерениями']
  return ['Дал точное определение', 'Объяснил механизм работы', 'Привёл практический пример', 'Назвал ограничения и альтернативы', 'Указал типичные ошибки']
}

export function QuestionDetail({ question, onBack }: QuestionDetailProps) {
  const company = question.companies[0]
  const visual = companyStyles[company] || { mark: company.slice(0, 1), color: '#c9ff32' }
  const videoCount = question.videoFrequency ?? new Set(question.sources.filter((source) => source.type === 'youtube').map((source) => source.url)).size
  const checklist = answerChecklist(question)
  const introRef = useRef<HTMLElement>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [answerText, setAnswerText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [question.id])

  useEffect(() => {
    fetchUserAnswers(question.id).then(setUserAnswers)
    setAnswerText('')
  }, [question.id])

  const handleSaveAnswer = async () => {
    if (!answerText.trim()) return
    setIsSaving(true)
    try {
      const id = await saveUserAnswer(question.id, answerText)
      if (id) {
        setUserAnswers((prev) => [{ id, user_id: 0, question_id: question.id, answer: answerText, context: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...prev])
        setAnswerText('')
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAnswer = async (answerId: number) => {
    await deleteUserAnswer(answerId)
    setUserAnswers((prev) => prev.filter((a) => a.id !== answerId))
  }

  return (
    <article className={s['detail-page']}>
      <header className={s['detail-hero']}>
        <button className={s['detail-back']} onClick={onBack}><ArrowLeft size={16} /> К вопросам</button>
        <div className={s['detail-company']}>
          <span className="company-logo" style={{ background: visual.color }}>{visual.mark}</span>
          <span><b>{question.companies.join(', ')}</b><small>{question.roles.join(' · ')}</small></span>
        </div>
        <span className={s['detail-kicker']}>{question.category} / {question.stage}</span>
        <h1>{question.title}</h1>
        <div className={s['detail-tags']}>{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>

      <div className={s['detail-meta']}>
        <div><small>Уровень</small><strong>{question.level}</strong></div>
        <div><small>Время на решение</small><strong><Clock3 size={15} /> {question.duration}</strong></div>
        <div><small>Языки</small><strong>{question.languages.slice(0, 4).join(' · ') || 'Любой'}</strong></div>
        <div><small>Сложность</small><strong>{question.difficulty <= 2 ? 'Easy' : question.difficulty <= 3 ? 'Medium' : 'Hard'}</strong></div>
        {question.publishedAt && <div><small>Дата источника</small><strong>{formatDate(question.publishedAt)}</strong></div>}
      </div>

      <div className={s['detail-layout']}>
        <div className={s['detail-content']}>
          <section className={`${s['detail-section']} ${s['detail-intro']}`} ref={introRef}>
            <span className={s['detail-index']}>01</span>
            <div><h2>Что от вас хотят</h2><p>{question.context || question.answer}</p></div>
          </section>

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>02</span>
            <div className={s['answer-box']}>
              <div className={s['answer-box-head']}><Check size={17} /><span>Краткий ответ</span></div>
              <p className={s['answer-box-text']}>{question.answer}</p>
            </div>
          </section>

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>03</span>
            <div className={s['user-answer-box']}>
              <div className={s['user-answer-head']}>
                <span>Мои ответы ({userAnswers.length})</span>
              </div>
              {userAnswers.length > 0 && (
                <div className={s['user-answers-list']}>
                  {userAnswers.map((item) => (
                    <div key={item.id} className={s['user-answer-item']}>
                      <p>{item.answer}</p>
                      <button className={s['user-answer-delete']} onClick={() => handleDeleteAnswer(item.id)} title="Удалить ответ">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                className={s['user-answer-input']}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Напишите свой вариант ответа..."
                rows={4}
              />
              <div className={s['user-answer-actions']}>
                <button
                  className={s['user-answer-save']}
                  onClick={handleSaveAnswer}
                  disabled={isSaving || !answerText.trim()}
                >
                  <Save size={14} />
                  {isSaving ? 'Сохранение...' : showSaved ? 'Сохранено!' : 'Добавить ответ'}
                </button>
              </div>
            </div>
          </section>

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>04</span>
            <div>
              <h2>Как строить решение</h2>
              <div className={s['solution-steps']}>
                {(question.keyPoints || []).map((point, index) => (
                  <div key={point.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><h3>{point.title}</h3><p>{point.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {question.codeSnippet && (
            <section className={s['interview-code']}>
              <div className={s['interview-code-head']}><Code2 size={17} /><span>Код из интервью</span><small>{question.codeLanguage}</small></div>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code className={`${className} hljs`} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {`\`\`\`${question.codeLanguage || 'text'}\n${question.codeSnippet}\n\`\`\``}
              </Markdown>
            </section>
          )}

          {question.exampleAnswer && (
            <section className={s['detail-section']}>
              <span className={s['detail-index']}>05</span>
              <div className={s['example-answer']}>
                <div className={s['example-answer-head']}><BookOpen size={17} /><span>Пример ответа</span></div>
                <div className={s['example-answer-body']}>
                  <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{question.exampleAnswer}</Markdown>
                </div>
              </div>
            </section>
          )}

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>06</span>
            <div>
              <h2>Частые ошибки</h2>
              <ul className={s['pitfall-list']}>
                {(question.pitfalls || []).map((pitfall) => <li key={pitfall}><ShieldAlert size={16} /> {pitfall}</li>)}
              </ul>
            </div>
          </section>

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>07</span>
            <div>
              <h2>Что могут спросить дальше</h2>
              <ol className={s['followup-list']}>
                {(question.followUps || []).map((item) => <li key={item}>{item}<ArrowRight size={15} /></li>)}
              </ol>
            </div>
          </section>
        </div>

        <aside className={s['detail-sidebar']}>
          <div className={s['sidebar-card']}>
            <span><Layers3 size={18} /> Чек-лист ответа</span>
            {checklist.map((item) => <label key={item}><i><Check size={12} /></i>{item}</label>)}
          </div>
          <div className={s['sidebar-card']}>
            <span><Users size={18} /> Источник</span>
            <p className={s['source-frequency']}>Встречается в {videoCount} видео</p>
            {(question.sources.length ? question.sources : [{ company, url: '', type: 'aggregated' }]).map((source) => (
              <div className={s['source-item']} key={`${source.company}-${source.url}`}>
                <p>{source.company}</p>
                <small>{source.type === 'youtube' ? 'Запись технического интервью' : source.type === 'candidate-report' ? 'Восстановлено по отчёту кандидата' : 'Агрегированный материал'}{source.publishedAt ? ` · ${formatDate(source.publishedAt)}` : ''}</small>
                {source.url && (
                  <a className={s['source-link']} href={source.url} target="_blank" rel="noreferrer">
                    {source.type === 'youtube' ? 'Смотреть видео' : 'Открыть источник'} <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className={s['sidebar-note']}>Не заучивайте готовую архитектуру. На интервью важнее показать ход мысли и проговаривать компромиссы.</div>
        </aside>
      </div>
    </article>
  )
}
