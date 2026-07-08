import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Printer, Search, Users } from 'lucide-react'
import { QuestionFilters } from './QuestionFilters'
import type { Question } from './types'
import { questionTypeDefinitions, companyOrder, getQuestionType, topicDefinitions } from './filters'
import { exportQuestionsPDF } from './exportPdf'
import s from './App.module.css'

const companyStyles: Record<string, { mark: string; color: string }> = {
  'Яндекс': { mark: 'Я', color: '#FFCC00' },
  Ozon: { mark: 'O', color: '#005BFF' },
  Avito: { mark: 'A', color: '#00AAFF' },
  'Т-Банк': { mark: 'Т', color: '#FFDD2D' },
  VK: { mark: 'VK', color: '#0077FF' },
  Wildberries: { mark: 'WB', color: '#EC238D' },
  Okko: { mark: 'О', color: '#4B0A9A' },
  Сбер: { mark: 'С', color: '#21A038' },
  Гознак: { mark: 'Г', color: '#003366' },
  'Лига Ставок': { mark: 'Л', color: '#FF6600' },
  'IT One': { mark: 'IT', color: '#E53935' },
  'Rutube': { mark: 'R', color: '#000000' },
  'Usetech': { mark: 'Ut', color: '#1E88E5' },
}

const companyStyle = (company: string) => companyStyles[company] || { mark: company.slice(0, 1), color: '#c9ff32' }

const questionWord = (count: number) => count % 10 === 1 && count % 100 !== 11 ? 'вопрос' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'вопроса' : 'вопросов'
const formatDate = (date?: string) => {
  if (!date) return ''
  const value = new Date(date)
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
}
const videoFrequency = (question: Question) => question.videoFrequency ?? new Set(question.sources
  .filter((source) => source.type === 'youtube')
  .map((source) => {
    try { return new URL(source.url).searchParams.get('v') || source.url }
    catch { return source.url }
  })).size

interface QuestionsPageProps {
  questions: Question[]
  dataError?: string
  onOpenQuestion?: (id: string) => void
}

