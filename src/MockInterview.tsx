import { useMemo, useState, useCallback } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle } from 'lucide-react'
import { FilterDropdown } from './FilterDropdown'
import { questionTypeDefinitions, companyOrder, getQuestionType } from './filters'
import { InterviewerAvatar } from './InterviewerAvatar'
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

const allInterviewQuestions: InterviewQuestion[] = (questions as Question[]).map((q) => ({
  id: q.id,
  question: q.title,
  type: getQuestionType(q),
  company: q.companies?.[0] || 'Несколько компаний',
  role: q.roles?.[0] || 'Backend',
  difficulty: difficultyMap[q.difficulty] || 'medium',
  tips: q.keyPoints?.map((kp) => kp.title) || [],
  exampleAnswer: q.exampleAnswer || q.answer || '',
}))

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
  const [activeCompany, setActiveCompany] = useState('Все компании')
  const [activeType, setActiveType] = useState('Все типы')
  const [activeRole, setActiveRole] = useState('Все роли')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [selectedQuestions, setSelectedQuestions] = useState<InterviewQuestion[]>([])
  const [filtersApplied, setFiltersApplied] = useState(false)

  const roles = useMemo(() => [...new Set(allInterviewQuestions.map((q) => q.role))].sort((a, b) => a.localeCompare(b, 'ru')), [])

  const filteredPool = useMemo(() => {
    return allInterviewQuestions.filter((q) => {
      const companyMatch = activeCompany === 'Все компании' || q.company === activeCompany
      const typeMatch = activeType === 'Все типы' || q.type === activeType
      const roleMatch = activeRole === 'Все роли' || q.role === activeRole
      return companyMatch && typeMatch && roleMatch
    })
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
              </div>

              <div className={s['interviewer-row']}>
                <InterviewerAvatar size={40} />
                <div className={s['interviewer-info']}>
                  <span className={s['interviewer-name']}>Интервьюер</span>
                  <span className={s['interviewer-role']}>Вопрос {currentIndex + 1} из {selectedQuestions.length}</span>
                </div>
              </div>

              <h2 className={s.question}>{current.question}</h2>

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
                    <p>{current.exampleAnswer}</p>
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
