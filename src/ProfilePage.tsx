import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Printer, Trash2 } from 'lucide-react'
import { fetchAllUserAnswers, deleteUserAnswer, fetchQuestions, fetchFilters, type UserAnswerWithQuestion, type User, type ApiQuestion, type FiltersResponse } from './api'
import { questionTypeDefinitions, companyOrder, getQuestionType, topicDefinitions } from './filters'
import { FilterDropdown } from './FilterDropdown'
import { exportQuestionsPDF, exportAnswersPDF } from './exportPdf'
import s from './ProfilePage.module.css'

interface ProfilePageProps {
  user: User
  onBack?: () => void
}

export function ProfilePage({ user, onBack }: ProfilePageProps) {
  const [items, setItems] = useState<UserAnswerWithQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [filters, setFilters] = useState<FiltersResponse | null>(null)
  const [activeCompany, setActiveCompany] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [activeRole, setActiveRole] = useState('all')
  const [activeTopic, setActiveTopic] = useState('all')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['technical', 'behavioral', 'system-design', 'management', 'hr', 'game-dev']))
  const [tab, setTab] = useState<'answers' | 'questions'>('questions')

  useEffect(() => {
    Promise.all([
      fetchAllUserAnswers(),
      fetchFilters(),
    ]).then(([answers, f]) => {
      setItems(answers)
      setFilters(f)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const params: Record<string, string> = { limit: '500' }
    if (activeCompany !== 'all') params.company = activeCompany
    if (activeType !== 'all') params.type = activeType
    if (activeRole !== 'all') params.role = activeRole
    fetchQuestions(params).then((data) => setQuestions(data.questions))
  }, [activeCompany, activeType, activeRole, activeTopic])

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (activeTypes.size < 5) {
        const type = getQuestionType(q)
        if (!activeTypes.has(type)) return false
      }
      return true
    })
  }, [questions, activeTypes])

  const filteredAnswers = useMemo(() => {
    return items.filter((item) => {
      if (activeCompany !== 'all' && !item.companies.includes(activeCompany)) return false
      if (activeType !== 'all' && item.category !== activeType) return false
      if (activeTypes.size < 5) {
        const type = getQuestionType(item)
        if (!activeTypes.has(type)) return false
      }
      return true
    })
  }, [items, activeCompany, activeType, activeTypes])

  const handleDelete = async (id: number) => {
    await deleteUserAnswer(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const grouped = filteredAnswers.reduce<Record<string, { question: UserAnswerWithQuestion; answers: UserAnswerWithQuestion[] }>>((acc, item) => {
    if (!acc[item.question_id]) {
      acc[item.question_id] = { question: item, answers: [] }
    }
    acc[item.question_id].answers.push(item)
    return acc
  }, {})

  const totalAnswers = filteredAnswers.length
  const totalQuestions = Object.keys(grouped).length

  return (
    <div className={s.page}>
      <div className={s.header}>
        {onBack ? (
          <button className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
        ) : (
          <a href="/" className={s.back} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft /> На главную</a>
        )}
        <div className={s['user-info']}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className={s.avatar} />
          ) : (
            <div className={s['avatar-placeholder']}>{user.displayName[0]}</div>
          )}
          <div>
            <h1>{user.displayName}</h1>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <FilterDropdown label="Компания" value={activeCompany} onChange={setActiveCompany} options={[
          { value: 'all', label: 'Все компании' },
          ...companyOrder.map((c) => ({ value: c, label: c })),
        ]} />
        <FilterDropdown label="Роль" value={activeRole} onChange={setActiveRole} options={[
          { value: 'all', label: 'Все роли' },
          ...(filters?.roles || []).map((r) => ({ value: r, label: r })),
        ]} />
        <FilterDropdown label="Тема" value={activeTopic} onChange={setActiveTopic} options={[
          { value: 'all', label: 'Все темы' },
          ...topicDefinitions.map((t) => ({ value: t.id, label: t.label })),
        ]} />
      </div>
      <div className={s.filters}>
        <div className={s['type-row']}>
          <span className={s['type-label']}>Тип</span>
          {questionTypeDefinitions.map((type) => (
            <button key={type.id}
              className={`${s['type-pill']} ${activeTypes.has(type.id) ? s.active : ''}`}
              onClick={() => {
                setActiveTypes(prev => {
                  const next = new Set(prev)
                  if (next.has(type.id)) next.delete(type.id)
                  else next.add(type.id)
                  return next
                })
              }}
            >
              {type.label}
            </button>
          ))}
          <button className={s['type-pill-select']} onClick={() => {
            setActiveTypes(prev => prev.size === questionTypeDefinitions.length ? new Set() : new Set(questionTypeDefinitions.map(t => t.id)))
          }}>
            {activeTypes.size === questionTypeDefinitions.length ? 'Снять все' : 'Все'}
          </button>
        </div>
      </div>

      <div className={s.tabs}>
        <button className={`${s.tab} ${tab === 'questions' ? s.active : ''}`} onClick={() => setTab('questions')}>
          Все вопросы
        </button>
        <button className={`${s.tab} ${tab === 'answers' ? s.active : ''}`} onClick={() => setTab('answers')}>
          Мои ответы ({totalAnswers})
        </button>
      </div>

      {tab === 'questions' ? (
        <>
          {filteredQuestions.length > 0 && (
            <div className={s['export-actions']}>
              <span className={s['question-count']}>{filteredQuestions.length} вопросов</span>
              <button className={s['export-btn']} onClick={() => exportQuestionsPDF(filteredQuestions)}>
                <Printer size={16} /> Печать
              </button>
            </div>
          )}

          <div className={s['answers-list']}>
            {filteredQuestions.map((q) => (
              <div key={q.id} className={s['question-card']}>
                <div className={s['question-header']}>
                  <a href={`#question/${q.id}`} className={s['question-title']}>{q.title}</a>
                  <div className={s['question-meta']}>
                    {q.companies.map((c) => <span key={c}>{c}</span>)}
                    <span>{q.stage || q.category}</span>
                  </div>
                </div>
                <div className={s['answers-section']}>
                  <p className={s['answer-text']}>{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {totalAnswers > 0 && (
            <div className={s['export-actions']}>
              <button className={s['export-btn']} onClick={() => exportAnswersPDF(filteredAnswers)}>
                <Printer size={16} /> Печать
              </button>
            </div>
          )}

          {loading ? (
            <div className={s['empty-state']}>Загрузка...</div>
          ) : totalAnswers === 0 ? (
            <div className={s['empty-state']}>
              <p>У вас пока нет сохранённых ответов.</p>
              <p>Откройте вопрос и напишите свой ответ — он сохранится здесь.</p>
            </div>
          ) : (
            <div className={s['answers-list']}>
              {Object.entries(grouped).map(([questionId, { question, answers }]) => (
                <div key={questionId} className={s['question-card']}>
                  <div className={s['question-header']}>
                    <a href={`#question/${questionId}`} className={s['question-title']}>{question.title}</a>
                    <div className={s['question-meta']}>
                      <span>{question.companies.join(', ')}</span>
                      <span>{question.category}</span>
                    </div>
                  </div>
                  <div className={s['answers-section']}>
                    {answers.map((answer) => (
                      <div key={answer.id} className={s['answer-item']}>
                        <p className={s['answer-text']}>{answer.answer}</p>
                        <button className={s['answer-delete']} onClick={() => handleDelete(answer.id)} title="Удалить">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
