import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock, Flag, RotateCcw, Save, Shuffle, Trash2 } from 'lucide-react'
import { QuestionFilters, type FilterState } from './QuestionFilters'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, topicDefinitions, getQuestionType } from './filters'
import { InterviewerAvatar } from './InterviewerAvatar'
import { fetchUserAnswers, saveUserAnswer, deleteUserAnswer, type UserAnswer } from './api'
import { CompanyLogo } from './CompanyLogo'
import type { Question } from './types'
import s from './MockInterview.module.css'

type Rating = 'yes' | 'partial' | 'no'
type Phase = 'setup' | 'interview' | 'done'

const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
  1: 'easy', 2: 'easy',
  3: 'medium', 4: 'medium',
  5: 'hard',
}

const difficultyLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColor = { easy: 'var(--acid)', medium: '#ffb428', hard: '#ff5a46' }

const ratingMeta: Record<Rating, { label: string; color: string }> = {
  yes: { label: 'Уверенно', color: 'var(--acid)' },
  partial: { label: 'Частично', color: '#ffb428' },
  no: { label: 'Не ответил', color: '#ff5a46' },
}

const countOptions = [
  { value: '5', label: '5 вопросов' },
  { value: '10', label: '10 вопросов' },
  { value: '15', label: '15 вопросов' },
]

