import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, LogOut, Menu, Moon, Search, Sun, Users, X } from 'lucide-react'
import { ChatBot } from './ChatBot'
import { QuestionDetail } from './QuestionDetail'
import { QuestionsPage } from './QuestionsPage'
import { MockInterview } from './MockInterview'
import type { Question } from './types'
import { questionTypeDefinitions } from './filters'
import { fetchQuestions, fetchCurrentUser, loginWithYandex, logout, type User } from './api'
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

type ThemeMode = 'dark' | 'light'
const readInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('in-depth:theme')
  return stored === 'light' || stored === 'dark' ? stored : 'dark'
}
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
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme)
  const [dataError, setDataError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')
  const [showMockInterview, setShowMockInterview] = useState(() => window.location.hash === '#mock-interview')
  const [showAllQuestions, setShowAllQuestions] = useState(() => window.location.hash === '#all-questions')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('in-depth:theme', theme)
  }, [theme])

  useEffect(() => {
    fetchQuestions({ limit: 500 })
      .then((data) => {
        const mapped = data.questions.map((q) => ({
          id: q.id,
          title: q.title,
          aliases: q.aliases || [],
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
          scope: q.scope || 'universal',
          videoFrequency: q.video_frequency ?? 0,
          publishedAt: q.published_at || undefined,
        })) as Question[]
        setQuestions(mapped)
      })
      .catch(() => setDataError('База вопросов сейчас недоступна. Проверьте API и Postgres.'))
  }, [])

  const applyHashFilters = (hash: string) => {
    const path = hash.replace(/^#/, '')
    setAuthNotice('')
    if (path === 'auth-config-required') {
      setAuthNotice('Вход через Яндекс почти готов: нужно добавить YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET и redirect URI на сервере.')
      setSelectedQuestionId('')
      setShowMockInterview(false)
      setShowAllQuestions(false)
      return
    }
    if (path === 'auth-error') {
      setAuthNotice('Яндекс не вернул доступ. Попробуйте войти ещё раз.')
      setSelectedQuestionId('')
      setShowMockInterview(false)
      setShowAllQuestions(false)
      return
    }
    if (path === 'mock-interview') { setShowMockInterview(true); setSelectedQuestionId(''); setShowAllQuestions(false); return }
    setShowMockInterview(false)
    if (path === 'all-questions') { setShowAllQuestions(true); setSelectedQuestionId(''); return }
    setShowAllQuestions(false)
    if (path.startsWith('question/')) { setSelectedQuestionId(path.slice(9)); return }
    setSelectedQuestionId('')
  }

  useEffect(() => {
    const readHash = () => applyHashFilters(window.location.hash)
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  const filtered = useMemo(() => {
    const frequency = (question: Question) => videoFrequency(question) + question.companies.filter((company) => company !== 'Несколько компаний').length
    return [...questions].sort((left, right) => {
      const byFrequency = frequency(right) - frequency(left)
      if (byFrequency) return byFrequency
      return (Date.parse(right.publishedAt || '') || 0) - (Date.parse(left.publishedAt || '') || 0)
    })
  }, [questions])

  const companyCount = useMemo(() => new Set(questions.flatMap((question) => question.companies).filter((company) => company !== 'Несколько компаний')).size, [questions])
  const youtubeVideos = useMemo(() => {
    const videos = new Map<string, {
      id: string
      url: string
      company: string
      publishedAt?: string
      questionIds: Set<string>
      titles: string[]
    }>()

    for (const question of questions) {
      for (const source of question.sources) {
        if (source.type !== 'youtube') continue
        const id = youtubeVideoId(source.url)
        if (!id) continue
        if (!videos.has(id)) {
          videos.set(id, {
            id,
            url: source.url,
            company: source.company || question.companies.find((company) => company !== 'Несколько компаний') || 'YouTube',
            publishedAt: source.publishedAt || question.publishedAt,
            questionIds: new Set(),
            titles: [],
          })
        }
        const video = videos.get(id)
        if (!video) continue
        video.questionIds.add(question.id)
        if (!video.titles.includes(question.title)) video.titles.push(question.title)
        if (!video.publishedAt && (source.publishedAt || question.publishedAt)) video.publishedAt = source.publishedAt || question.publishedAt
      }
    }

    return [...videos.values()].sort((left, right) => right.questionIds.size - left.questionIds.size)
  }, [questions])
  const universalCount = questions.filter((question) => question.scope === 'universal').length

  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId)
  const openQuestion = (id: string) => { window.location.hash = `question/${id}` }
  const closeQuestion = () => { window.location.hash = 'questions' }
  const navigateTopic = (topicId: string) => { window.location.hash = topicId ? `topic/${topicId}` : 'questions' }

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
          <a href="#all-questions" onClick={() => setMenuOpen(false)}>Вопросы</a>
          <a href="#mock-interview" onClick={() => setMenuOpen(false)}>Мок-интервью</a>
        </nav>
        <div className={s['header-actions']}>
          <button
            className={s['theme-toggle']}
            type="button"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <div className={s['user-menu']}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className={s['user-avatar']} />
              ) : (
                <div className={s['user-avatar-placeholder']}>{user.displayName[0]}</div>
              )}
              <span className={s['user-name']}>{user.displayName}</span>
              <button className={s['auth-btn-logout']} onClick={logout} title="Выйти">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className={s['auth-btn']} onClick={loginWithYandex} aria-label="Войти через Яндекс">
              <span className={s['yandex-mark']} aria-hidden="true">Я</span>
              <span>Войти через Яндекс</span>
            </button>
          )}
          <button className={s['menu-button']} onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        {showMockInterview ? <MockInterview onBack={() => window.location.hash = 'questions'} /> :
         showAllQuestions ? <QuestionsPage onOpenQuestion={openQuestion} /> :
         selectedQuestion ? <QuestionDetail question={selectedQuestion} onBack={closeQuestion} /> : <>
        <section className={s.hero}>
          <div className={s['hero-copy']}>
            <h1>Знай, что тебя <em>спросят.</em></h1>
            <p>Вопросы компаний, короткие ответы и подробные разборы.</p>
            <a href="#mock-interview" className={s['hero-cta']}>Практиковаться <ArrowRight /></a>
          </div>
        </section>

        <section className={s['question-section']} id="questions">
          {authNotice && <div className={s['status-note']}>{authNotice}</div>}
          <div className={s['section-heading']}>
            <div>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
            <a href="#all-questions" className={s['hero-cta-lg']}>
              Все вопросы <ArrowRight size={18} />
            </a>
          </div>

          <div className={s['question-grid']}>
            {dataError && <div className={s['empty-state']}><Search /><h3>База не отвечает</h3><p>{dataError}</p></div>}
            {filtered.slice(0, 6).map((question) => (
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
                  <span>{formatDate(question.publishedAt) || (question.languages.length ? `${question.languages.length} языков` : 'Любой язык')}</span>
                  <button aria-label="Открыть вопрос" onClick={(e) => { e.stopPropagation(); openQuestion(question.id); }}><ArrowRight size={18} /></button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && !dataError && (
            <div className={s['empty-state']}><Search /><h3>Ничего не нашли</h3><p>Попробуйте зайти позже.</p></div>
          )}
        </section>

        {youtubeVideos.length > 0 && (
          <section className={s['youtube-section']} id="videos">
            <div className={s['section-heading']}>
              <div>
                <h2>Видео-интервью</h2>
                <p>Реальные записи, из которых собраны вопросы и senior-разборы</p>
              </div>
              <div className={s['youtube-total']}>
                <strong>{youtubeVideos.length}</strong>
                <span>{youtubeVideos.length === 1 ? 'видео' : 'видео'}</span>
              </div>
            </div>

            <div className={s['youtube-grid']}>
              {youtubeVideos.map((video) => (
                <article className={s['youtube-card']} key={video.id}>
                  <div className={s['youtube-preview']}>
                    <span className={s['youtube-play']} aria-hidden="true" />
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className={s['youtube-card-body']}>
                    <div className={s['youtube-meta']}>
                      <span>{video.company}</span>
                      {video.publishedAt && <small>{formatDate(video.publishedAt)}</small>}
                    </div>
                    <h3>{video.company === 'Frontend-интервью' ? 'Frontend-интервью' : `Собеседование ${video.company}`}</h3>
                    <p>{video.questionIds.size} {questionWord(video.questionIds.size)} из этого видео</p>
                    <div className={s['youtube-topics']}>
                      {video.titles.slice(0, 3).map((title) => <span key={title}>{title}</span>)}
                    </div>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      Смотреть на YouTube <ArrowRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        </>}
      </main>

      <footer>
        <div className={s['footer-intro']}>
          <div className="brand"><span className="brand-mark">i<span>/</span>d</span><span>in.depth</span></div>
          <p>Сложные интервью становятся понятнее.</p>
        </div>
        <div className={s['footer-nav']}>
          <div><b>Темы</b>{topicDefinitions.map((topic) => <button key={topic.id} onClick={() => navigateTopic(topic.id)}>{topic.label}</button>)}</div>
          <div><b>Типы</b>{questionTypeDefinitions.map((type) => <button key={type.id} onClick={() => window.location.hash = `all-questions`}>{type.label}</button>)}</div>
        </div>
        <span>© 2026 in.depth</span>
      </footer>
      <ChatBot />
    </div>
  )
}

export default App
