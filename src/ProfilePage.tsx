import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Download, FileText, Trash2, Filter } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import { fetchAllUserAnswers, deleteUserAnswer, fetchQuestions, fetchFilters, type UserAnswerWithQuestion, type User, type ApiQuestion, type FiltersResponse } from './api'
import { questionTypeDefinitions, companyOrder, getQuestionType } from './filters'
import s from './ProfilePage.module.css'

interface ProfilePageProps {
  user: User
  onBack: () => void
}

function exportQuestionsMarkdown(questions: ApiQuestion[]) {
  let md = '# Вопросы для собеседования\n\n'
  for (const q of questions) {
    md += `## ${q.title}\n`
    md += `**Компании:** ${q.companies.join(', ') || '—'}\n`
    md += `**Тема:** ${q.stage || q.category}\n\n`
    md += `**Ответ:**\n${q.answer}\n\n`
    if (q.example_answer) md += `**Пример ответа:**\n${q.example_answer}\n\n`
    if (q.key_points?.length) {
      md += `**Как раскрыть:**\n`
      for (const [i, point] of q.key_points.entries()) {
        md += `${i + 1}. **${point.title}:** ${point.text}\n`
      }
      md += '\n'
    }
    if (q.pitfalls?.length) {
      md += `**Ловушки:**\n`
      for (const p of q.pitfalls) md += `— ${p}\n`
      md += '\n'
    }
    md += '---\n\n'
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'questions.md'
  a.click()
  URL.revokeObjectURL(url)
}

function exportQuestionsPDF(questions: ApiQuestion[]) {
  let html = `<h1>Вопросы для собеседования (${questions.length})</h1>`

  for (const q of questions) {
    html += `<div style="margin-bottom:32px;border-bottom:1px solid #eee;padding-bottom:24px;page-break-inside:avoid"><h2 style="font-size:18px;margin:0 0 8px">${q.title}</h2>`
    html += `<div style="font-size:12px;color:#666;margin-bottom:12px">${q.companies.join(', ') || '—'} · ${q.stage || q.category}</div>`
    html += `<div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;font-family:monospace;letter-spacing:0.05em">Ответ:</div><div style="background:#f8f9fa;border-left:3px solid #333;padding:12px 16px;margin-bottom:12px;border-radius:0 4px 4px 0;white-space:pre-wrap;font-size:14px">${q.answer}</div>`
    if (q.example_answer) html += `<div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;font-family:monospace;letter-spacing:0.05em">Пример ответа:</div><div style="background:#f8f9fa;border-left:3px solid #333;padding:12px 16px;margin-bottom:12px;border-radius:0 4px 4px 0;white-space:pre-wrap;font-size:14px">${q.example_answer}</div>`
    if (q.key_points?.length) {
      html += `<div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;font-family:monospace;letter-spacing:0.05em">Как раскрыть:</div><div style="background:#f8f9fa;border-left:3px solid #333;padding:12px 16px;margin-bottom:12px;border-radius:0 4px 4px 0;font-size:14px">`
      for (const [i, p] of q.key_points.entries()) html += `${i + 1}. <b>${p.title}:</b> ${p.text}<br>`
      html += `</div>`
    }
    if (q.pitfalls?.length) {
      html += `<div style="font-size:11px;text-transform:uppercase;color:#c0392b;margin-bottom:4px;font-family:monospace;letter-spacing:0.05em">Ловушки:</div><div style="background:#f8f9fa;border-left:3px solid #333;padding:12px 16px;margin-bottom:12px;border-radius:0 4px 4px 0;font-size:14px;color:#c0392b">`
      for (const p of q.pitfalls) html += `— ${p}<br>`
      html += `</div>`
    }
    html += '</div>'
  }

  const el = document.createElement('div')
  el.innerHTML = html
  el.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
  el.style.lineHeight = '1.6'
  el.style.color = '#222'
  document.body.appendChild(el)
  html2pdf().from(el).set({ margin: 10, filename: 'questions.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save().then(() => document.body.removeChild(el))
}

function exportAnswersMarkdown(items: UserAnswerWithQuestion[]) {
  const grouped = items.reduce<Record<string, UserAnswerWithQuestion[]>>((acc, item) => {
    if (!acc[item.question_id]) acc[item.question_id] = []
    acc[item.question_id].push(item)
    return acc
  }, {})

  let md = '# Мои ответы на вопросы\n\n'
  for (const [, answers] of Object.entries(grouped)) {
    const first = answers[0]
    md += `## ${first.title}\n`
    md += `**Тип:** ${first.category}\n\n`
    for (const answer of answers) {
      md += `### Вариант ответа\n${answer.answer}\n\n`
    }
    md += '---\n\n'
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-answers.md'
  a.click()
  URL.revokeObjectURL(url)
}

function exportAnswersPDF(items: UserAnswerWithQuestion[]) {
  const grouped = items.reduce<Record<string, UserAnswerWithQuestion[]>>((acc, item) => {
    if (!acc[item.question_id]) acc[item.question_id] = []
    acc[item.question_id].push(item)
    return acc
  }, {})

  let html = '<h1>Мои ответы на вопросы</h1>'

  for (const [, answers] of Object.entries(grouped)) {
    const first = answers[0]
    html += `<div style="margin-bottom:32px;border-bottom:1px solid #eee;padding-bottom:24px;page-break-inside:avoid"><h2 style="font-size:18px;margin:0 0 8px">${first.title}</h2>`
    html += `<div style="font-size:12px;color:#666;margin-bottom:12px">${first.category}</div>`
    for (const answer of answers) {
      html += `<div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;font-family:monospace;letter-spacing:0.05em">Вариант ответа:</div><div style="background:#f8f9fa;border-left:3px solid #333;padding:12px 16px;margin-bottom:12px;border-radius:0 4px 4px 0;white-space:pre-wrap;font-size:14px">${answer.answer}</div>`
    }
    html += '</div>'
  }

  const el = document.createElement('div')
  el.innerHTML = html
  el.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
  el.style.lineHeight = '1.6'
  el.style.color = '#222'
  document.body.appendChild(el)
  html2pdf().from(el).set({ margin: 10, filename: 'my-answers.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save().then(() => document.body.removeChild(el))
}

export function ProfilePage({ user, onBack }: ProfilePageProps) {
  const [items, setItems] = useState<UserAnswerWithQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [filters, setFilters] = useState<FiltersResponse | null>(null)
  const [activeCompany, setActiveCompany] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [activeRole, setActiveRole] = useState('all')
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
    if (tab !== 'questions') return
    const params: Record<string, string> = { limit: '500' }
    if (activeCompany !== 'all') params.company = activeCompany
    if (activeType !== 'all') params.type = activeType
    if (activeRole !== 'all') params.role = activeRole
    fetchQuestions(params).then((data) => setQuestions(data.questions))
  }, [tab, activeCompany, activeType, activeRole])

  const filteredQuestions = useMemo(() => {
    if (tab !== 'questions') return []
    return questions
  }, [questions, tab])

  const handleDelete = async (id: number) => {
    await deleteUserAnswer(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const grouped = items.reduce<Record<string, { question: UserAnswerWithQuestion; answers: UserAnswerWithQuestion[] }>>((acc, item) => {
    if (!acc[item.question_id]) {
      acc[item.question_id] = { question: item, answers: [] }
    }
    acc[item.question_id].answers.push(item)
    return acc
  }, {})

  const totalAnswers = items.length
  const totalQuestions = Object.keys(grouped).length

  return (
    <div className={s.page}>
      <div className={s.header}>
        <button className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
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

      {tab === 'questions' && (
        <div className={s.filters}>
          <div className={s['filter-row']}>
            <select value={activeCompany} onChange={(e) => setActiveCompany(e.target.value)}>
              <option value="all">Все компании</option>
              {companyOrder.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={activeType} onChange={(e) => setActiveType(e.target.value)}>
              <option value="all">Все типы</option>
              {questionTypeDefinitions.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <select value={activeRole} onChange={(e) => setActiveRole(e.target.value)}>
              <option value="all">Все роли</option>
              {filters?.roles?.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      )}

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
                <FileText size={16} /> PDF
              </button>
              <button className={s['export-btn']} onClick={() => exportQuestionsMarkdown(filteredQuestions)}>
                <Download size={16} /> Markdown
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
              <button className={s['export-btn']} onClick={() => exportAnswersPDF(items)}>
                <FileText size={16} /> PDF
              </button>
              <button className={s['export-btn']} onClick={() => exportAnswersMarkdown(items)}>
                <Download size={16} /> Markdown
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