export function QuestionsPage({ questions, dataError, onOpenQuestion }: QuestionsPageProps) {
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [sortMode, setSortMode] = useState('default')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['technical', 'behavioral', 'system-design', 'management', 'hr', 'game-dev']))
  const [visibleCount, setVisibleCount] = useState(8)
  const feedSentinelRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const result = questions.filter((item) => {
      const companyMatch = activeCompany === 'Все компании' || item.companies.includes(activeCompany)
      const roleMatch = activeRole === 'Все роли' || item.roles.includes(activeRole)
      const topic = topicDefinitions.find((candidate) => candidate.id === activeTopic)
      const topicMatch = !topic || topic.categories.includes(item.category) || topic.terms.some((term) => item.title.toLocaleLowerCase('ru-RU').includes(term))
      const type = getQuestionType(item)
      if (!activeTypes.has(type)) return false
      return companyMatch && roleMatch && topicMatch
    })
    return result.sort((left, right) => {
      if (sortMode === 'difficulty-desc') return right.difficulty - left.difficulty
      if (sortMode === 'difficulty-asc') return left.difficulty - right.difficulty
      if (sortMode === 'company') return left.companies[0].localeCompare(right.companies[0], 'ru')
      if (sortMode === 'title') return left.title.localeCompare(right.title, 'ru')
      const frequency = (question: Question) => videoFrequency(question) + question.companies.filter((company) => company !== 'Несколько компаний').length
      const byFrequency = frequency(right) - frequency(left)
      if (byFrequency) return byFrequency
      return (Date.parse(right.publishedAt || '') || 0) - (Date.parse(left.publishedAt || '') || 0)
    })
  }, [activeCompany, activeRole, activeTopic, sortMode, activeTypes, questions])

  const companies = useMemo(() => companyOrder.map((name) => ({
    name,
    count: questions.filter((question) => question.companies.includes(name)).length,
    ...companyStyle(name),
  })).filter((company) => company.count > 0), [questions])

  const roles = useMemo(() => [...new Set(questions.flatMap((question) => question.roles))].sort((left, right) => left.localeCompare(right, 'ru')), [questions])
  const visibleQuestions = filtered.slice(0, visibleCount)

  useEffect(() => { setVisibleCount(8) }, [activeCompany, activeRole, activeTopic, sortMode, activeTypes])

  useEffect(() => {
    const sentinel = feedSentinelRef.current
    if (!sentinel || visibleCount >= filtered.length) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 8, filtered.length))
    }, { rootMargin: '240px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, filtered.length])

  const filterState = { activeCompany, activeRole, activeTopic, sortMode, activeTypes }

  return (
    <section className={s['question-section']} id="all-questions" style={{ paddingTop: '32px' }}>
      {dataError && <div className={s['status-note']}>{dataError}</div>}
          <div className={s['section-heading']}>
            <div>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
            <button
              className={s['hero-cta-lg']}
              style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)', boxShadow: 'none', fontSize: 13, padding: '10px 20px' }}
              onClick={() => exportQuestionsPDF(filtered as any[])}
            >
              <Printer size={16} style={{ marginRight: 6 }} /> Печать ({filtered.length})
            </button>
          </div>

      <QuestionFilters
        questions={questions}
        filterState={filterState}
        onChange={(partial) => {
          if ('activeCompany' in partial) setActiveCompany(partial.activeCompany!)
          if ('activeRole' in partial) setActiveRole(partial.activeRole!)
          if ('activeTopic' in partial) setActiveTopic(partial.activeTopic!)
          if ('sortMode' in partial) setSortMode(partial.sortMode!)
          if ('activeTypes' in partial) setActiveTypes(partial.activeTypes!)
        }}
      />

      <div className={s['question-grid']}>
        {dataError && <div className={s['empty-state']}><Search /><h3>База не отвечает</h3><p>{dataError}</p></div>}
        {visibleQuestions.map((question) => {
          const questionUrl = `/question/${question.id}`
          const openAction = onOpenQuestion
            ? { onClick: () => onOpenQuestion(question.id) }
            : { href: questionUrl }
          const Tag = onOpenQuestion ? 'article' : 'a'
          return (
            <Tag {...openAction as any} className={s['question-card']} key={question.id} style={{ cursor: 'pointer' }}>
              <div className={s['card-top']}>
                <div className={s['card-meta']}>
                  <div className={s['card-meta-row']}>
                    <span className={s.stage}>{question.stage}</span>
                    <span className={`${s.difficulty} ${question.difficulty <= 2 ? s.easy : question.difficulty <= 3 ? s.medium : s.hard}`}>
                      {question.difficulty <= 2 ? 'easy' : question.difficulty <= 3 ? 'medium' : 'hard'}
                    </span>
                  </div>
                  <div className={s['card-company']}>
                    {(() => {
                      const realCompanies = question.companies.filter(c => c !== 'Несколько компаний')
                      return realCompanies.length > 0 && (
                        <>
                          <span>{realCompanies.join(', ')}</span>
                          <div className={s['card-company-logos']}>
                            {realCompanies.map((c) => (
                              <span key={c} className="company-logo" style={{ background: companyStyle(c).color }}>{companyStyle(c).mark}</span>
                            ))}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
                <div className={s['card-left']}>
                  <h3>{question.title}</h3>
                  <p className={s['card-answer']}>{question.answer.slice(0, 120)}{question.answer.length > 120 ? '...' : ''}</p>
                  <div className={s.tags}>{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </div>
              <div className={s['card-footer']}>
                <span><Users size={15} /> {videoFrequency(question)} видео</span>
                <span>{formatDate(question.publishedAt) || (question.languages.length ? `${question.languages.length} языков` : 'Любой язык')}</span>
                {onOpenQuestion ? (
                  <button aria-label="Открыть вопрос" onClick={(e) => { e.stopPropagation(); onOpenQuestion(question.id); }}><ArrowRight size={18} /></button>
                ) : (
                  <span style={{ width: 40, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}><ArrowRight size={18} /></span>
                )}
              </div>
            </Tag>
          )
        })}
      </div>
      {!dataError && filtered.length === 0 && (
        <div className={s['empty-state']}><Search /><h3>Ничего не нашли</h3><p>Для выбранных фильтров пока нет вопросов.</p><button onClick={() => { setActiveCompany('Все компании'); setActiveRole('Все роли'); setActiveTopic('Все темы'); setActiveTypes(new Set(['technical', 'behavioral', 'system-design', 'hr', 'game-dev'])); setSortMode('default'); window.location.hash = 'all-questions' }}>Сбросить фильтры</button></div>
      )}
      {visibleCount < filtered.length && <div className={s['feed-sentinel']} ref={feedSentinelRef} aria-label="Загрузка следующих вопросов"><i /><i /><i /></div>}
      {filtered.length > 0 && visibleCount >= filtered.length && <div className={s['feed-end']}>Все вопросы загружены · {filtered.length}</div>}
    </section>
  )
}
