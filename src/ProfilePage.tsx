import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Download, FileText, Trash2, Filter, Link, Upload } from 'lucide-react'
import { fetchAllUserAnswers, deleteUserAnswer, fetchQuestions, fetchFilters, fetchResume, saveResumeUrl, uploadResumePdf, type UserAnswerWithQuestion, type User, type ApiQuestion, type FiltersResponse, type ResumeInfo } from './api'
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
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Вопросы для собеседования</title>
  <style>
    @media print { body { padding: 0; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #222; line-height: 1.6; }
    h1 { font-size: 24px; margin-bottom: 32px; }
    .q { margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px; page-break-inside: avoid; }
    .q h2 { font-size: 18px; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
    .answer { background: #f8f9fa; border-left: 3px solid #333; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 4px 4px 0; white-space: pre-wrap; font-size: 14px; }
    .label { font-size: 11px; text-transform: uppercase; color: #999; margin-bottom: 4px; font-family: monospace; letter-spacing: 0.05em; }
    .pitfalls { color: #c0392b; }
  </style></head><body>`
  html += `<h1>Вопросы для собеседования (${questions.length})</h1>`

  for (const q of questions) {
    html += `<div class="q"><h2>${q.title}</h2>`
    html += `<div class="meta">${q.companies.join(', ') || '—'} · ${q.stage || q.category}</div>`
    html += `<div class="label">Ответ:</div><div class="answer">${q.answer}</div>`
    if (q.example_answer) html += `<div class="label">Пример ответа:</div><div class="answer">${q.example_answer}</div>`
    if (q.key_points?.length) {
      html += `<div class="label">Как раскрыть:</div><div class="answer">`
      for (const [i, p] of q.key_points.entries()) html += `${i + 1}. <b>${p.title}:</b> ${p.text}<br>`
      html += `</div>`
    }
    if (q.pitfalls?.length) {
      html += `<div class="label pitfalls">Ловушки:</div><div class="answer pitfalls">`
      for (const p of q.pitfalls) html += `— ${p}<br>`
      html += `</div>`
    }
    html += '</div>'
  }

  html += '</body></html>'
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'questions.html'
  a.click()
  URL.revokeObjectURL(url)
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

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Мои ответы</title>
  <style>
    @media print { body { padding: 0; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #222; line-height: 1.6; }
    h1 { font-size: 24px; margin-bottom: 32px; }
    .question { margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px; page-break-inside: avoid; }
    .question h2 { font-size: 18px; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
    .answer { background: #f8f9fa; border-left: 3px solid #333; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 4px 4px 0; white-space: pre-wrap; font-size: 14px; }
    .answer-label { font-size: 11px; text-transform: uppercase; color: #999; margin-bottom: 4px; font-family: monospace; letter-spacing: 0.05em; }
  </style></head><body>`
  html += '<h1>Мои ответы на вопросы</h1>'

  for (const [, answers] of Object.entries(grouped)) {
    const first = answers[0]
    html += `<div class="question"><h2>${first.title}</h2>`
    html += `<div class="meta">${first.category}</div>`
    for (const answer of answers) {
      html += `<div class="answer-label">Вариант ответа:</div><div class="answer">${answer.answer}</div>`
    }
    html += '</div>'
  }

  html += '</body></html>'
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-answers.html'
  a.click()
  URL.revokeObjectURL(url)
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
  const [resume, setResume] = useState<ResumeInfo>({ hhResumeUrl: '', resumePdfPath: '' })
  const [resumeUrlInput, setResumeUrlInput] = useState('')
  const [savingResume, setSavingResume] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  useEffect(() => {
    Promise.all([
      fetchAllUserAnswers(),
      fetchFilters(),
      fetchResume(),
    ]).then(([answers, f, r]) => {
      setItems(answers)
      setFilters(f)
      setResume(r)
      setResumeUrlInput(r.hhResumeUrl)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const params: Record<string, string> = { limit: '500' }
    if (activeCompany !== 'all') params.company = activeCompany
    if (activeType !== 'all') params.type = activeType
    if (activeRole !== 'all') params.role = activeRole
    fetchQuestions(params).then((data) => setQuestions(data.questions))
  }, [activeCompany, activeType, activeRole])

  const filteredQuestions = useMemo(() => {
    return questions
  }, [questions])

  const filteredAnswers = useMemo(() => {
    return items.filter((item) => {
      if (activeCompany !== 'all' && !item.companies.includes(activeCompany)) return false
      if (activeType !== 'all' && item.category !== activeType) return false
      return true
    })
  }, [items, activeCompany, activeType])

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

      <div className={s['resume-section']}>
        <h3><Link size={16} /> Резюме</h3>
        <div className={s['resume-row']}>
          <input
            type="url"
            placeholder="Ссылка на резюме HH (https://hh.ru/resume/...)"
            value={resumeUrlInput}
            onChange={(e) => setResumeUrlInput(e.target.value)}
            className={s['resume-input']}
          />
          <button
            className={s['resume-save']}
            onClick={async () => {
              setSavingResume(true)
              await saveResumeUrl(resumeUrlInput)
              setResume(prev => ({ ...prev, hhResumeUrl: resumeUrlInput }))
              setSavingResume(false)
            }}
            disabled={savingResume}
          >
            {savingResume ? '...' : 'Сохранить'}
          </button>
        </div>
        <div className={s['resume-row']}>
          <label className={s['resume-upload']}>
            <Upload size={14} />
            <span>{resume.resumePdfPath ? 'Заменить PDF' : 'Загрузить PDF'}</span>
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploadingPdf(true)
                const path = await uploadResumePdf(file)
                if (path) setResume(prev => ({ ...prev, resumePdfPath: path }))
                setUploadingPdf(false)
              }}
            />
          </label>
          {resume.resumePdfPath && (
            <span className={s['resume-pdf-name']}>
              <FileText size={14} />
              {resume.resumePdfPath.split('/').pop()}
            </span>
          )}
          {uploadingPdf && <span className={s['resume-pdf-name']}>Загрузка...</span>}
        </div>
      </div>

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
              <button className={s['export-btn']} onClick={() => exportAnswersPDF(filteredAnswers)}>
                <FileText size={16} /> PDF
              </button>
              <button className={s['export-btn']} onClick={() => exportAnswersMarkdown(filteredAnswers)}>
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
