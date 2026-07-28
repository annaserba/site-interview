import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock, Flag, Layers3, Mic, MicOff, RotateCcw, Save, Shuffle, Sparkles, Trash2 } from 'lucide-react'
import { QuestionFilters, type FilterState } from './QuestionFilters'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, topicDefinitions, getQuestionType } from './filters'
import { InterviewerAvatar } from './InterviewerAvatar'
import { CodeBlock } from './CodeBlock'
import { buildDesignSession, designPool, isDesignCase, type DesignSession } from './designSession'
import { fetchUserAnswers, saveUserAnswer, deleteUserAnswer, evaluateAnswer, type UserAnswer, type AnswerEvaluation } from './api'
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
  const [format, setFormat] = useState<'mixed' | 'design'>('mixed')

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
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

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
    setDesign(null)
    setSession(shuffled.slice(0, Math.min(count ?? Number(questionCount), shuffled.length)))
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
    setAnswerText('')
    setPhase('interview')
  }

  const startDesignSession = () => {
    const session = buildDesignSession(rawQuestions)
    if (!session) return
    setSession([])
    setDesign(session)
    setStageIndex(0)
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
    setAnswerText('')
    setEvaluation(null)
    setPhase('interview')
  }

  const current = session[currentIndex]
  const designStage = design?.stages[stageIndex]
  // Вопрос, к которому привязаны ответ/ИИ-оценка на этапе дизайн-сессии
  const designQuestion = designStage ? (designStage.questions[0] ?? design?.caseQuestion) : undefined
  const ratedCount = design
    ? design.stages.filter((st) => ratings[st.id]).length
    : session.filter((q) => ratings[q.id]).length
  const totalUnits = design ? design.stages.length : session.length
  const progress = totalUnits > 0 ? (ratedCount / totalUnits) * 100 : 0
  const limit = Number(timeLimit)

  // Per-question countdown
  useEffect(() => {
    if (phase !== 'interview' || limit === 0) return
    setSecondsLeft(limit)
    const id = setInterval(() => setSecondsLeft((v) => (v > 0 ? v - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [phase, currentIndex, stageIndex, limit])

  // Load saved user answers for current question
  const answerQuestionId = design ? designQuestion?.id : current?.id
  useEffect(() => {
    if (answerQuestionId && !userAnswers[answerQuestionId]) {
      fetchUserAnswers(answerQuestionId).then((answers) => {
        setUserAnswers((prev) => ({ ...prev, [answerQuestionId]: answers }))
      })
    }
  }, [answerQuestionId])

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

  // Вопрос, к которому привязано поле ответа (в дизайн-сессии — вопрос этапа)
  const answerTarget = design ? designQuestion : current

  const backToSetup = () => {
    setPhase('setup')
    setSession([])
    setDesign(null)
    setStageIndex(0)
    setCurrentIndex(0)
    setShowAnswer(false)
    setRatings({})
  }

  const handleSaveAnswer = async (question?: Question) => {
    const target = question ?? current
    if (!target || !answerText.trim()) return
    setIsSaving(true)
    try {
      const id = await saveUserAnswer(target.id, answerText)
      if (id) {
        const newAnswer: UserAnswer = {
          id, user_id: 0, question_id: target.id, answer: answerText,
          context: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }
        setUserAnswers((prev) => ({ ...prev, [target.id]: [newAnswer, ...(prev[target.id] || [])] }))
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
        setAnswerText((prev) => (prev ? prev.trimEnd() + ' ' : '') + finalChunk.trim())
        setEvaluation(null)
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
      const result = await evaluateAnswer(target.id, answerText)
      if (result) setEvaluation(result)
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

  const designCasesCount = useMemo(() => designPool(rawQuestions).filter(isDesignCase).length, [rawQuestions])

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

  // Поле ответа: голосовой ввод, сохранение, ИИ-оценка. Общее для обычных вопросов и этапов дизайн-сессии.
  const renderAnswerBox = (target: Question, rateKey?: string) => (
    <div className={s['user-answer-box']}>
      <div className={s['user-answer-head']}>
        <span>Ваш ответ ({(userAnswers[target.id] || []).length})</span>
      </div>
      {(userAnswers[target.id] || []).length > 0 && (
        <div className={s['user-answers-list']}>
          {(userAnswers[target.id] || []).map((item) => (
            <div key={item.id} className={s['user-answer-item']}>
              <p>{item.answer}</p>
              <button className={s['user-answer-delete']} onClick={() => handleDeleteAnswer(item.id, target.id)} title="Удалить ответ">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={s['user-answer-input-wrap']}>
        <textarea
          className={`${s['user-answer-input']} ${target.codeSnippet ? s.mono : ''}`}
          value={answerText}
          onChange={(e) => { setAnswerText(e.target.value); setEvaluation(null) }}
          placeholder={target.codeSnippet
            ? 'Напишите код решения или объясните подход, затем нажмите «Оценить ИИ»...'
            : 'Ответьте голосом или напишите текст, затем нажмите «Оценить ИИ»...'}
          rows={target.codeSnippet ? 8 : 3}
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
        <button
          className={s['eval-btn']}
          onClick={() => handleEvaluate(target)}
          disabled={isEvaluating || !answerText.trim()}
        >
          <Sparkles size={14} />
          {isEvaluating ? 'Оцениваю...' : 'Оценить ИИ'}
        </button>
        <button
          className={s['user-answer-save']}
          onClick={() => handleSaveAnswer(target)}
          disabled={isSaving || !answerText.trim()}
        >
          <Save size={14} />
          {isSaving ? '...' : 'Сохранить'}
        </button>
      </div>

      {evaluation && (
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
            <FilterDropdown label="Формат" value={format} onChange={(v) => setFormat(v as 'mixed' | 'design')} options={[
              { value: 'mixed', label: 'Обычное интервью' },
              { value: 'design', label: 'Дизайн-сессия' },
            ]} />
            <FilterDropdown label="Сложность" value={activeDifficulty} onChange={setActiveDifficulty} options={[
              { value: 'all', label: 'Любая' },
              { value: 'easy', label: 'Лёгкий' },
              { value: 'medium', label: 'Средний' },
              { value: 'hard', label: 'Сложный' },
            ]} />
            {format === 'mixed' && <FilterDropdown label="Длина" value={questionCount} onChange={setQuestionCount} options={countOptions} />}
            <FilterDropdown label={format === 'design' ? 'Таймер на этап' : 'Таймер на вопрос'} value={timeLimit} onChange={setTimeLimit} options={timerOptions} />
          </div>

          <div className={s['start-screen']}>
            <InterviewerAvatar size={80} />
            {format === 'mixed' ? (
              <>
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
              </>
            ) : (
              <>
                <div className={s['pool-info']}>
                  <span>{designCasesCount} {designCasesCount === 1 ? 'кейс' : 'кейсов'} «спроектируйте систему»</span>
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

            {designQuestion && renderAnswerBox(designQuestion, designStage.id)}

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

            {current.codeSnippet && (
              <CodeBlock code={current.codeSnippet} language={current.codeLanguage} />
            )}

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
