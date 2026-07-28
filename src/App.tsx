import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Clock, Layers3, LogOut, Menu, Moon, Search, Sun, Tag, Users, X } from 'lucide-react'
import { ChatBot } from './ChatBot'
import { QuestionDetail } from './QuestionDetail'
import { QuestionsPage } from './QuestionsPage'
import { MockInterview } from './MockInterview'
import { RoadmapsPage } from './RoadmapsPage'
import { ChecklistPage } from './ChecklistPage'
import { ProfilePage } from './ProfilePage'
import { BlogPage } from './BlogPage'
import { ArticlePage } from './ArticlePage'
import { PrivacyPage } from './PrivacyPage'
import { CookieConsent } from './CookieConsent'
import { YtThumb } from './YtThumb'
import { CompanyLogo } from './CompanyLogo'
import { blogArticles } from './blog-articles'
import questionsData from './data/questions.json'
import type { Question } from './types'
import { questionTypeDefinitions, topicDefinitions } from './filters'
import { fetchQuestions, fetchCurrentUser, loginWithYandex, logout, mapQuestion, type User } from './api'
import { safeGetItem, safeSetItem } from './safeStorage'
import s from './App.module.css'

const questionWord = (count: number) => count % 10 === 1 && count % 100 !== 11 ? 'вопрос' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'вопроса' : 'вопросов'

