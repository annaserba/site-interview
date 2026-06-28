import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu, Search, Users, X } from 'lucide-react'
import { ChatBot } from './ChatBot'
import { QuestionDetail } from './QuestionDetail'
import { FilterDropdown } from './FilterDropdown'
import { MockInterview } from './MockInterview'
import type { Question } from './types'
import { questionTypeDefinitions, companyOrder, getQuestionType } from './filters'
import { fetchQuestions } from './api'
import s from './App.module.css'
import questionsData from './data/questions.json'

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
  { id: 'algorithms', label: 'Алгоритмы', categories: ['Algorithms', 'C++', 'Concurrency'], terms: ['algorithm', 'алгоритм', 'complexity', 'сложность', 'data structures'] },
  { id: 'frontend', label: 'Frontend', categories: ['JavaScript', 'TypeScript', 'React', 'CSS', 'Browser', 'Browser Performance', 'Web Platform', 'Frontend Architecture'], terms: ['frontend', 'browser', 'react', 'css'] },
  { id: 'data-ml', label: 'Данные и ML', categories: ['Machine Learning', 'Statistics', 'Data Analytics', 'Data Engineering', 'Data Quality', 'Product Analytics', 'Experimentation', 'BI'], terms: ['machine learning', 'statistics', 'data ', 'analytics', 'sql', 'метрик'] },
  { id: 'arch', label: 'Архитектура', categories: ['System Design', 'Web Architecture', 'Frontend Architecture'], terms: ['system design', 'architecture'] },
  { id: 'backend', label: 'Backend', categories: ['Java', 'Kotlin', 'Python', 'Concurrency', 'Go', 'C++'], terms: ['java', 'kotlin', 'python', 'concurrency', 'go', 'c++'] },
  { id: 'delivery', label: 'Процессы', categories: ['Delivery', 'Performance'], terms: ['delivery'] },
  { id: 'gamedev', label: 'Game Dev', categories: ['Game Development'], terms: ['unreal', 'game'] },
]

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [sortMode, setSortMode] = useState('default')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['technical', 'behavioral', 'system-design', 'hr', 'game-dev']))
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)
  const feedSentinelRef = useRef<HTMLDivElement>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')
  const [showMockInterview, setShowMockInterview] = useState(() => window.location.hash === '#mock-interview')

  useEffect(() => {
    fetchQuestions({ limit: 500 })
      .then((data) => {
        const mapped = data.questions.map((q) => ({
          id: q.id,
          title: q.title,
          category: q.category || 'Technical',
          stage: q.stage || 'Technical',
          difficulty: q.difficulty,
          answer: q.answer || '',
          context: q.context || '',
          companies: q.companies || [],
          roles: q.roles || [],
          tags: q.tags || [],
          languages: q.languages || [],
          level: q.level || 'Middle',
          duration: q.duration || '10 мин',
          keyPoints: q.key_points || [],
          pitfalls: q.pitfalls || [],
          followUps: q.follow_ups || [],
          exampleAnswer: q.example_answer || '',
          codeSnippet: q.code_snippet || null,
          codeLanguage: q.code_language || null,
          sources: q.sources || [],
          sourceType: q.source_type || 'aggregated',
          scope: 'universal',
          videoFrequency: 0,
        })) as Question[]
        setQuestions(mapped)
      })
      .catch(() => {
        setQuestions(questionsData as Question[])
      })
  }, [])

  const applyHashFilters = (hash: string) => {
    const path = hash.replace(/^#/, '')
    if (path === 'mock-interview') { setShowMockInterview(true); setSelectedQuestionId(''); return }
    setShowMockInterview(false)
    if (path.startsWith('question/')) { setSelectedQuestionId(path.slice(9)); return }
    setSelectedQuestionId('')
    if (path.startsWith('topic/')) {
      const topicId = path.slice(6)
      if (topicDefinitions.some((t) => t.id === topicId)) {
        setActiveTopic(topicId); setActiveCompany('Все компании'); setActiveRole('Все роли'); return
      }
    }
    if (path.startsWith('type/')) {
      const typeId = path.slice(5)
      if (questionTypeDefinitions.some((t) => t.id === typeId)) {
        setActiveTypes(new Set([typeId])); setActiveTopic('Все темы'); setActiveCompany('Все компании'); setActiveRole('Все роли'); return
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
    if (path === 'questions' || path === '') {
      setActiveCompany('Все компании'); setActiveTopic('Все темы'); setActiveRole('Все роли'); return
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
      return frequency(right) - frequency(left)
    })
  }, [activeCompany, activeRole, activeTopic, sortMode, activeTypes, questions])

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

  useEffect(() => { setVisibleCount(4) }, [activeCompany, activeRole, activeTopic, sortMode, activeTypes])

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
          <a href="#mock-interview" onClick={() => setMenuOpen(false)}>Мок-интервью</a>
        </nav>
        <div className={s['header-actions']}>
          <button className={s['menu-button']} onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        {showMockInterview ? <MockInterview onBack={() => window.location.hash = 'questions'} /> :
         selectedQuestion ? <QuestionDetail question={selectedQuestion} onBack={closeQuestion} /> : <>
        <section className={s.hero}>
          <div className={s['hero-copy']}>
            <h1>Знай, что тебя <em>спросят.</em></h1>
            <p>Вопросы компаний, короткие ответы и подробные разборы.</p>
            <a href="#mock-interview" className={s['hero-cta']}>Практиковаться <ArrowRight /></a>
          </div>
        </section>

        <section className={s['question-section']} id="questions">
          <div className={s['section-heading']}>
            <div>
              <span className="section-index">01 / БАЗА ЗНАНИЙ</span>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
          </div>

          <div className={s['company-row']}>
            <button className={`${s['company-pill']} ${activeCompany === 'Все компании' ? s.selected : ''}`}
              onClick={() => navigateCompany('Все компании')}>
              <span><b>Все</b></span>
            </button>
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
                    <p className={s['card-answer']}>{question.answer.slice(0, 120)}{question.answer.length > 120 ? '...' : ''}</p>
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
            <div className={s['empty-state']}><Search /><h3>Ничего не нашли</h3><p>Для выбранных фильтров пока нет вопросов.</p><button onClick={() => { setActiveCompany('Все компании'); setActiveRole('Все роли'); setActiveTopic('Все темы'); setActiveTypes(new Set(['technical', 'behavioral', 'system-design', 'hr', 'game-dev'])); setSortMode('default'); window.location.hash = 'questions' }}>Сбросить фильтры</button></div>
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
          <div><b>Темы</b>{topicDefinitions.map((topic) => <button key={topic.id} onClick={() => navigateTopic(topic.id)}>{topic.label}</button>)}</div>
          <div><b>Типы</b>{questionTypeDefinitions.map((type) => <button key={type.id} onClick={() => { setActiveTypes(prev => { const next = new Set(prev); if (next.has(type.id)) next.delete(type.id); else next.add(type.id); return next }); window.location.hash = 'questions' }} style={activeTypes.has(type.id) ? {} : { opacity: 0.4 }}>{type.label}</button>)}</div>
          <div><b>Роли</b>{roles.map((role) => <button key={role} onClick={() => navigateRole(role)}>{role}</button>)}</div>
        </div>
        <span>© 2026 in.depth</span>
      </footer>
      <ChatBot />
    </div>
  )
}

export default App
