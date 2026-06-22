import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Code2, ExternalLink, Layers3, ShieldAlert, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-go'
import type { Question } from './types'
import s from './QuestionDetail.module.css'

function renderMarkdown(text: string): string {
  let result = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code class="language-${lang || 'text'}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code class="inline">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
  const lines = result.split('\n')
  let html = ''
  let inList = false
  let inPre = false
  for (const line of lines) {
    if (line.includes('<pre>')) { inPre = true; html += line; continue }
    if (line.includes('</pre>')) { inPre = false; html += line; continue }
    if (inPre) { html += line; continue }
    const bulletMatch = line.match(/^[-*]\s+(.+)/)
    if (bulletMatch) {
      if (!inList) { html += '<ul>'; inList = true }
      html += `<li>${bulletMatch[1]}</li>`
    } else {
      if (inList) { html += '</ul>'; inList = false }
      const trimmed = line.trim()
      if (trimmed) html += `<p>${trimmed}</p>`
    }
  }
  if (inList) html += '</ul>'
  return html
}

type QuestionDetailProps = { question: Question; onBack: () => void }

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
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [question.id])

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
    document.querySelectorAll('.example-answer-body pre code').forEach((el) => {
      Prism.highlightElement(el as HTMLElement)
    })
  })

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
              <pre><code ref={codeRef} className={`language-${question.codeLanguage || 'text'}`}>{question.codeSnippet}</code></pre>
            </section>
          )}

          {question.exampleAnswer && (
            <section className={s['detail-section']}>
              <span className={s['detail-index']}>04</span>
              <div className={s['example-answer']}>
                <div className={s['example-answer-head']}><BookOpen size={17} /><span>Пример ответа</span></div>
                <div className={s['example-answer-body']} dangerouslySetInnerHTML={{ __html: renderMarkdown(question.exampleAnswer) }} />
              </div>
            </section>
          )}

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>05</span>
            <div>
              <h2>Частые ошибки</h2>
              <ul className={s['pitfall-list']}>
                {(question.pitfalls || []).map((pitfall) => <li key={pitfall}><ShieldAlert size={16} /> {pitfall}</li>)}
              </ul>
            </div>
          </section>

          <section className={s['detail-section']}>
            <span className={s['detail-index']}>06</span>
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
                <small>{source.type === 'youtube' ? 'Запись технического интервью' : source.type === 'candidate-report' ? 'Восстановлено по отчёту кандидата' : 'Агрегированный материал'}</small>
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
