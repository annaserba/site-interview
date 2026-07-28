import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Binary, BookOpen, Check, Clock, Code2, Flag, HeartHandshake, Layers3, MessagesSquare, Mic, MicOff, RotateCcw, Save, Shuffle, Sparkles, Speech, Trash2, Users } from 'lucide-react'
import { QuestionFilters, type FilterState } from './QuestionFilters'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, topicDefinitions, getQuestionType, topicMatches, caseWord, questionWord } from './filters'
import { InterviewerAvatar } from './InterviewerAvatar'
import { buildDesignSession, designPool, isDesignCase, type DesignSession } from './designSession'
import { fetchUserAnswers, saveUserAnswer, deleteUserAnswer, evaluateAnswer, evaluateCode, evaluateDesignSession, fetchCurrentUser, loginWithYandex, type User, type UserAnswer, type AnswerEvaluation, type CodeEvaluation, type DesignSessionEvaluation } from './api'
import { CompanyLogo } from './CompanyLogo'
import type { Question } from './types'
import s from './MockInterview.module.css'
import { CodeHighlight } from './CodeHighlight'

type Rating = 'yes' | 'partial' | 'no'
type Phase = 'setup' | 'interview' | 'done'

// Единая шкала с карточками вопросов: 1-2 easy, 3 medium, 4-5 hard
const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
  1: 'easy', 2: 'easy',
  3: 'medium',
  4: 'hard', 5: 'hard',
}

const difficultyLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColor = { easy: 'var(--acid)', medium: '#ffb428', hard: '#ff5a46' }

const ratingMeta: Record<Rating, { label: string; color: string }> = {
  yes: { label: 'Уверенно', color: 'var(--acid)' },
  partial: { label: 'Частично', color: '#ffb428' },
  no: { label: 'Не ответил', color: '#ff5a46' },
}

