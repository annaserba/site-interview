import { useMemo, useState, useCallback, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Save, Shuffle, Trash2 } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, companyOrder, getQuestionType } from './filters'
import { InterviewerAvatar } from './InterviewerAvatar'
import { fetchQuestions, fetchUserAnswers, saveUserAnswer, deleteUserAnswer, type UserAnswer } from './api'
import questions from './data/questions.json'
import type { Question } from './types'
import s from './MockInterview.module.css'

type InterviewQuestion = {
  id: string
  question: string
  type: string
  company: string
  role: string
  difficulty: 'easy' | 'medium' | 'hard'
  tips: string[]
  exampleAnswer: string
}

const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
  1: 'easy', 2: 'easy',
  3: 'medium', 4: 'medium',
  5: 'hard',
}

function mapQuestions(data: Question[]): InterviewQuestion[] {
  return data.map((q) => ({
    id: q.id,
    question: q.title,
    type: getQuestionType(q),
    company: q.companies?.[0] || 'Несколько компаний',
    role: q.roles?.[0] || 'Backend',
    difficulty: difficultyMap[q.difficulty] || 'medium',
    tips: q.keyPoints?.map((kp) => kp.title) || [],
    exampleAnswer: q.exampleAnswer || q.answer || '',
  }))
}

const fallbackQuestions: InterviewQuestion[] = mapQuestions(questions as Question[])

const difficultyLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColor = { easy: 'var(--acid)', medium: '#ffb428', hard: '#ff5a46' }

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

type MockInterviewProps = { onBack: () => void }

