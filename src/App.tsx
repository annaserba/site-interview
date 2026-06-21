import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Menu,
  Search,
  Users,
  X,
} from 'lucide-react'
import { RagAssistant } from './RagAssistant'
import { QuestionDetail } from './QuestionDetail'
import { FilterDropdown } from './FilterDropdown'
import { fetchQuestions } from './dataClient'
import type { Question } from './types'

const companyStyles: Record<string, { mark: string; color: string }> = {
  'Яндекс': { mark: 'Я', color: '#ffcc00' },
  Ozon: { mark: 'O', color: '#1969ff' },
  Avito: { mark: 'A', color: '#9b4dff' },
  'Т-Банк': { mark: 'T', color: '#ffdc2d' },
  VK: { mark: 'VK', color: '#2787f5' },
  Wildberries: { mark: 'WB', color: '#a73afd' },
  Okko: { mark: 'OK', color: '#35d07f' },
  Сбер: { mark: 'С', color: '#21a038' },
  Гознак: { mark: 'Г', color: '#d6b05e' },
}

const companyStyle = (company: string) => companyStyles[company] || { mark: company.slice(0, 1), color: '#c9ff32' }

const companyOrder = ['Яндекс', 'Ozon', 'Avito', 'Т-Банк', 'VK', 'Wildberries', 'Okko', 'Сбер', 'Гознак']
const questionWord = (count: number) => count % 10 === 1 && count % 100 !== 11 ? 'вопрос' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'вопроса' : 'вопросов'
const videoFrequency = (question: Question) => question.videoFrequency ?? new Set(question.sources
  .filter((source) => source.type === 'youtube')
  .map((source) => {
    try { return new URL(source.url).searchParams.get('v') || source.url }
    catch { return source.url }
  })).size
const youtubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('youtu.be')
      ? parsed.pathname.split('/').filter(Boolean)[0] || ''
      : parsed.searchParams.get('v') || ''
  } catch { return '' }
}
const topicDefinitions = [
  { id: 'system-design', label: 'Системный дизайн', terms: ['architecture', 'архитектур', 'system design', 'distributed', 'scalability'] },
  { id: 'algorithms', label: 'Алгоритмы', terms: ['algorithm', 'алгоритм', 'complexity', 'сложность', 'data structures'] },
  { id: 'frontend', label: 'Frontend', terms: ['frontend', 'browser', 'javascript', 'typescript', 'react', 'css', 'web platform'] },
  { id: 'data-ml', label: 'Данные и ML', terms: ['machine learning', 'statistics', 'data ', 'analytics', 'sql', 'метрик'] },
  { id: 'behavioral', label: 'Карьера и команда', terms: ['behavioral', 'career', 'leadership', 'collaboration', 'mentoring'] },
]

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [sortMode, setSortMode] = useState('default')
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)
  const feedSentinelRef = useRef<HTMLDivElement>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')

  useEffect(() => {
    const controller = new AbortController()
    fetchQuestions(controller.signal)
      .then(setQuestions)
      .catch((error) => {
        if (error.name !== 'AbortError') setQuestions([])
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const readQuestionFromHash = () => setSelectedQuestionId(window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')
    window.addEventListener('hashchange', readQuestionFromHash)
    return () => window.removeEventListener('hashchange', readQuestionFromHash)
  }, [])

  const filtered = useMemo(() => {
    const result = questions.filter((item) => {
      const companyMatch = activeCompany === 'Все компании' || item.companies.includes(activeCompany)
      const roleMatch = activeRole === 'Все роли' || item.roles.includes(activeRole)
      const topic = topicDefinitions.find((candidate) => candidate.id === activeTopic)
      const topicText = `${item.category} ${item.tags.join(' ')}`.toLocaleLowerCase('ru-RU')
      const topicMatch = !topic || topic.terms.some((term) => topicText.includes(term))
      return companyMatch && roleMatch && topicMatch
    })
    return result.sort((left, right) => {
      if (sortMode === 'difficulty-desc') return right.difficulty - left.difficulty
      if (sortMode === 'difficulty-asc') return left.difficulty - right.difficulty
      if (sortMode === 'company') return left.companies[0].localeCompare(right.companies[0], 'ru')
      if (sortMode === 'title') return left.title.localeCompare(right.title, 'ru')
      return videoFrequency(right) - videoFrequency(left)
    })
  }, [activeCompany, activeRole, activeTopic, sortMode, questions])

  const companies = useMemo(() => companyOrder.map((name) => ({
    name,
    count: questions.filter((question) => question.companies.includes(name)).length,
    ...companyStyle(name),
  })).filter((company) => company.count > 0), [questions])

  const companyCount = useMemo(() => new Set(questions.flatMap((question) => question.companies).filter((company) => company !== 'Несколько компаний')).size, [questions])
  const videoStats = useMemo(() => {
    const uniqueVideos = new Set(questions.flatMap((question) => question.sources)
      .filter((source) => source.type === 'youtube')
      .map((source) => youtubeVideoId(source.url))
      .filter(Boolean)).size
    const questionsWithVideo = questions.filter((question) => videoFrequency(question) > 0).length
    const coverage = questions.length ? Math.round((questionsWithVideo / questions.length) * 100) : 0
    return { uniqueVideos, questionsWithVideo, coverage }
  }, [questions])
  const roles = useMemo(() => [...new Set(questions.flatMap((question) => question.roles))].sort((left, right) => left.localeCompare(right, 'ru')), [questions])
  const universalCount = questions.filter((question) => question.scope === 'universal').length
  const visibleQuestions = filtered.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(4)
  }, [activeCompany, activeRole, activeTopic, sortMode])

  useEffect(() => {
    const sentinel = feedSentinelRef.current
    if (!sentinel || visibleCount >= filtered.length) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 4, filtered.length))
    }, { rootMargin: '240px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, filtered.length])

  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId)
  const openQuestion = (id: string) => { window.location.hash = `question/${id}` }
  const closeQuestion = () => { window.location.hash = 'questions' }
  const filterFromFooter = (filter: 'topic' | 'role', value: string) => {
    if (filter === 'topic') setActiveTopic(value)
    if (filter === 'role') setActiveRole(value)
    window.location.hash = 'questions'
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="in.depth — на главную">
          <span className="brand-mark">i<span>/</span>d</span>
          <span>in.depth</span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a className="active" href="#questions" onClick={() => setMenuOpen(false)}>Вопросы</a>
          <a href="#companies" onClick={() => setMenuOpen(false)}>Компании</a>
          <a href="#rag" onClick={() => setMenuOpen(false)}>AI-поиск</a>
        </nav>
        <div className="header-actions">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        {selectedQuestion ? <QuestionDetail question={selectedQuestion} onBack={closeQuestion} /> : <>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse" /> {questions.length} вопросов в базе</div>
            <h1>Знай, что<br />тебя <em>спросят.</em></h1>
            <p>Вопросы компаний, короткие ответы и подробные разборы.</p>
            <RagAssistant variant="hero" />
          </div>

          <div className="hero-stats">
            <div><strong>{questions.length}</strong><span>вопросов в базе</span></div>
            <div><strong>{companyCount}</strong><span>компаний в данных</span></div>
            <div><strong>{universalCount}</strong><span>универсальный вопрос</span></div>
          </div>
        </section>

        <section className="company-strip" id="companies">
          <div className="company-strip-head">
            <div className="section-kicker">Компании в базе</div>
            <div className="video-infographic" aria-label="Статистика источников из видео">
              <div><strong>{videoStats.uniqueVideos}</strong><span>уникальных видео</span></div>
              <div><strong>{videoStats.questionsWithVideo}</strong><span>вопросов из видео</span></div>
              <div className="video-coverage">
                <span><b>{videoStats.coverage}%</b> базы подтверждено видео</span>
                <i><em style={{ width: `${videoStats.coverage}%` }} /></i>
              </div>
            </div>
          </div>
          <div className="company-row">
            {companies.map((company) => (
              <button
                className={activeCompany === company.name ? 'company-pill selected' : 'company-pill'}
                key={company.name}
                onClick={() => setActiveCompany(activeCompany === company.name ? 'Все компании' : company.name)}
              >
                <span className="company-logo" style={{ background: company.color }}>{company.mark}</span>
                <span><b>{company.name}</b><small>{company.count} {questionWord(company.count)}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="question-section" id="questions">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / БАЗА ЗНАНИЙ</span>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
            <div className="filters">
              <FilterDropdown label="Компания" value={activeCompany} onChange={setActiveCompany} options={[
                { value: 'Все компании', label: 'Все компании' },
                ...companies.map((company) => ({ value: company.name, label: company.name })),
              ]} />
              <FilterDropdown label="Роль" value={activeRole} onChange={setActiveRole} options={[
                { value: 'Все роли', label: 'Все роли' },
                ...roles.map((role) => ({ value: role, label: role })),
              ]} />
              <FilterDropdown label="Тема" value={activeTopic} onChange={setActiveTopic} options={[
                { value: 'Все темы', label: 'Все темы' },
                ...topicDefinitions.map((topic) => ({ value: topic.id, label: topic.label })),
              ]} />
              <FilterDropdown label="Сортировка" value={sortMode} onChange={setSortMode} options={[
                { value: 'default', label: 'По частоте в видео' },
                { value: 'difficulty-desc', label: 'Сложные сначала' },
                { value: 'difficulty-asc', label: 'Простые сначала' },
                { value: 'company', label: 'По компании' },
                { value: 'title', label: 'По названию' },
              ]} />
            </div>
          </div>

          <div className="question-grid">
            {visibleQuestions.map((question) => (
              <article className="question-card" key={question.id}>
                <div className="card-topline">
                  <div className="company-context">
                    <span className="company-logo" style={{ background: companyStyle(question.companies[0]).color }}>{companyStyle(question.companies[0]).mark}</span>
                    <span><b>{question.companies.join(', ')}</b><small>{question.roles[0]} · {question.level}</small></span>
                  </div>
                </div>
                <span className="stage">{question.stage}</span>
                <h3>{question.title}</h3>
                <div className="tags">{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="difficulty">
                  <span>Сложность</span>
                  <div>{[1, 2, 3, 4, 5].map((dot) => <i className={dot <= question.difficulty ? 'filled' : ''} key={dot} />)}</div>
                </div>
                <div className="card-footer">
                  <span><Users size={15} /> {videoFrequency(question)} видео</span>
                  <span>{question.languages.length ? `${question.languages.length} языков` : 'Любой язык'}</span>
                  <button aria-label="Открыть вопрос" onClick={() => openQuestion(question.id)}><ArrowRight size={18} /></button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><Search /><h3>Ничего не нашли</h3><p>Для выбранных фильтров пока нет вопросов.</p><button onClick={() => { setActiveCompany('Все компании'); setActiveRole('Все роли'); setActiveTopic('Все темы') }}>Сбросить фильтры</button></div>
          )}
          {visibleCount < filtered.length && <div className="feed-sentinel" ref={feedSentinelRef} aria-label="Загрузка следующих вопросов"><i /><i /><i /></div>}
          {filtered.length > 0 && visibleCount >= filtered.length && <div className="feed-end">Все вопросы загружены · {filtered.length}</div>}
        </section>
        </>}
      </main>

      <footer>
        <div className="footer-intro">
          <div className="brand"><span className="brand-mark">i<span>/</span>d</span><span>in.depth</span></div>
          <p>Сложные интервью становятся понятнее.</p>
        </div>
        <div className="footer-nav">
          <div><b>Темы</b>{topicDefinitions.map((topic) => <button key={topic.id} onClick={() => filterFromFooter('topic', topic.id)}>{topic.label}</button>)}</div>
          <div><b>Роли</b>{roles.map((role) => <button key={role} onClick={() => filterFromFooter('role', role)}>{role}</button>)}</div>
        </div>
        <span>© 2026 in.depth</span>
      </footer>
    </div>
  )
}

export default App
