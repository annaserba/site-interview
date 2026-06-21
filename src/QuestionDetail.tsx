import { ArrowLeft, ArrowRight, Check, Clock3, Code2, ExternalLink, Layers3, ShieldAlert, Users } from 'lucide-react'
import type { Question } from './types'

type QuestionDetailProps = {
  question: Question
  onBack: () => void
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

  if (category === 'behavioral' || /hr|знакомство|командное|ситуационное/.test(stage)) {
    return ['Привёл конкретную ситуацию', 'Обозначил свою роль', 'Объяснил действия и выбор', 'Назвал измеримый результат', 'Сформулировал вывод']
  }

  if (/system design|architecture|архитектура/.test(`${category} ${stage}`)) {
    return ['Уточнил требования и нагрузку', 'Определил API и модель данных', 'Разделил систему на компоненты', 'Разобрал сбои и масштабирование', 'Назвал компромиссы и метрики']
  }

  if (question.codeSnippet || /algorithms|алгоритмы|live coding/.test(`${category} ${stage}`)) {
    return ['Уточнил входные данные и ограничения', 'Проговорил решение до кода', 'Оценил время и память', 'Проверил крайние случаи', 'Предложил тесты и улучшения']
  }

  if (/machine learning|statistics|analytics|bi|experimentation|data quality/.test(category)) {
    return ['Определил задачу и целевую метрику', 'Назвал допущения и ограничения', 'Объяснил метод и альтернативы', 'Проверил качество и ошибки', 'Связал результат с бизнес-решением']
  }

  if (/data engineering/.test(category)) {
    return ['Уточнил источники и контракт данных', 'Описал поток и преобразования', 'Разобрал качество и идемпотентность', 'Учёл сбои и повторную обработку', 'Добавил мониторинг и SLA']
  }

  if (/performance/.test(`${category} ${tags}`)) {
    return ['Назвал измеряемую метрику', 'Нашёл вероятное узкое место', 'Предложил способ диагностики', 'Объяснил оптимизацию и цену', 'Проверил эффект измерениями']
  }

  return ['Дал точное определение', 'Объяснил механизм работы', 'Привёл практический пример', 'Назвал ограничения и альтернативы', 'Указал типичные ошибки']
}

export function QuestionDetail({ question, onBack }: QuestionDetailProps) {
  const company = question.companies[0]
  const visual = companyStyles[company] || { mark: company.slice(0, 1), color: '#c9ff32' }
  const videoFrequency = question.videoFrequency ?? new Set(question.sources.filter((source) => source.type === 'youtube').map((source) => source.url)).size
  const checklist = answerChecklist(question)

  return (
    <article className="detail-page">
      <header className="detail-hero">
        <button className="detail-back" onClick={onBack}><ArrowLeft size={16} /> К вопросам</button>
        <div className="detail-company">
          <span className="company-logo" style={{ background: visual.color }}>{visual.mark}</span>
          <span><b>{question.companies.join(', ')}</b><small>{question.roles.join(' · ')}</small></span>
        </div>
        <span className="detail-kicker">{question.category} / {question.stage}</span>
        <h1>{question.title}</h1>
        <div className="detail-tags">{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>

      <div className="detail-meta">
        <div><small>Уровень</small><strong>{question.level}</strong></div>
        <div><small>Время на решение</small><strong><Clock3 size={15} /> {question.duration}</strong></div>
        <div><small>Языки</small><strong>{question.languages.slice(0, 4).join(' · ') || 'Любой'}</strong></div>
        <div><small>Сложность</small><strong>{question.difficulty} / 5</strong></div>
      </div>

      <div className="detail-layout">
        <div className="detail-content">
          <section className="detail-section detail-intro">
            <span className="detail-index">01</span>
            <div><h2>Что от вас хотят</h2><p>{question.context || question.answer}</p></div>
          </section>

          <section className="detail-section">
            <span className="detail-index">02</span>
            <div>
              <h2>Как строить решение</h2>
              <div className="solution-steps">
                {(question.keyPoints || [{ title: 'Основная идея', text: question.answer }]).map((point, index) => (
                  <div key={point.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><h3>{point.title}</h3><p>{point.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {question.codeSnippet && (
            <section className="interview-code">
              <div className="interview-code-head"><Code2 size={17} /><span>Код из интервью</span><small>{question.codeLanguage}</small></div>
              <pre><code>{question.codeSnippet}</code></pre>
            </section>
          )}

          <section className="detail-section">
            <span className="detail-index">{question.codeSnippet ? '04' : '03'}</span>
            <div>
              <h2>Частые ошибки</h2>
              <ul className="pitfall-list">
                {(question.pitfalls || []).map((pitfall) => <li key={pitfall}><ShieldAlert size={16} /> {pitfall}</li>)}
              </ul>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">{question.codeSnippet ? '05' : '04'}</span>
            <div>
              <h2>Что могут спросить дальше</h2>
              <ol className="followup-list">
                {(question.followUps || []).map((item) => <li key={item}>{item}<ArrowRight size={15} /></li>)}
              </ol>
            </div>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="sidebar-card ready-card">
            <span><Layers3 size={18} /> Чек-лист ответа</span>
            {checklist.map((item) => <label key={item}><i><Check size={12} /></i>{item}</label>)}
          </div>
          <div className="sidebar-card">
            <span><Users size={18} /> Источник</span>
            <p className="source-frequency">Встречается в {videoFrequency} видео</p>
            {(question.sources.length ? question.sources : [{ company, url: '', type: 'aggregated' }]).map((source) => (
              <div className="source-item" key={`${source.company}-${source.url}`}>
                <p>{source.company}</p>
                <small>{source.type === 'youtube' ? 'Запись технического интервью' : source.type === 'candidate-report' ? 'Восстановлено по отчёту кандидата' : 'Агрегированный материал'}</small>
                {source.url && (
                  <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.type === 'youtube' ? 'Смотреть видео' : 'Открыть источник'} <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="sidebar-note">Не заучивайте готовую архитектуру. На интервью важнее показать ход мысли и проговаривать компромиссы.</div>
        </aside>
      </div>
    </article>
  )
}