// LLM иногда возвращает вердикт вне словаря — приводим по скору, иначе UI падает на ratingMeta[verdict]
const toRating = (verdict: unknown, score?: number): Rating => {
  if (verdict === 'yes' || verdict === 'partial' || verdict === 'no') return verdict
  const value = Number(score)
  if (!Number.isFinite(value)) return 'no'
  return value >= 80 ? 'yes' : value >= 40 ? 'partial' : 'no'
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

// «Расскажите о себе» — один и тот же вопрос во всех отраслевых вариантах самопрезентации.
// Сохранённые ответы складываем в канонический id, чтобы они были общими для всех шаблонов.
const SELF_INTRO_TAG = 'Self presentation'
const SELF_INTRO_CANONICAL_ID = 'universal-tell-about-yourself'
const canonicalAnswerId = (q?: { id: string; tags?: string[] }) =>
  q && (q.tags || []).includes(SELF_INTRO_TAG) ? SELF_INTRO_CANONICAL_ID : q?.id

type Format = 'technical' | 'algorithms' | 'behavioral' | 'hr' | 'management' | 'self-intro' | 'design'

type MockInterviewProps = { onBack?: () => void; initialFormat?: Format }

export function MockInterview({ onBack, initialFormat }: MockInterviewProps) {
  const [rawQuestions, setRawQuestions] = useState<Question[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Filters
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [activeTopic, setActiveTopic] = useState('Все темы')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(questionTypeDefinitions.map((t) => t.id)))
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [questionCount, setQuestionCount] = useState('10')
  const [timeLimit, setTimeLimit] = useState('0')
  const [format, setFormat] = useState<Format>(initialFormat ?? 'technical')

  // Session
  const [phase, setPhase] = useState<Phase>('setup')
  const [session, setSession] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [secondsLeft, setSecondsLeft] = useState(0)

  // Design session
  const [design, setDesign] = useState<DesignSession | null>(null)
  const [stageIndex, setStageIndex] = useState(0)
  const [stageAnswers, setStageAnswers] = useState<Record<string, string>>({})
  const [designEvaluation, setDesignEvaluation] = useState<DesignSessionEvaluation | null>(null)
  const [isEvaluatingSession, setIsEvaluatingSession] = useState(false)

  // User answers
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer[]>>({})
  const [answerText, setAnswerText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Voice input
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [speechError, setSpeechError] = useState('')
  const speechSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  // AI evaluation
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | CodeEvaluation | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data: Question[]) => {
        setRawQuestions(data)
        setDataReady(true)
      })
      .catch(() => setDataReady(true))
    fetchCurrentUser().then(setUser)
  }, [])

  const filteredPool = useMemo(() => {
    // Фильтр темы имеет смысл только для технической секции — в остальных он скрыт и не должен действовать
    const applyTopic = format === 'technical'
    return rawQuestions.filter((q) => {
      const companyMatch = activeCompany === 'Все компании' || (q.companies || []).includes(activeCompany)
      const roleMatch = activeRole === 'Все роли' || (q.roles || []).includes(activeRole)
      const topicMatch = !applyTopic || topicMatches(q, activeTopic)
      const typeMatch = activeTypes.has(getQuestionType(q))
      const difficultyMatch = activeDifficulty === 'all' || difficultyMap[q.difficulty] === activeDifficulty
      return companyMatch && roleMatch && topicMatch && typeMatch && difficultyMatch
    })
  }, [rawQuestions, format, activeCompany, activeRole, activeTopic, activeTypes, activeDifficulty])

  // Пул под выбранную секцию мок-интервью. Секции соответствуют типам на странице вопросов:
  // техническая = type 'technical', дизайн = type 'system-design' и т.д. (+ форматы: алгоритмы, самопрезентация)
  const sectionPool = useMemo(() => {
    // codeSnippet бывает markdown/text (структуры ответа, не код) — в алго-секцию берём только настоящий код
    const isRealCode = (q: Question) => Boolean(q.codeSnippet) && !['markdown', 'text', 'md'].includes((q.codeLanguage || 'text').toLowerCase())
    const isSelfIntro = (q: Question) => (q.tags || []).includes(SELF_INTRO_TAG)
    if (format === 'algorithms') {
      return filteredPool.filter((q) => getQuestionType(q) === 'technical' && (q.category === 'Algorithms' || isRealCode(q)))
    }
    if (format === 'behavioral') {
      return filteredPool.filter((q) => getQuestionType(q) === 'behavioral' && !isSelfIntro(q))
    }
    if (format === 'hr') {
      return filteredPool.filter((q) => getQuestionType(q) === 'hr' && !isSelfIntro(q))
    }
    if (format === 'management') {
      return filteredPool.filter((q) => getQuestionType(q) === 'management')
    }
    if (format === 'self-intro') {
      return filteredPool.filter(isSelfIntro)
    }
    if (format === 'design') {
      // Вся теория системного дизайна — для режима «Практика теории» (кейс-сессия берёт свой пул отдельно)
      return filteredPool.filter((q) => getQuestionType(q) === 'system-design')
    }
    // Техническая секция = type 'technical'. Game Dev — только если явно выбрана эта роль,
    // иначе в общем моке ловили бы вопросы по Unreal Engine
    return filteredPool.filter((q) => {
      const type = getQuestionType(q)
      if (type !== 'technical' && type !== 'game-dev') return false
      return type === 'technical' || activeRole === 'Game Dev'
    })
  }, [filteredPool, format, activeRole])

  const startInterview = (pool: Question[], count?: number) => {
    stopRecording()
    const shuffled = shuffleArray(pool)
    setDesign(null)
    setSession(shuffled.slice(0, Math.min(count ?? Number(questionCount), shuffled.length)))
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
    setAnswerText('')
    setPhase('interview')
  }

  const startDesignSession = () => {
    stopRecording()
    const session = buildDesignSession(filteredPool)
    if (!session) return
    setSession([])
    setDesign(session)
    setStageIndex(0)
    setStageAnswers({})
    setDesignEvaluation(null)
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
    setAnswerText('')
    setEvaluation(null)
    setPhase('interview')
  }

  const current = session[currentIndex]
  const designStage = design?.stages[stageIndex]
  // Приёмник голосового ввода: обработчик onresult живёт в замыкании распознавателя
  // с момента старта записи — актуального адресата держим в ref, иначе после рестарта
  // сессии или смены этапа текст продолжает писаться в старый этап/режим
  const speechSinkRef = useRef<{ stageId: string | null }>({ stageId: null })
  speechSinkRef.current = { stageId: design && designStage ? designStage.id : null }
  // Вопрос, к которому привязаны ответ/ИИ-оценка на этапе дизайн-сессии
  const designQuestion = designStage ? (designStage.questions[0] ?? design?.caseQuestion) : undefined
  const ratedCount = design
    ? design.stages.filter((st) => ratings[st.id]).length
    : session.filter((q) => ratings[q.id]).length
  const totalUnits = design ? design.stages.length : session.length
  const progress = totalUnits > 0 ? (ratedCount / totalUnits) * 100 : 0
  const limit = Number(timeLimit)

  // Per-question countdown. useLayoutEffect — сброс до отрисовки, иначе на смену
  // вопроса на один кадр мелькает «Время!» от предыдущего таймера
  useLayoutEffect(() => {
    if (phase !== 'interview' || limit === 0) return
    setSecondsLeft(limit)
    const id = setInterval(() => setSecondsLeft((v) => (v > 0 ? v - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [phase, currentIndex, stageIndex, limit])

  // Load saved user answers for current question
  const answerQuestionId = design ? designQuestion?.id : canonicalAnswerId(current)
  // Смена пользователя (логин/логаут) инвалидирует кэш — у гостя ответов нет, после входа нужно перезагрузить.
  // Загруженные id держим в ref: setUserAnswers в эффекте выше не виден эффекту ниже в том же проходе.
  const userId = user?.id ?? 0
  const answersLoadedRef = useRef<Set<string>>(new Set())
  useEffect(() => { answersLoadedRef.current.clear(); setUserAnswers({}) }, [userId])
  useEffect(() => {
    if (!answerQuestionId || answersLoadedRef.current.has(answerQuestionId)) return
    answersLoadedRef.current.add(answerQuestionId)
    fetchUserAnswers(answerQuestionId).then((answers) => {
      setUserAnswers((prev) => ({ ...prev, [answerQuestionId]: answers }))
    })
  }, [answerQuestionId, userId])

  const goNextDesignStage = () => {
    stopRecording()
    setShowAnswer(false)
    setAnswerText('')
    setEvaluation(null)
    if (design && stageIndex < design.stages.length - 1) setStageIndex(stageIndex + 1)
    else setPhase('done')
  }

  const goPrevDesignStage = () => {
    stopRecording()
    setShowAnswer(false)
    setEvaluation(null)
    if (stageIndex > 0) setStageIndex(stageIndex - 1)
  }

  const goNext = () => {
    stopRecording()
    setShowAnswer(false)
    setAnswerText('')
    setEvaluation(null)
    if (currentIndex < session.length - 1) setCurrentIndex(currentIndex + 1)
    else setPhase('done')
  }

  const goPrev = () => {
    stopRecording()
    setShowAnswer(false)
    setEvaluation(null)
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const rate = (r: Rating, key?: string) => {
    const id = key ?? current?.id
    if (id) setRatings((prev) => ({ ...prev, [id]: r }))
  }

  const backToSetup = () => {
    stopRecording()
    setPhase('setup')
    setSession([])
    setDesign(null)
    setStageIndex(0)
    setStageAnswers({})
    setDesignEvaluation(null)
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
  }

  const handleSaveAnswer = async (question?: Question, text?: string) => {
    const target = question ?? current
    const value = (text ?? answerText).trim()
    if (!target || !value) return
    const answerId = canonicalAnswerId(target) || target.id
    setIsSaving(true)
    try {
      const id = await saveUserAnswer(answerId, value)
      if (id) {
        const newAnswer: UserAnswer = {
          id, user_id: 0, question_id: answerId, answer: value,
          context: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }
        setUserAnswers((prev) => ({ ...prev, [answerId]: [newAnswer, ...(prev[answerId] || [])] }))
        if (text === undefined) setAnswerText('')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleEvaluateSession = async () => {
    if (!design) return
    setIsEvaluatingSession(true)
    try {
      const stages = design.stages.map((st) => ({
        questionId: st.questions[0]?.id,
        title: st.title,
        answer: stageAnswers[st.id] ?? '',
      }))
      const result = await evaluateDesignSession(design.caseQuestion.id, stages)
      if (result) {
        // Этапы отправляем по порядку — и сопоставляем по индексу, а не по заголовку:
        // LLM может переформулировать title, и тогда оценка этапа терялась
        const normalized: DesignSessionEvaluation = {
          ...result,
          verdict: toRating(result.verdict, result.score),
          stages: (result.stages || []).map((st) => ({ ...st, verdict: toRating(st.verdict, st.score) })),
        }
        setDesignEvaluation(normalized)
        // Автоматически проставляем оценки этапам из разбора
        const nextRatings = { ...ratings }
        design.stages.forEach((st, i) => {
          const stageResult = normalized.stages[i]
          if (stageResult) nextRatings[st.id] = stageResult.verdict
        })
        setRatings(nextRatings)
      } else {
        setSpeechError('Не удалось получить оценку. Проверьте, что сервер запущен.')
      }
    } finally {
      setIsEvaluatingSession(false)
    }
  }

  const handleDeleteAnswer = async (answerId: number, questionId: string) => {
    await deleteUserAnswer(answerId)
    setUserAnswers((prev) => ({ ...prev, [questionId]: (prev[questionId] || []).filter((a) => a.id !== answerId) }))
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsRecording(false)
    setInterimText('')
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
      return
    }
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.lang = 'ru-RU'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (event) => {
      let finalChunk = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i].item(0).transcript
        if (event.results[i].isFinal) finalChunk += transcript + ' '
        else interim += transcript
      }
      if (finalChunk) {
        const chunk = finalChunk.trim()
        const stageId = speechSinkRef.current.stageId
        if (stageId) {
          setStageAnswers((prev) => {
            const cur = prev[stageId] ?? ''
            return { ...prev, [stageId]: (cur ? cur.trimEnd() + ' ' : '') + chunk }
          })
          setDesignEvaluation(null)
        } else {
          setAnswerText((prev) => (prev ? prev.trimEnd() + ' ' : '') + chunk)
          setEvaluation(null)
        }
      }
      setInterimText(interim)
    }
    recognition.onerror = (event) => {
      setSpeechError(
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Нет доступа к микрофону. Разрешите доступ в браузере.'
          : event.error === 'no-speech'
            ? 'Речь не распознана — попробуйте говорить громче.'
            : `Ошибка распознавания: ${event.error}`,
      )
      stopRecording()
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsRecording(false)
      setInterimText('')
    }
    setSpeechError('')
    recognitionRef.current = recognition
    setIsRecording(true)
    recognition.start()
  }

  // Stop recording when leaving the page
  useEffect(() => () => recognitionRef.current?.stop(), [])

  const handleEvaluate = async (question?: Question) => {
    const target = question ?? current
    if (!target || !answerText.trim()) return
    setIsEvaluating(true)
    try {
      // В алгоритмической секции — код-ревью: сложность, паттерны, edge-cases
      const result = format === 'algorithms'
        ? await evaluateCode(target.id, answerText)
        : await evaluateAnswer(target.id, answerText)
      if (result) setEvaluation({ ...result, verdict: toRating(result.verdict, result.score) })
      else setSpeechError('Не удалось получить оценку. Проверьте, что сервер запущен.')
    } finally {
      setIsEvaluating(false)
    }
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

  // Design session results
  const designResults = useMemo(() => {
    if (!design) return null
    const counts: Record<Rating | 'skip', number> = { yes: 0, partial: 0, no: 0, skip: 0 }
    design.stages.forEach((st) => { counts[ratings[st.id] || 'skip'] += 1 })
    const score = Math.round(((counts.yes + counts.partial * 0.5) / design.stages.length) * 100)
    return { counts, score }
  }, [design, ratings])

  const designCasesCount = useMemo(() => designPool(filteredPool).filter(isDesignCase).length, [filteredPool])

  const filterState: FilterState = { activeCompany, activeRole, activeTopic, sortMode: 'default', activeTypes }

  const setupSummary = [
    activeCompany !== 'Все компании' && activeCompany,
    activeRole !== 'Все роли' && activeRole,
    format === 'technical' && activeTopic !== 'Все темы' && (topicDefinitions.find((t) => t.id === activeTopic)?.label || activeTopic),
    activeDifficulty !== 'all' && difficultyLabel[activeDifficulty as 'easy' | 'medium' | 'hard'],
    activeTypes.size < questionTypeDefinitions.length &&
      questionTypeDefinitions.filter((t) => activeTypes.has(t.id)).map((t) => t.label).join(', '),
  ].filter(Boolean).join(' · ')

  const interviewerOrg = activeCompany !== 'Все компании'
    ? activeCompany
    : (current ?? design?.caseQuestion)?.companies?.filter((c) => c !== 'Несколько компаний')[0] || 'IT'

  // Поле ответа: голосовой ввод, сохранение, ИИ-оценка. Общее для обычных вопросов и этапов дизайн-сессии.
  // opts.hideEval — без поэтапной ИИ-оценки (дизайн-сессия оценивается целиком в конце).
  const renderAnswerBox = (target: Question, rateKey?: string, opts?: { hideEval?: boolean; value?: string; onChange?: (v: string) => void }) => {
    const answersKey = canonicalAnswerId(target) || target.id
    return (
    <div className={s['user-answer-box']}>
      <div className={s['user-answer-head']}>
        <span>Ваш ответ ({(userAnswers[answersKey] || []).length})</span>
      </div>
      {(userAnswers[answersKey] || []).length > 0 && (
        <div className={s['user-answers-list']}>
          {(userAnswers[answersKey] || []).map((item) => (
            <div key={item.id} className={s['user-answer-item']}>
              <p>{item.answer}</p>
              <button className={s['user-answer-delete']} onClick={() => handleDeleteAnswer(item.id, answersKey)} title="Удалить ответ">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={s['user-answer-input-wrap']}>
        {(target.codeSnippet || format === 'algorithms') && (opts?.value ?? answerText) && (
          <CodeHighlight
            className={s['code-overlay']}
            code={(opts?.value ?? answerText) + '\n'}
            language={target.codeLanguage}
          />
        )}
        <textarea
          className={`${s['user-answer-input']} ${target.codeSnippet || format === 'algorithms' ? s.mono : ''} ${(target.codeSnippet || format === 'algorithms') && (opts?.value ?? answerText) ? s['code-editing'] : ''}`}
          value={opts?.value ?? answerText}
          onChange={(e) => { (opts?.onChange ?? setAnswerText)(e.target.value); setEvaluation(null) }}
          placeholder={format === 'algorithms'
            ? 'Напишите код решения, затем нажмите «Проверить код» — ИИ оценит подход, сложность и edge-cases...'
            : target.codeSnippet
              ? 'Напишите код решения или объясните подход, затем нажмите «Оценить ИИ»...'
              : 'Ответьте голосом или напишите текст, затем нажмите «Оценить ИИ»...'}
          rows={target.codeSnippet || format === 'algorithms' ? 8 : 3}
          spellCheck={!(target.codeSnippet || format === 'algorithms')}
          onScroll={(e) => {
            const pre = e.currentTarget.previousElementSibling as HTMLElement | null
            if (pre?.classList.contains(s['code-overlay'])) {
              pre.scrollTop = e.currentTarget.scrollTop
              pre.scrollLeft = e.currentTarget.scrollLeft
            }
          }}
        />
        {speechSupported && (
          <button
            className={`${s['mic-btn']} ${isRecording ? s.recording : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'Остановить запись' : 'Ответить голосом'}
            type="button"
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
      {isRecording && (
        <p className={s['speech-status']}>
          <span className={s['recording-dot']} /> Идёт запись{interimText ? `: ${interimText}` : '...'}
        </p>
      )}
      {speechError && <p className={s['speech-error']}>{speechError}</p>}
      <div className={s['user-answer-actions']}>
        {!opts?.hideEval && (
          <button
            className={s['eval-btn']}
            onClick={() => handleEvaluate(target)}
            disabled={!user || isEvaluating || !answerText.trim()}
            title={!user ? 'Доступно после входа' : undefined}
          >
            <Sparkles size={14} />
            {isEvaluating ? 'Оцениваю...' : format === 'algorithms' ? 'Проверить код' : 'Оценить ИИ'}
          </button>
        )}
        <button
          className={s['user-answer-save']}
          onClick={() => handleSaveAnswer(target, opts?.value)}
          disabled={!user || isSaving || !(opts?.value ?? answerText).trim()}
          title={!user ? 'Доступно после входа' : undefined}
        >
          <Save size={14} />
          {isSaving ? '...' : 'Сохранить'}
        </button>
      </div>
      {!user && (
        <p className={s['login-hint']}>
          Оценка ИИ и сохранение ответов доступны после входа.{' '}
          <button type="button" className={s['login-hint-btn']} onClick={loginWithYandex}>
            Войти через Яндекс
          </button>
        </p>
      )}

      {evaluation && !opts?.hideEval && (
        <div className={s['eval-panel']}>
          <div className={s['eval-head']}>
            <span className={s['eval-verdict']} style={{ color: ratingMeta[evaluation.verdict].color, borderColor: ratingMeta[evaluation.verdict].color }}>
              ИИ: {ratingMeta[evaluation.verdict].label}
            </span>
            <div className={s['eval-score-bar']}>
              <div
                className={s['eval-score-fill']}
                style={{ width: `${evaluation.score}%`, background: ratingMeta[evaluation.verdict].color }}
              />
            </div>
            <span className={s['eval-score-num']}>{evaluation.score}%</span>
          </div>
          {'complexity' in evaluation && evaluation.complexity && (
            <div className={s['code-eval-meta']}>
              <span className={s['code-eval-chip']}>~{evaluation.complexity}</span>
              {evaluation.codePatterns.map((p) => (
                <span key={p} className={s['code-eval-chip']}>{p}</span>
              ))}
              {evaluation.complexityMentioned && <span className={s['code-eval-chip']}>Big-O указан</span>}
            </div>
          )}
          <p className={s['eval-feedback']}>{evaluation.feedback}</p>
          {evaluation.missedPoints.length > 0 && (
            <p className={s['eval-missed']}>Добавить: {evaluation.missedPoints.join(' · ')}</p>
          )}
          <button
            className={s['eval-apply']}
            onClick={() => rate(evaluation.verdict, rateKey)}
            type="button"
          >
            <Check size={14} /> Поставить эту оценку
          </button>
        </div>
      )}
    </div>
    )
  }

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
            showTypePills={false}
            showTopic={format === 'technical'}
          />

          <div className={s['section-picker']}>
            {([
              { id: 'self-intro', icon: <Speech size={20} />, label: 'Самопрезентация', desc: '«Расскажите о себе» — шаблоны по STAR' },
              { id: 'technical', icon: <Code2 size={20} />, label: 'Техническая', desc: 'Языки, фреймворки, технологии роли' },
              { id: 'algorithms', icon: <Binary size={20} />, label: 'Алгоритмическая', desc: 'Задачи на код, сложность, edge-cases' },
              { id: 'behavioral', icon: <MessagesSquare size={20} />, label: 'Поведенческая', desc: 'Софт-скиллы и работа в команде' },
              { id: 'hr', icon: <HeartHandshake size={20} />, label: 'HR', desc: 'Мотивация, ожидания, культура' },
              { id: 'management', icon: <Users size={20} />, label: 'Управленческая', desc: 'Лидерство, процессы, найм' },
              { id: 'design', icon: <Layers3 size={20} />, label: 'Системный дизайн', desc: 'Кейс «спроектируйте систему»' },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${s['section-card']} ${format === item.id ? s['section-card-active'] : ''}`}
                onClick={() => setFormat(item.id)}
              >
                <span className={s['section-card-icon']}>{item.icon}</span>
                <span className={s['section-card-text']}>
                  <b>{item.label}</b>
                  <small>{item.desc}</small>
                </span>
              </button>
            ))}
          </div>

          <div className={s['setup-row']}>
            <FilterDropdown label="Сложность" value={activeDifficulty} onChange={setActiveDifficulty} options={[
              { value: 'all', label: 'Любая' },
              { value: 'easy', label: 'Лёгкий' },
              { value: 'medium', label: 'Средний' },
              { value: 'hard', label: 'Сложный' },
            ]} />
            {format !== 'design' && <FilterDropdown label="Длина" value={questionCount} onChange={setQuestionCount} options={countOptions} />}
            <FilterDropdown label={format === 'design' ? 'Таймер на этап' : 'Таймер на вопрос'} value={timeLimit} onChange={setTimeLimit} options={timerOptions} />
          </div>

          <div className={s['start-screen']}>
            <InterviewerAvatar size={80} />
            {format !== 'design' ? (
              <>
                <div className={s['pool-info']}>
                  <span>{sectionPool.length} вопросов в пуле</span>
                  <span>Будут выбраны случайно: {Math.min(Number(questionCount), sectionPool.length)}</span>
                  {limit > 0 && <span>На каждый вопрос: {formatTime(limit)}</span>}
                </div>
                <p className={s['setup-summary']}>
                  {format === 'self-intro'
                    ? 'Самопрезентация: «Расскажите о себе» с готовыми шаблонами по STAR под бигтех, финтех, e-commerce и геймдев. Расскажите свой вариант вслух — ИИ сравнит с эталоном.'
                    : format === 'algorithms'
                    ? 'Алгоритмическая секция: задачи на код и структуры данных. Пишите решение в поле ответа — ИИ проверит подход и сложность.'
                    : format === 'behavioral'
                      ? 'Поведенческая секция: софт-скиллы, конфликты, мотивация и работа в команде. Отвечайте по модели STAR.'
                      : format === 'hr'
                        ? 'HR-секция: мотивация, зарплатные ожидания, культура и карьерные планы. Будьте честны, но структурированы.'
                        : format === 'management'
                          ? 'Управленческая секция: лидерство, найм, процессы и развитие команды. Приводите примеры из практики.'
                          : 'Техническая секция: вопросы по языкам, фреймворкам и технологиям вашей роли.'}
                  {setupSummary ? ` ${setupSummary}` : ''}
                </p>
                <button
                  className={s['start-btn']}
                  onClick={() => startInterview(sectionPool)}
                  disabled={sectionPool.length === 0}
                >
                  <Shuffle /> Начать интервью
                </button>
                {sectionPool.length === 0 && (
                  <p className={s['empty-hint']}>Нет вопросов по выбранным фильтрам. Измените параметры.</p>
                )}
              </>
            ) : (
              <>
                <div className={s['pool-info']}>
                  <span>{designCasesCount} {caseWord(designCasesCount)} «спроектируйте систему»</span>
                  <span>5 этапов: требования → масштаб → архитектура → данные → надёжность</span>
                  {limit > 0 && <span>На каждый этап: {formatTime(limit)}</span>}
                </div>
                <p className={s['setup-summary']}>
                  Симуляция системного дизайн-интервью: один кейс и серия уточняющих вопросов интервьюера по методике больших компаний.
                </p>
                <button
                  className={s['start-btn']}
                  onClick={startDesignSession}
                  disabled={designCasesCount === 0}
                >
                  <Layers3 /> Начать дизайн-сессию
                </button>
                <button
                  className={s['theory-btn']}
                  onClick={() => startInterview(sectionPool)}
                  disabled={sectionPool.length === 0}
                >
                  <BookOpen size={16} /> Практика теории ({sectionPool.length} {questionWord(sectionPool.length)})
                </button>
                {designCasesCount === 0 && (
                  <p className={s['empty-hint']}>В базе пока нет кейсов системного дизайна.</p>
                )}
              </>
            )}
          </div>
        </>
      ) : phase === 'interview' && design && designStage ? (
        <>
          <div className={s.progress}>
            <div className={s['progress-bar']}>
              <div className={s['progress-fill']} style={{ width: `${progress}%` }} />
            </div>
            <span>{ratedCount} / {design.stages.length}</span>
          </div>

          <div className={s.card}>
            <div className={s['card-header']}>
              <div className={s['card-tags']}>
                <span className={s.category}>Дизайн-сессия</span>
                {(design.caseQuestion.companies || []).filter((c) => c !== 'Несколько компаний').slice(0, 2).map((c) => (
                  <CompanyLogo key={c} name={c} size={24} />
                ))}
              </div>
              <div className={s['card-tools']}>
                {limit > 0 && (
                  <span className={`${s.timer} ${secondsLeft === 0 ? s.expired : ''}`}>
                    <Clock size={13} />
                    {secondsLeft === 0 ? 'Время!' : formatTime(secondsLeft)}
                  </span>
                )}
                <button className={s['restart-btn']} onClick={startDesignSession} title="Другой кейс">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className={s['design-case']}>
              <span className={s['design-case-label']}>Кейс</span>
              <h3>{design.caseQuestion.title}</h3>
              <a href={`#question/${design.caseQuestion.id}`} target="_blank" rel="noopener noreferrer">
                Разбор кейса →
              </a>
            </div>

            <div className={s['design-steps']}>
              {design.stages.map((st, i) => (
                <button
                  key={st.id}
                  type="button"
                  className={`${s['design-step']} ${i === stageIndex ? s.active : ''} ${ratings[st.id] ? s.complete : ''}`}
                  onClick={() => { stopRecording(); setStageIndex(i); setShowAnswer(false); setEvaluation(null) }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className={s['interviewer-row']}>
              <InterviewerAvatar size={40} />
              <div className={s['interviewer-info']}>
                <span className={s['interviewer-name']}>Интервьюер · {interviewerOrg}</span>
                <span className={s['interviewer-role']}>Этап {stageIndex + 1} из {design.stages.length}</span>
              </div>
            </div>

            <h2 className={s.question}>{designStage.title}</h2>
            <p className={s['stage-hint']}>{designStage.hint}</p>

            {designStage.questions.length > 0 && (
              <div className={s['followups']}>
                <span className={s['followups-label']}>Вопросы интервьюера на этом этапе:</span>
                <ul>
                  {designStage.questions.map((q) => (
                    <li key={q.id}>
                      <a href={`#question/${q.id}`} target="_blank" rel="noopener noreferrer">{q.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {designQuestion && renderAnswerBox(designQuestion, designStage.id, {
              hideEval: true,
              value: stageAnswers[designStage.id] ?? '',
              onChange: (v) => { setStageAnswers((prev) => ({ ...prev, [designStage.id]: v })); setDesignEvaluation(null) },
            })}

            {!showAnswer ? (
              <button className={s['show-btn']} onClick={() => setShowAnswer(true)}>
                Что ждёт интервьюер по кейсу
              </button>
            ) : (
              <div className={s.answer}>
                {(design.caseQuestion.keyPoints?.length ?? 0) > 0 && (
                  <div className={s['answer-section']}>
                    <h3>Ключевые точки кейса</h3>
                    <ul>
                      {design.caseQuestion.keyPoints!.map((kp, i) => <li key={i}>{kp.title}</li>)}
                    </ul>
                  </div>
                )}
                {(design.caseQuestion.exampleAnswer || design.caseQuestion.answer) && (
                  <div className={s['answer-section']}>
                    <h3>Пример разбора</h3>
                    <div className={s['answer-text']} style={{ whiteSpace: 'pre-wrap' }}>
                      {design.caseQuestion.exampleAnswer || design.caseQuestion.answer}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={s['rating-row']}>
              <span className={s['rating-label']}>Как прошёл этап?</span>
              {(Object.keys(ratingMeta) as Rating[]).map((r) => (
                <button
                  key={r}
                  className={`${s['rating-btn']} ${ratings[designStage.id] === r ? s[`active-${r}`] : ''}`}
                  onClick={() => rate(r, designStage.id)}
                >
                  {ratingMeta[r].label}
                </button>
              ))}
            </div>

            <div className={s.nav}>
              <button className={s['nav-btn']} onClick={goPrevDesignStage} disabled={stageIndex === 0}>
                <ArrowLeft /> Назад
              </button>
              <button className={`${s['nav-btn']} ${s.primary}`} onClick={goNextDesignStage}>
                {stageIndex < design.stages.length - 1 ? (
                  <>Следующий этап <ArrowRight /></>
                ) : (
                  <>Завершить <Flag size={15} /></>
                )}
              </button>
            </div>
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

            {renderAnswerBox(current)}

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
                    {format === 'algorithms' ? (
                      <CodeHighlight
                        className={s['answer-code']}
                        code={current.exampleAnswer || current.answer}
                        language={current.codeLanguage}
                      />
                    ) : (
                      <div className={s['answer-text']} style={{ whiteSpace: 'pre-wrap' }}>
                        {current.exampleAnswer || current.answer}
                      </div>
                    )}
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
      ) : design && designResults ? (
        <div className={s.done}>
          <div className={s.score}>
            <span className={s['score-value']}>{designResults.score}%</span>
            <span className={s['score-label']}>итог дизайн-сессии</span>
          </div>
          <h2>{designResults.score >= 80 ? 'Уверенная дизайн-сессия!' : designResults.score >= 50 ? 'Неплохо, но есть слабые этапы' : 'Стоит повторить методику'}</h2>
          <div className={s['done-stats']}>
            <span style={{ color: ratingMeta.yes.color }}>Уверенно: {designResults.counts.yes}</span>
            <span style={{ color: ratingMeta.partial.color }}>Частично: {designResults.counts.partial}</span>
            <span style={{ color: ratingMeta.no.color }}>Не ответил: {designResults.counts.no}</span>
            {designResults.counts.skip > 0 && <span>Без оценки: {designResults.counts.skip}</span>}
          </div>

          <div className={s['session-eval']}>
            {!designEvaluation ? (
              <>
                <button
                  className={s['eval-btn']}
                  onClick={handleEvaluateSession}
                  disabled={!user || isEvaluatingSession || design.stages.every((st) => !(stageAnswers[st.id] ?? '').trim())}
                  title={!user ? 'Доступно после входа' : undefined}
                >
                  <Sparkles size={14} />
                  {isEvaluatingSession ? 'Оцениваю сессию...' : 'Оценить сессию ИИ'}
                </button>
                <span className={s['session-eval-hint']}>ИИ разберёт все этапы и сам проставит оценки</span>
                {!user && (
                  <p className={s['login-hint']}>
                    Оценка сессии доступна после входа.{' '}
                    <button type="button" className={s['login-hint-btn']} onClick={loginWithYandex}>
                      Войти через Яндекс
                    </button>
                  </p>
                )}
              </>
            ) : (
              <div className={s['eval-panel']}>
                <div className={s['eval-head']}>
                  <span className={s['eval-verdict']} style={{ color: ratingMeta[designEvaluation.verdict].color, borderColor: ratingMeta[designEvaluation.verdict].color }}>
                    ИИ: {ratingMeta[designEvaluation.verdict].label}
                  </span>
                  <div className={s['eval-score-bar']}>
                    <div
                      className={s['eval-score-fill']}
                      style={{ width: `${designEvaluation.score}%`, background: ratingMeta[designEvaluation.verdict].color }}
                    />
                  </div>
                  <span className={s['eval-score-num']}>{designEvaluation.score}%</span>
                </div>
                <p className={s['eval-feedback']}>{designEvaluation.feedback}</p>
                {designEvaluation.stages.map((stage) => (
                  <div key={stage.title} className={s['session-stage-eval']}>
                    <div className={s['session-stage-head']}>
                      <span>{stage.title}</span>
                      <span style={{ color: ratingMeta[stage.verdict].color }}>
                        {ratingMeta[stage.verdict].label} · {stage.score}%
                      </span>
                    </div>
                    <p className={s['eval-feedback']}>{stage.feedback}</p>
                    {stage.missedPoints.length > 0 && (
                      <p className={s['eval-missed']}>Добавить: {stage.missedPoints.join(' · ')}</p>
                    )}
                  </div>
                ))}
                {designEvaluation.missedPoints.length > 0 && (
                  <p className={s['eval-missed']}>По кейсу в целом добавить: {designEvaluation.missedPoints.join(' · ')}</p>
                )}
              </div>
            )}
          </div>

          <div className={s['result-list']}>
            <a className={s['result-item']} href={`#question/${design.caseQuestion.id}`} target="_blank" rel="noopener noreferrer">
              <span className={s['result-num']}>◆</span>
              <span className={s['result-title']}>{design.caseQuestion.title}</span>
              <span className={s['result-badge']}>Кейс</span>
            </a>
            {design.stages.map((st, i) => {
              const r = ratings[st.id]
              const link = st.questions[0]
              const inner = (
                <>
                  <span className={s['result-num']}>{i + 1}</span>
                  <span className={s['result-title']}>{st.title}</span>
                  <span
                    className={s['result-badge']}
                    style={r ? { color: ratingMeta[r].color, borderColor: ratingMeta[r].color } : undefined}
                  >
                    {r ? ratingMeta[r].label : 'Пропущен'}
                  </span>
                </>
              )
              return link ? (
                <a key={st.id} className={s['result-item']} href={`#question/${link.id}`} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={st.id} className={s['result-item']}>{inner}</div>
              )
            })}
          </div>

          <div className={s['done-actions']}>
            <button onClick={startDesignSession}>
              <Layers3 /> Другой кейс
            </button>
            <button onClick={backToSetup}>
              <Check /> Новые настройки
            </button>
          </div>
        </div>
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
