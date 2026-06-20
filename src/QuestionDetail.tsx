import { ArrowLeft, ArrowRight, Check, Clock3, Code2, Layers3, ShieldAlert, Users } from 'lucide-react'
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

export function QuestionDetail({ question, onBack }: QuestionDetailProps) {
  const company = question.companies[0]
  const visual = companyStyles[company] || { mark: company.slice(0, 1), color: '#c9ff32' }

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

          <section className="architecture-sketch">
            <div className="sketch-head"><Code2 size={17} /> Базовая схема</div>
            <div className="sketch-flow">
              <span>API</span><ArrowRight /><span>Storage</span><ArrowRight /><span>Scheduler</span><ArrowRight /><span>Workers</span>
            </div>
            <code>task → pending → leased → completed</code>
          </section>

          <section className="detail-section">
            <span className="detail-index">03</span>
            <div>
              <h2>Частые ошибки</h2>
              <ul className="pitfall-list">
                {(question.pitfalls || []).map((pitfall) => <li key={pitfall}><ShieldAlert size={16} /> {pitfall}</li>)}
              </ul>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">04</span>
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
            {['Уточнил требования', 'Назвал структуру данных', 'Обсудил конкурентность', 'Разобрал сбои', 'Добавил мониторинг'].map((item) => <label key={item}><i><Check size={12} /></i>{item}</label>)}
          </div>
          <div className="sidebar-card">
            <span><Users size={18} /> Источник</span>
            <p>{question.sources[0]?.company || company}</p>
            <small>{question.sources[0]?.type === 'candidate-report' ? 'Восстановлено по отчёту кандидата' : 'Агрегированный материал'}</small>
          </div>
          <div className="sidebar-note">Не заучивайте готовую архитектуру. На интервью важнее показать ход мысли и проговаривать компромиссы.</div>
        </aside>
      </div>
    </article>
  )
}
