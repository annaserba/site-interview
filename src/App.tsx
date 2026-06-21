import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu, Search, Users, X } from 'lucide-react'
import { ChatBot } from './ChatBot'
import { QuestionDetail } from './QuestionDetail'
import { FilterDropdown } from './FilterDropdown'
import { fetchQuestions } from './dataClient'
import type { Question } from './types'
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
  { id: 'algorithms', label: 'Алгоритмы', terms: ['algorithm', 'алгоритм', 'complexity', 'сложность', 'data structures'] },
  { id: 'frontend', label: 'Frontend', terms: ['frontend', 'browser', 'javascript', 'typescript', 'react', 'css', 'web platform'] },
  { id: 'data-ml', label: 'Данные и ML', terms: ['machine learning', 'statistics', 'data ', 'analytics', 'sql', 'метрик'] },
]

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [sortMode, setSortMode] = useState('default')
  const [showBehavioral, setShowBehavioral] = useState(true)
  const [showSystemDesign, setShowSystemDesign] = useState(true)
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

  const applyHashFilters = (hash: string) => {
    const path = hash.replace(/^#/, '')
    if (path.startsWith('question/')) { setSelectedQuestionId(path.slice(9)); return }
    setSelectedQuestionId('')
    if (path.startsWith('topic/')) {
      const topicId = path.slice(6)
      if (topicDefinitions.some((t) => t.id === topicId)) {
        setActiveTopic(topicId); setActiveCompany('Все компании'); setActiveRole('Все роли'); return
      }
    }
    if (path.startsWith('company/')) {
      const name = decodeURIComponent(path.slice(8))
      if (companyOrder.includes(name)) {
        setActiveCompany(name); setActiveTopic('Все темы'); setActiveRole('Все роли'); return
      }
    }
    if (path.startsWith('role/')) {
      setActiveRole(decodeURIComponent(path.slice(5))); setActiveTopic('Все темы'); setActiveCompany('Все компании'); return
    }
  }

  useEffect(() => {
    const readHash = () => applyHashFilters(window.location.hash)
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  const filtered = useMemo(() => {
    const result = questions.filter((item) => {
      const companyMatch = activeCompany === 'Все компании' || item.companies.includes(activeCompany)
      const roleMatch = activeRole === 'Все роли' || item.roles.includes(activeRole)
      const topic = topicDefinitions.find((candidate) => candidate.id === activeTopic)
      const topicText = `${item.category} ${item.tags.join(' ')}`.toLocaleLowerCase('ru-RU')
      const topicMatch = !topic || topic.terms.some((term) => topicText.includes(term))
      const isBehavioral = item.category === 'Behavioral'
      const isSystemDesign = /architecture|архитектур|system design|distributed|scalability/i.test(`${item.category} ${item.tags.join(' ')}`)
      if (isBehavioral) return companyMatch && roleMatch && showBehavioral
      if (isSystemDesign) return companyMatch && roleMatch && showSystemDesign
      return companyMatch && roleMatch && topicMatch
    })
    return result.sort((left, right) => {
      if (sortMode === 'difficulty-desc') return right.difficulty - left.difficulty
      if (sortMode === 'difficulty-asc') return left.difficulty - right.difficulty
      if (sortMode === 'company') return left.companies[0].localeCompare(right.companies[0], 'ru')
      if (sortMode === 'title') return left.title.localeCompare(right.title, 'ru')
      const frequency = (question: Question) => videoFrequency(question) + question.companies.filter((company) => company !== 'Несколько компаний').length
      return frequency(right) - frequency(left)
    })
  }, [activeCompany, activeRole, activeTopic, sortMode, showBehavioral, showSystemDesign, questions])

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

  useEffect(() => { setVisibleCount(4) }, [activeCompany, activeRole, activeTopic, sortMode, showBehavioral, showSystemDesign])

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
  const navigateTopic = (topicId: string) => { window.location.hash = topicId ? `topic/${topicId}` : 'questions' }
  const navigateCompany = (company: string) => { window.location.hash = company !== 'Все компании' ? `company/${encodeURIComponent(company)}` : 'questions' }
  const navigateRole = (role: string) => { window.location.hash = role !== 'Все роли' ? `role/${encodeURIComponent(role)}` : 'questions' }

  return (
    <div className={s['app-shell']}>
      <header className={s.topbar}>
        <a className="brand" href="#top" aria-label="in.depth — на главную">
          <span className="brand-mark">i<span>/</span>d</span>
          <span>in.depth</span>
        </a>
        <div className={s['header-stats']}>
          <span><strong>{questions.length}</strong> <small>вопросов</small></span>
          <span><strong>{companyCount}</strong> <small>компаний</small></span>
          <span><strong>{universalCount}</strong> <small>универс.</small></span>
        </div>
        <nav className={`${s['nav-links']} ${menuOpen ? s.open : ''}`}>
          <a href="#questions" onClick={() => setMenuOpen(false)}>Вопросы</a>
          <a href="#companies" onClick={() => setMenuOpen(false)}>Компании</a>
        </nav>
        <div className={s['header-actions']}>
          <button className={s['menu-button']} onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        {selectedQuestion ? <QuestionDetail question={selectedQuestion} onBack={closeQuestion} /> : <>
        <section className={s.hero}>
          <div className={s['hero-copy']}>
            <h1>Знай, что тебя <em>спросят.</em></h1>
            <p>Вопросы компаний, короткие ответы и подробные разборы.</p>
          </div>
        </section>

        <section className={s['company-strip']} id="companies">
          <div className={s['company-strip-head']}>
            <div className="section-kicker">Компании в базе</div>
            <div className={s['video-infographic']} aria-label="Статистика источников из видео">
              <div><strong>{videoStats.uniqueVideos}</strong><span>уникальных видео</span></div>
              <div><strong>{videoStats.questionsWithVideo}</strong><span>вопросов из видео</span></div>
              <div className={s['video-coverage']}>
                <span><b>{videoStats.coverage}%</b> базы подтверждено видео</span>
                <i><em style={{ width: `${videoStats.coverage}%` }} /></i>
              </div>
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
        </section>

        <section className={s['question-section']} id="questions">
          <div className={s['section-heading']}>
            <div>
              <span className="section-index">01 / БАЗА ЗНАНИЙ</span>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
            <div className={s.filters}>
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
                { value: 'default', label: 'По частоте (компании + видео)' },
                { value: 'difficulty-desc', label: 'Сложные сначала' },
                { value: 'difficulty-asc', label: 'Простые сначала' },
                { value: 'company', label: 'По компании' },
                { value: 'title', label: 'По названию' },
              ]} />
              <FilterDropdown label="Тип вопросов" value="" multiple
                selected={[...(showSystemDesign ? ['system-design'] : []), ...(showBehavioral ? ['behavioral'] : [])]}
                onToggle={(val) => {
                  if (val === 'system-design') setShowSystemDesign(!showSystemDesign)
                  if (val === 'behavioral') setShowBehavioral(!showBehavioral)
                }}
                options={[
                  { value: 'system-design', label: 'Системный дизайн' },
                  { value: 'behavioral', label: 'Карьера и команда' },
                ]} />
            </div>
          </div>

          <div className={s['question-grid']}>
            {visibleQuestions.map((question) => (
              <article className={s['question-card']} key={question.id} onClick={() => openQuestion(question.id)} style={{ cursor: 'pointer' }}>
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
                    <div className={s.tags}>{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                </div>
                <div className={s['card-footer']}>
                  <span><Users size={15} /> {videoFrequency(question)} видео</span>
                  <span>{question.languages.length ? `${question.languages.length} языков` : 'Любой язык'}</span>
                  <button aria-label="Открыть вопрос" onClick={(e) => { e.stopPropagation(); openQuestion(question.id); }}><ArrowRight size={18} /></button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className={s['empty-state']}><Search /><h3>Ничего не нашли</h3><p>Для выбранных фильтров пока нет вопросов.</p><button onClick={() => { setActiveCompany('Все компании'); setActiveRole('Все роли'); setActiveTopic('Все темы'); setShowBehavioral(true); setShowSystemDesign(true); window.location.hash = 'questions' }}>Сбросить фильтры</button></div>
          )}
          {visibleCount < filtered.length && <div className={s['feed-sentinel']} ref={feedSentinelRef} aria-label="Загрузка следующих вопросов"><i /><i /><i /></div>}
          {filtered.length > 0 && visibleCount >= filtered.length && <div className={s['feed-end']}>Все вопросы загружены · {filtered.length}</div>}
        </section>
        </>}
      </main>

      <footer>
        <div className={s['footer-intro']}>
          <div className="brand"><span className="brand-mark">i<span>/</span>d</span><span>in.depth</span></div>
          <p>Сложные интервью становятся понятнее.</p>
        </div>
        <div className={s['footer-nav']}>
          <div><b>Темы</b>{topicDefinitions.map((topic) => <button key={topic.id} onClick={() => navigateTopic(topic.id)}>{topic.label}</button>)}<button onClick={() => { setShowSystemDesign(!showSystemDesign); window.location.hash = 'questions' }} style={showSystemDesign ? {} : { opacity: 0.4 }}>Системный дизайн</button><button onClick={() => { setShowBehavioral(!showBehavioral); window.location.hash = 'questions' }} style={showBehavioral ? {} : { opacity: 0.4 }}>Карьера и команда</button></div>
          <div><b>Роли</b>{roles.map((role) => <button key={role} onClick={() => navigateRole(role)}>{role}</button>)}</div>
        </div>
        <span>© 2026 in.depth</span>
      </footer>
      <ChatBot />
    </div>
  )
}

export default App