type ThemeMode = 'dark' | 'light'
const readInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark'
  const stored = safeGetItem('in-depth:theme')
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

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [staticStats, setStaticStats] = useState<{ totalQuestions: number; companyCount: number; universalCount: number } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme)
  const [dataError, setDataError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')
  const [showMockInterview, setShowMockInterview] = useState(() => window.location.hash === '#mock-interview' || window.location.hash === '#design-session')
  const [mockFormat, setMockFormat] = useState<'mixed' | 'design' | undefined>(() => window.location.hash === '#design-session' ? 'design' : undefined)
  const [showChecklist, setShowChecklist] = useState(() => window.location.hash === '#checklist')
  const [showRoadmaps, setShowRoadmaps] = useState(() => window.location.hash === '#roadmaps')
  const [showAllQuestions, setShowAllQuestions] = useState(() => window.location.hash === '#all-questions')
  const [showProfile, setShowProfile] = useState(() => window.location.hash === '#profile')
  const [showBlog, setShowBlog] = useState(() => window.location.hash === '#blog')
  const [showPrivacy, setShowPrivacy] = useState(() => window.location.hash === '#privacy')
  const [selectedArticleId, setSelectedArticleId] = useState(() => window.location.hash.startsWith('#article/') ? window.location.hash.slice(10) : '')
  const [initialTopic, setInitialTopic] = useState(() => window.location.hash.startsWith('#topic/') ? window.location.hash.slice(7) : '')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeSetItem('in-depth:theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/stats.json')
      .then((r) => r.json())
      .then((stats) => {
        setStaticStats(stats)
        setQuestionsLoaded(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Questions baked at build time (SSG)
    setQuestions((questionsData as any[]).map(mapQuestion))

    // Try API in background for fresher data (only if it returns actual data)
    fetchQuestions({ limit: 500 })
      .then((data) => { if (data.questions.length) setQuestions(data.questions.map(mapQuestion)) })
      .catch(() => {})
  }, [])

  const applyHashFilters = (hash: string) => {
    const path = hash.replace(/^#/, '')
    setAuthNotice('')
    setMenuOpen(false)
    if (path === 'auth-config-required') {
      setAuthNotice('Вход через Яндекс почти готов: нужно добавить YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET и redirect URI на сервере.')
      setSelectedQuestionId('')
      setShowMockInterview(false)
      setShowAllQuestions(false)
      setShowProfile(false)
      return
    }
    if (path === 'auth-error') {
      setAuthNotice('Яндекс не вернул доступ. Попробуйте войти ещё раз.')
      setSelectedQuestionId('')
      setShowMockInterview(false)
      setShowAllQuestions(false)
      setShowProfile(false)
      return
    }
    if (path === 'mock-interview') { setShowMockInterview(true); setMockFormat(undefined); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); setShowRoadmaps(false); setShowChecklist(false); return }
    if (path === 'design-session') { setShowMockInterview(true); setMockFormat('design'); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); setShowRoadmaps(false); setShowChecklist(false); return }
    setShowMockInterview(false)
    if (path === 'checklist') { setShowChecklist(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); setShowRoadmaps(false); return }
    setShowChecklist(false)
    if (path === 'roadmaps') { setShowRoadmaps(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowRoadmaps(false)
    if (path === 'profile') { setShowProfile(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowProfile(false)
    if (path === 'privacy') { setShowPrivacy(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); return }
    setShowPrivacy(false)
    if (path === 'blog') { setShowBlog(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowBlog(false)
    if (path.startsWith('article/')) { setSelectedArticleId(path.slice(8)); setShowBlog(false); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); return }
    setSelectedArticleId('')
    if (path.startsWith('topic/')) { setInitialTopic(path.slice(6)); setShowAllQuestions(true); setSelectedQuestionId(''); return }
    setInitialTopic('')
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

  // Закрытие мобильного меню по Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Блокировка скролла страницы при открытом мобильном меню
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [menuOpen])

  // Закрытие меню профиля по клику вне и Escape
  useEffect(() => {
    if (!userMenuOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  const filtered = useMemo(() => {
    const frequency = (question: Question) => videoFrequency(question) + question.companies.filter((company) => company !== 'Несколько компаний').length
    return [...questions].sort((left, right) => {
      const byFrequency = frequency(right) - frequency(left)
      if (byFrequency) return byFrequency
      return (Date.parse(right.publishedAt || '') || 0) - (Date.parse(left.publishedAt || '') || 0)
    })
  }, [questions])

  const companyCount = useMemo(() => {
    if (questions.length > 0) return new Set(questions.flatMap((question) => question.companies).filter((company) => company !== 'Несколько компаний')).size
    return staticStats?.companyCount ?? 0
  }, [questions, staticStats])
  const youtubeVideos = useMemo(() => {
    const videos = new Map<string, {
      id: string
      url: string
      company: string
      title: string
      publishedAt?: string
      questionIds: Set<string>
      questionTitles: string[]
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
            title: (source as any).title || '',
            publishedAt: source.publishedAt || question.publishedAt,
            questionIds: new Set(),
            questionTitles: [],
          })
        }
        const video = videos.get(id)
        if (!video) continue
        video.questionIds.add(question.id)
        if (!video.questionTitles.includes(question.title)) video.questionTitles.push(question.title)
        if (!video.publishedAt && (source.publishedAt || question.publishedAt)) video.publishedAt = source.publishedAt || question.publishedAt
      }
    }

    return [...videos.values()].sort((left, right) => right.questionIds.size - left.questionIds.size)
  }, [questions])
  const universalCount = questions.length > 0
    ? questions.filter((question) => question.scope === 'universal').length
    : staticStats?.universalCount ?? 0

  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId)
  const openQuestion = (id: string) => { window.location.hash = `question/${id}` }
  const closeQuestion = () => { window.location.hash = 'questions' }
  const navigateTopic = (topicId: string) => { window.location.hash = topicId ? `topic/${topicId}` : 'questions' }

  return (
    <div className={s['app-shell']}>
      <header className={s.topbar}>
        <a className="brand" href="#top" aria-label="sobes-it — на главную">
          <span className="brand-mark">s<span>/</span>i</span>
          <span>sobes-it</span>
        </a>
        <div className={s['header-stats']} style={{ opacity: questionsLoaded ? 1 : 0, transition: 'opacity .3s' }}>
          <span><strong>{staticStats?.totalQuestions ?? questions.length}</strong> <small>вопросов</small></span>
          <span><strong>{companyCount}</strong> <small>компаний</small></span>
          <span><strong>{universalCount}</strong> <small>универс.</small></span>
        </div>
        <nav className={`${s['nav-links']} ${menuOpen ? s.open : ''}`}>
          <a href="#all-questions" className={showAllQuestions || selectedQuestionId ? s.active : undefined} onClick={() => setMenuOpen(false)}>Вопросы</a>
          <a href="#roadmaps" className={showRoadmaps ? s.active : undefined} onClick={() => setMenuOpen(false)}>Роадмапы</a>
          <a href="#mock-interview" className={showMockInterview ? s.active : undefined} onClick={() => setMenuOpen(false)}>Мок-интервью</a>
          <a href="#blog" className={showBlog || selectedArticleId ? s.active : undefined} onClick={() => setMenuOpen(false)}>Блог</a>
          {!user && (
            <div className={s['nav-auth']}>
              <button type="button" onClick={() => { setMenuOpen(false); loginWithYandex() }}>
                <span className={s['yandex-mark']} aria-hidden="true">Я</span>
                Войти через Яндекс
              </button>
            </div>
          )}
        </nav>
        <div
          className={`${s['nav-backdrop']} ${menuOpen ? s.open : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <div className={s['header-actions']}>
          {user ? (
            <div className={s['user-menu']} ref={userMenuRef}>
              <button
                type="button"
                className={s['user-trigger']}
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Меню профиля"
                aria-expanded={userMenuOpen}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className={s['user-avatar']} />
                ) : (
                  <div className={s['user-avatar-placeholder']}>{(user.displayName || '?')[0]}</div>
                )}
                <span className={s['user-name']}>{user.displayName}</span>
              </button>
              <div className={`${s['user-dropdown']} ${userMenuOpen ? s.open : ''}`}>
                <div className={s['user-dropdown-head']}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className={s['user-avatar-lg']} />
                  ) : (
                    <div className={s['user-avatar-placeholder-lg']}>{(user.displayName || '?')[0]}</div>
                  )}
                  <div className={s['user-dropdown-id']}>
                    <b>{user.displayName}</b>
                    {user.email && <span>{user.email}</span>}
                  </div>
                </div>
                <a href="#profile" className={s['user-dropdown-link']} onClick={() => setUserMenuOpen(false)}>
                  Открыть профиль
                </a>
                <button type="button" className={s['user-dropdown-logout']} onClick={() => { setUserMenuOpen(false); logout() }}>
                  <LogOut size={15} /> Выйти
                </button>
              </div>
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
        {showMockInterview ? <MockInterview onBack={() => window.location.hash = 'questions'} initialFormat={mockFormat} /> :
         showChecklist ? <ChecklistPage userId={user?.id} onBack={() => window.location.hash = 'questions'} /> :
         showRoadmaps ? <RoadmapsPage questions={questions} onBack={() => window.location.hash = 'questions'} /> :
         showAllQuestions ? <QuestionsPage questions={questions} dataError={dataError} onOpenQuestion={openQuestion} initialTopic={initialTopic} /> :
         showProfile && user ? <ProfilePage user={user} onBack={() => window.location.hash = 'questions'} /> :
         showBlog ? <BlogPage onOpenArticle={(id) => window.location.hash = `article/${id}`} onBack={() => window.location.hash = 'questions'} /> :
         showPrivacy ? <PrivacyPage /> :
         selectedArticleId ? <ArticlePage articleId={selectedArticleId} onBack={() => window.location.hash = 'blog'} /> :
         selectedQuestion ? <QuestionDetail question={selectedQuestion} onBack={closeQuestion} /> : <>
        <section className={s.hero}>
          <div className={s['hero-copy']}>
            <h1>Знай, что тебя <em>спросят.</em></h1>
            <p>Вопросы компаний, короткие ответы и подробные разборы.</p>
            <a href="#mock-interview" className={s['hero-cta']}>Практиковаться <ArrowRight /></a>
            <a href="#design-session" className={s['design-tile']}>
              <span className={s['design-tile-icon']}><Layers3 size={26} /></span>
              <span className={s['design-tile-text']}>
                <b>Системный дизайн</b>
                <small>Дизайн-сессия: кейс «спроектируйте систему» и 5 этапов с вопросами интервьюера</small>
              </span>
              <span className={s['design-tile-cta']}>Начать <ArrowRight size={15} /></span>
            </a>
          </div>
        </section>

        <section className={s['question-section']} id="questions">
          {authNotice && <div className={s['status-note']}>{authNotice}</div>}
          <div className={s['section-heading']} style={{ opacity: questionsLoaded ? 1 : 0, transition: 'opacity .3s' }}>
            <div>
              <h2>Свежие вопросы</h2>
              <p>Восстановлены кандидатами после реальных интервью</p>
            </div>
            <a href="#all-questions" className={s['hero-cta-lg']}>
              Все вопросы <ArrowRight size={18} />
            </a>
          </div>

          <div className={s['question-grid']} style={{ opacity: questionsLoaded ? 1 : 0, transition: 'opacity .3s' }}>
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
                            <div className={s['card-company-logos']} title={realCompanies.join(', ')}>
                              {realCompanies.slice(0, 3).map((c) => (
                                <CompanyLogo key={c} name={c} size={22} />
                              ))}
                              {realCompanies.length > 3 && <span className={s['card-company-more']}>+{realCompanies.length - 3}</span>}
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
                    <YtThumb videoId={video.id} />
                  </div>
                  <div className={s['youtube-card-body']}>
                    <div className={s['youtube-meta']}>
                      <span>{video.company}</span>
                      {video.publishedAt && <small>{formatDate(video.publishedAt)}</small>}
                    </div>
                    <h3>{video.title || `Собеседование ${video.company}`}</h3>
                    <p>{video.questionIds.size} {questionWord(video.questionIds.size)} из этого видео</p>
                    <div className={s['youtube-topics']}>
                      {video.questionTitles.slice(0, 3).map((title) => <span key={title}>{title}</span>)}
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

        {blogArticles.length > 0 && (
          <section className={s['blog-section']}>
            <div className={s['section-heading']}>
              <div>
                <h2>Блог</h2>
                <p>Практические руководства по прохождению собеседований</p>
              </div>
              <a href="#blog" className={s['hero-cta-lg']}>Все статьи <ArrowRight size={18} /></a>
            </div>
            <div className={s['blog-grid']}>
              {blogArticles.map((article) => (
                <a key={article.id} href={`#article/${article.id}`} className={s['blog-card']}>
                  <div className={s['blog-card-tags']}>
                    {article.tags.map((tag) => <span key={tag} className={s['blog-tag']}><Tag size={10} /> {tag}</span>)}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <span className={s['blog-read-time']}><Clock size={12} /> {article.readTime}</span>
                </a>
              ))}
            </div>
          </section>
        )}
        </>}
      </main>

      <footer>
        <div className={s['footer-intro']}>
          <div className="brand"><span className="brand-mark">s<span>/</span>i</span><span>sobes-it</span></div>
          <p>Сложные интервью становятся понятнее.</p>
        </div>
        <div className={s['footer-nav']}>
          <div><b>Темы</b>{topicDefinitions.map((topic) => <button key={topic.id} onClick={() => navigateTopic(topic.id)}>{topic.label}</button>)}</div>
          <div><b>Типы</b>{questionTypeDefinitions.map((type) => <button key={type.id} onClick={() => window.location.hash = `all-questions`}>{type.label}</button>)}</div>
          <div><b>Подготовка</b>
            <button onClick={() => window.location.hash = 'checklist'}>Чеклист перед собеседованием</button>
            <button onClick={() => window.location.hash = 'roadmaps'}>Роадмапы по ролям</button>
            <button onClick={() => window.location.hash = 'design-session'}>Дизайн-сессия</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>© 2026 sobes-it</span>
            <a href="#privacy" style={{ color: '#777970', fontSize: '11px', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Политика конфиденциальности</a>
          </span>
          <button
            className={s['theme-toggle']}
            type="button"
            style={{ marginLeft: '16px' }}
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </footer>
      <ChatBot />
      <CookieConsent />
    </div>
  )
}

export default App
