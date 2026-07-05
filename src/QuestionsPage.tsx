import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Search, Users } from 'lucide-react'
import { FilterDropdown } from './FilterDropdown'
import type { Question } from './types'
import { questionTypeDefinitions, companyOrder, getQuestionType, topicDefinitions } from './filters'
import { fetchQuestions, mapQuestion } from './api'
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
  onOpenQuestion: (id: string) => void
}

export function QuestionsPage({ onOpenQuestion }: QuestionsPageProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [sortMode, setSortMode] = useState('default')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['technical', 'behavioral', 'system-design', 'hr', 'game-dev']))
  const [visibleCount, setVisibleCount] = useState(8)
  const [dataError, setDataError] = useState('')
  const feedSentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load pre-baked SSG data instantly
    fetch('/data/questions.json')
      .then(res => res.json())
      .then((data) => setQuestions(data.map(mapQuestion)))
      .catch(() => setDataError('База вопросов сейчас недоступна.'))

    // Try API in background for fresher data (only if it returns actual data)
    fetchQuestions({ limit: 500 })
      .then((data) => { if (data.questions.length) setQuestions(data.questions.map(mapQuestion)) })
      .catch(() => {})
  }, [])

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

  const navigateCompany = (company: string) => { window.location.hash = company !== 'Все компании' ? `company/${encodeURIComponent(company)}` : 'all-questions' }
  const navigateRole = (role: string) => { window.location.hash = role !== 'Все роли' ? `role/${encodeURIComponent(role)}` : 'all-questions' }

  return (
    <section className={s['question-section']} id="all-questions" style={{ paddingTop: '32px' }}>
      {dataError && <div className={s['status-note']}>{dataError}</div>}
          <div className={s['section-heading']}>
            <div>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
          </div>

      <div className={s['company-row']}>
        {companies.map((company) => (
          <button
            className={`${s['company-pill']} ${activeCompany === company.name ? s.selected : ''}`}
            key={company.name}
            onClick={() => navigateCompany(activeCompany === company.name ? 'Все компании' : company.name)}
          >
            <span className="company-logo" style={{ background: company.color }}>{company.mark}</span>
            <span><b>{company.name}</b><small>{company.count} {questionWord(company.count)}</small></span>
          </button>
        ))}
      </div>

      <div className={s.filters}>
        <div className={s['filters-row']}>
          <FilterDropdown label="Роль" value={activeRole} onChange={setActiveRole} options={[
            { value: 'Все роли', label: 'Все роли' },
            ...roles.map((role) => ({ value: role, label: role })),
          ]} />
          <FilterDropdown label="Тема" value={activeTopic} onChange={setActiveTopic} options={[
            { value: 'Все темы', label: 'Все темы' },
            ...topicDefinitions.map((topic) => ({ value: topic.id, label: topic.label })),
          ]} />
          <FilterDropdown label="Сортировка" value={sortMode} onChange={setSortMode} options={[
            { value: 'default', label: 'По частоте' },
            { value: 'difficulty-desc', label: 'Сложные' },
            { value: 'difficulty-asc', label: 'Простые' },
            { value: 'company', label: 'По компании' },
            { value: 'title', label: 'По названию' },
          ]} />
        </div>
        <div className={s['filters-row']}>
          <div className={s['type-pills']}>
            <span className={s['type-label']}>Тип</span>
            {questionTypeDefinitions.map((type) => (
              <button key={type.id} className={`${s['type-pill']} ${activeTypes.has(type.id) ? s.active : ''}`}
                onClick={() => { setActiveTypes(prev => { const next = new Set(prev); if (next.has(type.id)) next.delete(type.id); else next.add(type.id); return next }) }}>
                {type.label}
              </button>
            ))}
            <button className={s['type-pill-select']} onClick={() => { setActiveTypes(prev => prev.size === questionTypeDefinitions.length ? new Set() : new Set(questionTypeDefinitions.map(t => t.id))) }}>
              {activeTypes.size === questionTypeDefinitions.length ? 'Снять все' : 'Все'}
            </button>
          </div>
        </div>
      </div>

      <div className={s['question-grid']}>
        {dataError && <div className={s['empty-state']}><Search /><h3>База не отвечает</h3><p>{dataError}</p></div>}
        {visibleQuestions.map((question) => (
          <article className={s['question-card']} key={question.id} onClick={() => onOpenQuestion(question.id)} style={{ cursor: 'pointer' }}>
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
              <button aria-label="Открыть вопрос" onClick={(e) => { e.stopPropagation(); onOpenQuestion(question.id); }}><ArrowRight size={18} /></button>
            </div>
          </article>
        ))}
      </div>
      {!dataError && filtered.length === 0 && (
        <div className={s['empty-state']}><Search /><h3>Ничего не нашли</h3><p>Для выбранных фильтров пока нет вопросов.</p><button onClick={() => { setActiveCompany('Все компании'); setActiveRole('Все роли'); setActiveTopic('Все темы'); setActiveTypes(new Set(['technical', 'behavioral', 'system-design', 'hr', 'game-dev'])); setSortMode('default'); window.location.hash = 'all-questions' }}>Сбросить фильтры</button></div>
      )}
      {visibleCount < filtered.length && <div className={s['feed-sentinel']} ref={feedSentinelRef} aria-label="Загрузка следующих вопросов"><i /><i /><i /></div>}
      {filtered.length > 0 && visibleCount >= filtered.length && <div className={s['feed-end']}>Все вопросы загружены · {filtered.length}</div>}
    </section>
  )
}