export function MockInterview({ onBack }: MockInterviewProps) {
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>(fallbackQuestions)
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeType, setActiveType] = useState('Все типы')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [selectedQuestions, setSelectedQuestions] = useState<InterviewQuestion[]>([])
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer[]>>({})
  const [answerText, setAnswerText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchQuestions({ limit: 500 })
      .then((data) => {
        const mapped = data.questions.map((q) => ({
          id: q.id,
          question: q.title,
          type: q.category || 'Technical',
          company: q.companies?.[0] || 'Несколько компаний',
          role: q.roles?.[0] || 'Backend',
          difficulty: difficultyMap[q.difficulty] || 'medium',
          tips: q.key_points?.map((kp: { title: string }) => kp.title) || [],
          exampleAnswer: q.example_answer || q.answer || '',
        }))
        setAllQuestions(mapped)
      })
      .catch(() => {
        setAllQuestions(fallbackQuestions)
      })
  }, [])

  const roles = useMemo(() => [...new Set(allQuestions.map((q) => q.role))].sort((a, b) => a.localeCompare(b, 'ru')), [allQuestions])

  const filteredPool = useMemo(() => {
    return allQuestions.filter((q) => {
      const companyMatch = activeCompany === 'Все компании' || q.company === activeCompany
      const typeMatch = activeType === 'Все типы' || q.type === activeType
      const roleMatch = activeRole === 'Все роли' || q.role === activeRole
      return companyMatch && typeMatch && roleMatch
    })
  }, [activeCompany, activeType, activeRole])

  // Reset interview when filters change
  useEffect(() => {
    if (filtersApplied) {
      setSelectedQuestions([])
      setFiltersApplied(false)
      setCurrentIndex(0)
      setShowAnswer(false)
      setCompleted(new Set())
    }
  }, [activeCompany, activeType, activeRole])

  const startInterview = useCallback(() => {
    const shuffled = shuffleArray(filteredPool)
    setSelectedQuestions(shuffled.slice(0, 10))
    setCurrentIndex(0)
    setShowAnswer(false)
    setCompleted(new Set())
    setFiltersApplied(true)
  }, [filteredPool])

  const current = selectedQuestions[currentIndex]
  const progress = selectedQuestions.length > 0 ? (completed.size / selectedQuestions.length) * 100 : 0

  const goNext = () => {
    if (current) setCompleted((prev) => new Set(prev).add(current.id))
    setShowAnswer(false)
    if (currentIndex < selectedQuestions.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const goPrev = () => {
    setShowAnswer(false)
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const reset = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCompleted(new Set())
  }

  const resetFilters = () => {
    setActiveCompany('Все компании')
    setActiveType('Все типы')
    setActiveRole('Все роли')
    setSelectedQuestions([])
    setFiltersApplied(false)
    setCurrentIndex(0)
    setShowAnswer(false)
    setCompleted(new Set())
  }

  const allDone = selectedQuestions.length > 0 && completed.size >= selectedQuestions.length

  useEffect(() => {
    if (current && !userAnswers[current.id]) {
      fetchUserAnswers(current.id).then((answers) => {
        setUserAnswers((prev) => ({ ...prev, [current.id]: answers }))
      })
    }
  }, [current?.id])

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

  return (
    <div className={s.page}>
      <div className={s.header}>
        <button className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
        <h1>Мок-интервью</h1>
        <p>Практикуйтесь отвечать на вопросы. Сначала подумайте, затем проверьте пример ответа.</p>
      </div>

      <div className={s.filters}>
        <FilterDropdown label="Компания" value={activeCompany} onChange={setActiveCompany} options={[
          { value: 'Все компании', label: 'Все компании' },
          ...companyOrder.map((c) => ({ value: c, label: c })),
        ]} />
        <FilterDropdown label="Тип" value={activeType} onChange={setActiveType} options={[
          { value: 'Все типы', label: 'Все типы' },
          ...questionTypeDefinitions.map((t) => ({ value: t.id, label: t.label })),
        ]} />
        <FilterDropdown label="Роль" value={activeRole} onChange={setActiveRole} options={[
          { value: 'Все роли', label: 'Все роли' },
          ...roles.map((r) => ({ value: r, label: r })),
        ]} />
      </div>

      {!filtersApplied ? (
        <div className={s['start-screen']}>
          <InterviewerAvatar size={80} />
          <div className={s['pool-info']}>
            <span>{filteredPool.length} вопросов в пуле</span>
            <span>Максимум 10 будут выбраны случайно</span>
          </div>
          <button
            className={s['start-btn']}
            onClick={startInterview}
            disabled={filteredPool.length === 0}
          >
            <Shuffle /> Начать интервью
          </button>
          {filteredPool.length === 0 && (
            <p className={s['empty-hint']}>Нет вопросов по выбранным фильтрам. Измените параметры.</p>
          )}
        </div>
      ) : (
        <>
          <div className={s.progress}>
            <div className={s['progress-bar']}>
              <div className={s['progress-fill']} style={{ width: `${progress}%` }} />
            </div>
            <span>{completed.size} / {selectedQuestions.length}</span>
          </div>

          {allDone ? (
            <div className={s.done}>
              <Check />
              <h2>Вы ответили на все вопросы!</h2>
              <p>Отличная практика. Можете начать заново или изменить фильтры.</p>
              <div className={s['done-actions']}>
                <button onClick={reset}><RotateCcw /> Ещё раз</button>
                <button onClick={resetFilters}><Shuffle /> Новые фильтры</button>
              </div>
            </div>
          ) : current && (
            <div className={s.card}>
              <div className={s['card-header']}>
                <span className={s.category}>{current.type}</span>
                <span className={s.company}>{current.company}</span>
                <span className={s.difficulty} style={{ color: difficultyColor[current.difficulty] }}>
                  {difficultyLabel[current.difficulty]}
                </span>
                <button className={s['restart-btn']} onClick={reset} title="Начать заново">
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className={s['interviewer-row']}>
                <InterviewerAvatar size={40} />
                <div className={s['interviewer-info']}>
                  <span className={s['interviewer-name']}>Интервьюер</span>
                  <span className={s['interviewer-role']}>Вопрос {currentIndex + 1} из {selectedQuestions.length}</span>
                </div>
              </div>

              <h2 className={s.question}>{current.question}</h2>
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
                  <span>Мои ответы ({(userAnswers[current.id] || []).length})</span>
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
                  placeholder="Напишите свой вариант ответа..."
                  rows={3}
                />
                <div className={s['user-answer-actions']}>
                  <button
                    className={s['user-answer-save']}
                    onClick={handleSaveAnswer}
                    disabled={isSaving || !answerText.trim()}
                  >
                    <Save size={14} />
                    {isSaving ? '...' : 'Добавить'}
                  </button>
                </div>
              </div>

              {!showAnswer ? (
                <button className={s['show-btn']} onClick={() => setShowAnswer(true)}>
                  Показать пример ответа
                </button>
              ) : (
                <div className={s.answer}>
                  <div className={s['answer-section']}>
                    <h3>Советы</h3>
                    <ul>
                      {current.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                  <div className={s['answer-section']}>
                    <h3>Пример ответа</h3>
                    <div className={s['answer-text']}>
                      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{current.exampleAnswer}</Markdown>
                    </div>
                  </div>
                </div>
              )}

              <div className={s.nav}>
                <button className={s['nav-btn']} onClick={goPrev} disabled={currentIndex === 0}>
                  <ArrowLeft /> Предыдущий
                </button>
                <button className={`${s['nav-btn']} ${s.primary}`} onClick={goNext}>
                  Ответил <ArrowRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