const timerOptions = [
  { value: '0', label: 'Без лимита' },
  { value: '120', label: '2 минуты' },
  { value: '300', label: '5 минут' },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

type MockInterviewProps = { onBack?: () => void }

export function MockInterview({ onBack }: MockInterviewProps) {
  const [rawQuestions, setRawQuestions] = useState<Question[]>([])
  const [dataReady, setDataReady] = useState(false)

  // Filters
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(questionTypeDefinitions.map((t) => t.id)))
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [questionCount, setQuestionCount] = useState('10')
  const [timeLimit, setTimeLimit] = useState('0')

  // Session
  const [phase, setPhase] = useState<Phase>('setup')
  const [session, setSession] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [secondsLeft, setSecondsLeft] = useState(0)

  // User answers
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer[]>>({})
  const [answerText, setAnswerText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data: Question[]) => {
        setRawQuestions(data)
        setDataReady(true)
      })
      .catch(() => setDataReady(true))
  }, [])

  const filteredPool = useMemo(() => {
    return rawQuestions.filter((q) => {
      const companyMatch = activeCompany === 'Все компании' || (q.companies || []).includes(activeCompany)
      const roleMatch = activeRole === 'Все роли' || (q.roles || []).includes(activeRole)
      const topic = topicDefinitions.find((t) => t.id === activeTopic)
      const topicMatch = !topic || topic.categories.includes(q.category) || topic.terms.some((term) => q.title.toLocaleLowerCase('ru-RU').includes(term))
      const typeMatch = activeTypes.has(getQuestionType(q))
      const difficultyMatch = activeDifficulty === 'all' || difficultyMap[q.difficulty] === activeDifficulty
      return companyMatch && roleMatch && topicMatch && typeMatch && difficultyMatch
    })
  }, [rawQuestions, activeCompany, activeRole, activeTopic, activeTypes, activeDifficulty])

  const startInterview = (pool: Question[], count?: number) => {
    const shuffled = shuffleArray(pool)
    setSession(shuffled.slice(0, Math.min(count ?? Number(questionCount), shuffled.length)))
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
    setAnswerText('')
    setPhase('interview')
  }

  const current = session[currentIndex]
  const ratedCount = session.filter((q) => ratings[q.id]).length
  const progress = session.length > 0 ? (ratedCount / session.length) * 100 : 0
  const limit = Number(timeLimit)

  // Per-question countdown
  useEffect(() => {
    if (phase !== 'interview' || limit === 0) return
    setSecondsLeft(limit)
    const id = setInterval(() => setSecondsLeft((v) => (v > 0 ? v - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [phase, currentIndex, limit])

  // Load saved user answers for current question
  useEffect(() => {
    if (current && !userAnswers[current.id]) {
      fetchUserAnswers(current.id).then((answers) => {
        setUserAnswers((prev) => ({ ...prev, [current.id]: answers }))
      })
    }
  }, [current?.id])

  const goNext = () => {
    setShowAnswer(false)
    setAnswerText('')
    if (currentIndex < session.length - 1) setCurrentIndex(currentIndex + 1)
    else setPhase('done')
  }

  const goPrev = () => {
    setShowAnswer(false)
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const rate = (r: Rating) => {
    if (current) setRatings((prev) => ({ ...prev, [current.id]: r }))
  }

  const backToSetup = () => {
    setPhase('setup')
    setSession([])
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
  }

  const handleSaveAnswer = async () => {
    if (!current || !answerText.trim()) return
    setIsSaving(true)
    try {
      const id = await saveUserAnswer(current.id, answerText)
      if (id) {
        const newAnswer: UserAnswer = {
          id, user_id: 0, question_id: current.id, answer: answerText,
          context: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }
        setUserAnswers((prev) => ({ ...prev, [current.id]: [newAnswer, ...(prev[current.id] || [])] }))
        setAnswerText('')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAnswer = async (answerId: number, questionId: string) => {
    await deleteUserAnswer(answerId)
    setUserAnswers((prev) => ({ ...prev, [questionId]: (prev[questionId] || []).filter((a) => a.id !== answerId) }))
  }

  // Results
  const results = useMemo(() => {
    const counts: Record<Rating | 'skip', number> = { yes: 0, partial: 0, no: 0, skip: 0 }
    session.forEach((q) => { counts[ratings[q.id] || 'skip'] += 1 })
    const score = session.length > 0
      ? Math.round(((counts.yes + counts.partial * 0.5) / session.length) * 100)
      : 0
    const weak = session.filter((q) => ratings[q.id] !== 'yes')
    return { counts, score, weak }
  }, [session, ratings])

  const filterState: FilterState = { activeCompany, activeRole, activeTopic, sortMode: 'default', activeTypes }

  const setupSummary = [
    activeCompany !== 'Все компании' && activeCompany,
    activeRole !== 'Все роли' && activeRole,
    activeTopic !== 'Все темы' && (topicDefinitions.find((t) => t.id === activeTopic)?.label || activeTopic),
    activeDifficulty !== 'all' && difficultyLabel[activeDifficulty as 'easy' | 'medium' | 'hard'],
    activeTypes.size < questionTypeDefinitions.length &&
      questionTypeDefinitions.filter((t) => activeTypes.has(t.id)).map((t) => t.label).join(', '),
  ].filter(Boolean).join(' · ')

  const interviewerOrg = activeCompany !== 'Все компании'
    ? activeCompany
    : current?.companies?.filter((c) => c !== 'Несколько компаний')[0] || 'IT'

  return (
    <div className={s.page}>
      <div className={s.header}>
        {onBack ? (
          <button className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
        ) : (
          <a href="/" className={s.back} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft /> На главную</a>
        )}
        <h1>Мок-интервью</h1>
        <p>Симуляция реального собеседования: интервьюер задаёт вопросы, вы отвечаете на время и оцениваете себя. В конце — разбор результатов.</p>
      </div>

      {!dataReady ? (
        <div className={s['start-screen']}>
          <p style={{ color: 'var(--muted)' }}>Загрузка вопросов...</p>
        </div>
      ) : phase === 'setup' ? (
        <>
          <QuestionFilters
            questions={rawQuestions}
            filterState={filterState}
            onChange={(partial) => {
              if ('activeCompany' in partial && partial.activeCompany) setActiveCompany(partial.activeCompany)
              if ('activeRole' in partial && partial.activeRole) setActiveRole(partial.activeRole)
              if ('activeTopic' in partial && partial.activeTopic) setActiveTopic(partial.activeTopic)
              if ('activeTypes' in partial && partial.activeTypes) setActiveTypes(partial.activeTypes)
            }}
            showSort={false}
          />

          <div className={s['setup-row']}>
            <FilterDropdown label="Сложность" value={activeDifficulty} onChange={setActiveDifficulty} options={[
              { value: 'all', label: 'Любая' },
              { value: 'easy', label: 'Лёгкий' },
              { value: 'medium', label: 'Средний' },
              { value: 'hard', label: 'Сложный' },
            ]} />
            <FilterDropdown label="Длина" value={questionCount} onChange={setQuestionCount} options={countOptions} />
            <FilterDropdown label="Таймер на вопрос" value={timeLimit} onChange={setTimeLimit} options={timerOptions} />
          </div>

          <div className={s['start-screen']}>
            <InterviewerAvatar size={80} />
            <div className={s['pool-info']}>
              <span>{filteredPool.length} вопросов в пуле</span>
              <span>Будут выбраны случайно: {Math.min(Number(questionCount), filteredPool.length)}</span>
              {limit > 0 && <span>На каждый вопрос: {formatTime(limit)}</span>}
            </div>
            {setupSummary && <p className={s['setup-summary']}>{setupSummary}</p>}
            <button
              className={s['start-btn']}
              onClick={() => startInterview(filteredPool)}
              disabled={filteredPool.length === 0}
            >
              <Shuffle /> Начать интервью
            </button>
            {filteredPool.length === 0 && (
              <p className={s['empty-hint']}>Нет вопросов по выбранным фильтрам. Измените параметры.</p>
            )}
          </div>
        </>
      ) : phase === 'interview' && current ? (
        <>
          <div className={s.progress}>
            <div className={s['progress-bar']}>
              <div className={s['progress-fill']} style={{ width: `${progress}%` }} />
            </div>
            <span>{ratedCount} / {session.length}</span>
          </div>

          <div className={s.card}>
            <div className={s['card-header']}>
              <div className={s['card-tags']}>
                <span className={s.category}>{current.category}</span>
                {(current.companies || []).filter((c) => c !== 'Несколько компаний').slice(0, 2).map((c) => (
                  <CompanyLogo key={c} name={c} size={24} />
                ))}
                <span className={s.difficulty} style={{ color: difficultyColor[difficultyMap[current.difficulty] || 'medium'] }}>
                  {difficultyLabel[difficultyMap[current.difficulty] || 'medium']}
                </span>
              </div>
              <div className={s['card-tools']}>
                {limit > 0 && (
                  <span className={`${s.timer} ${secondsLeft === 0 ? s.expired : ''}`}>
                    <Clock size={13} />
                    {secondsLeft === 0 ? 'Время!' : formatTime(secondsLeft)}
                  </span>
                )}
                <button className={s['restart-btn']} onClick={() => startInterview(session, session.length)} title="Перемешать и начать заново">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className={s['interviewer-row']}>
              <InterviewerAvatar size={40} />
              <div className={s['interviewer-info']}>
                <span className={s['interviewer-name']}>Интервьюер · {interviewerOrg}</span>
                <span className={s['interviewer-role']}>Вопрос {currentIndex + 1} из {session.length}</span>
              </div>
            </div>

            <h2 className={s.question}>{current.title}</h2>
            <a
              className={s['detail-link']}
              href={`#question/${current.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть детализацию вопроса →
            </a>

            <div className={s['user-answer-box']}>
              <div className={s['user-answer-head']}>
                <span>Ваш ответ ({(userAnswers[current.id] || []).length})</span>
              </div>
              {(userAnswers[current.id] || []).length > 0 && (
                <div className={s['user-answers-list']}>
                  {(userAnswers[current.id] || []).map((item) => (
                    <div key={item.id} className={s['user-answer-item']}>
                      <p>{item.answer}</p>
                      <button className={s['user-answer-delete']} onClick={() => handleDeleteAnswer(item.id, current.id)} title="Удалить ответ">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                className={s['user-answer-input']}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Проговорите ответ вслух, затем запишите ключевые тезисы..."
                rows={3}
              />
              <div className={s['user-answer-actions']}>
                <button
                  className={s['user-answer-save']}
                  onClick={handleSaveAnswer}
                  disabled={isSaving || !answerText.trim()}
                >
                  <Save size={14} />
                  {isSaving ? '...' : 'Сохранить'}
                </button>
              </div>
            </div>

            {!showAnswer ? (
              <button className={s['show-btn']} onClick={() => setShowAnswer(true)}>
                Показать пример ответа
              </button>
            ) : (
              <div className={s.answer}>
                {(current.keyPoints?.length ?? 0) > 0 && (
                  <div className={s['answer-section']}>
                    <h3>Что ждёт интервьюер</h3>
                    <ul>
                      {current.keyPoints!.map((kp, i) => <li key={i}>{kp.title}</li>)}
                    </ul>
                  </div>
                )}
                {(current.exampleAnswer || current.answer) && (
                  <div className={s['answer-section']}>
                    <h3>Пример ответа</h3>
                    <div className={s['answer-text']} style={{ whiteSpace: 'pre-wrap' }}>
                      {current.exampleAnswer || current.answer}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={s['rating-row']}>
              <span className={s['rating-label']}>Как ответили?</span>
              {(Object.keys(ratingMeta) as Rating[]).map((r) => (
                <button
                  key={r}
                  className={`${s['rating-btn']} ${ratings[current.id] === r ? s[`active-${r}`] : ''}`}
                  onClick={() => rate(r)}
                >
                  {ratingMeta[r].label}
                </button>
              ))}
            </div>

            <div className={s.nav}>
              <button className={s['nav-btn']} onClick={goPrev} disabled={currentIndex === 0}>
                <ArrowLeft /> Предыдущий
              </button>
              <button className={`${s['nav-btn']} ${s.primary}`} onClick={goNext}>
                {currentIndex < session.length - 1 ? (
                  <>Следующий вопрос <ArrowRight /></>
                ) : (
                  <>Завершить <Flag size={15} /></>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={s.done}>
          <div className={s.score}>
            <span className={s['score-value']}>{results.score}%</span>
            <span className={s['score-label']}>общий результат</span>
          </div>
          <h2>{results.score >= 80 ? 'Отличное интервью!' : results.score >= 50 ? 'Неплохо, но есть над чем работать' : 'Стоит повторить материал'}</h2>
          <div className={s['done-stats']}>
            <span style={{ color: ratingMeta.yes.color }}>Уверенно: {results.counts.yes}</span>
            <span style={{ color: ratingMeta.partial.color }}>Частично: {results.counts.partial}</span>
            <span style={{ color: ratingMeta.no.color }}>Не ответил: {results.counts.no}</span>
            {results.counts.skip > 0 && <span>Без оценки: {results.counts.skip}</span>}
          </div>

          <div className={s['result-list']}>
            {session.map((q, i) => {
              const r = ratings[q.id]
              return (
                <a key={q.id} className={s['result-item']} href={`#question/${q.id}`} target="_blank" rel="noopener noreferrer">
                  <span className={s['result-num']}>{i + 1}</span>
                  <span className={s['result-title']}>{q.title}</span>
                  <span
                    className={s['result-badge']}
                    style={r ? { color: ratingMeta[r].color, borderColor: ratingMeta[r].color } : undefined}
                  >
                    {r ? ratingMeta[r].label : 'Пропущен'}
                  </span>
                </a>
              )
            })}
          </div>

          <div className={s['done-actions']}>
            {results.weak.length > 0 && (
              <button onClick={() => startInterview(results.weak, results.weak.length)}>
                <RotateCcw /> Повторить слабые ({results.weak.length})
              </button>
            )}
            <button onClick={() => startInterview(session, session.length)}>
              <Shuffle /> Заново
            </button>
            <button onClick={backToSetup}>
              <Check /> Новые настройки
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
