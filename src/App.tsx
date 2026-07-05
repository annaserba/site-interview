import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Clock, LogOut, Menu, Moon, Search, Sun, Tag, Users, X } from 'lucide-react'
import { ChatBot } from './ChatBot'
import { QuestionDetail } from './QuestionDetail'
import { QuestionsPage } from './QuestionsPage'
import { MockInterview } from './MockInterview'
import { ProfilePage } from './ProfilePage'
import { BlogPage } from './BlogPage'
import { ArticlePage } from './ArticlePage'
import { PrivacyPage } from './PrivacyPage'
import { CookieConsent } from './CookieConsent'
import { blogArticles } from './blog-articles'
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
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [staticStats, setStaticStats] = useState<{ totalQuestions: number; companyCount: number; universalCount: number } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme)
  const [dataError, setDataError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => window.location.hash.startsWith('#question/') ? window.location.hash.slice(10) : '')
  const [showMockInterview, setShowMockInterview] = useState(() => window.location.hash === '#mock-interview')
  const [showAllQuestions, setShowAllQuestions] = useState(() => window.location.hash === '#all-questions')
  const [showProfile, setShowProfile] = useState(() => window.location.hash === '#profile')
  const [showBlog, setShowBlog] = useState(() => window.location.hash === '#blog')
  const [showPrivacy, setShowPrivacy] = useState(() => window.location.hash === '#privacy')
  const [selectedArticleId, setSelectedArticleId] = useState(() => window.location.hash.startsWith('#article/') ? window.location.hash.slice(10) : '')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('in-depth:theme', theme)
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
      .catch(async () => {
        try {
          const res = await fetch('/data/questions.json')
          const data = await res.json()
          const mapped = data.map((q: any) => ({
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
        } catch {
          setDataError('База вопросов сейчас недоступна. Проверьте API и Postgres.')
        }
      })
  }, [])

  const applyHashFilters = (hash: string) => {
    const path = hash.replace(/^#/, '')
    setAuthNotice('')
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
    if (path === 'mock-interview') { setShowMockInterview(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowMockInterview(false)
    if (path === 'profile') { setShowProfile(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowBlog(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowProfile(false)
    if (path === 'privacy') { setShowPrivacy(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setShowBlog(false); setSelectedArticleId(''); return }
    setShowPrivacy(false)
    if (path === 'blog') { setShowBlog(true); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); setSelectedArticleId(''); setShowPrivacy(false); return }
    setShowBlog(false)
    if (path.startsWith('article/')) { setSelectedArticleId(path.slice(8)); setShowBlog(false); setSelectedQuestionId(''); setShowAllQuestions(false); setShowProfile(false); return }
    setSelectedArticleId('')
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
          <a href="#all-questions" onClick={() => setMenuOpen(false)}>Вопросы</a>
          <a href="#mock-interview" onClick={() => setMenuOpen(false)}>Мок-интервью</a>
          <a href="#blog" onClick={() => setMenuOpen(false)}>Блог</a>
        </nav>
        <div className={s['header-actions']}>
          {user ? (
            <div className={s['user-menu']}>
              <a href="#profile" className={s['user-avatar-link']}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className={s['user-avatar']} />
                ) : (
                  <div className={s['user-avatar-placeholder']}>{user.displayName[0]}</div>
                )}
              </a>
              <a href="#profile" className={s['user-name']}>{user.displayName}</a>
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
