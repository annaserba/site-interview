import { useEffect, useState } from 'react'
import { ArrowLeft, Download, FileText, Trash2 } from 'lucide-react'
import { fetchAllUserAnswers, deleteUserAnswer, type UserAnswerWithQuestion, type User } from './api'
import s from './ProfilePage.module.css'

interface ProfilePageProps {
  user: User
  onBack: () => void
}

function exportMarkdown(items: UserAnswerWithQuestion[]) {
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

function exportPDF(items: UserAnswerWithQuestion[]) {
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

  useEffect(() => {
    fetchAllUserAnswers().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

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

      <div className={s.stats}>
        <div className={s['stat-card']}>
          <strong>{totalQuestions}</strong>
          <span>{totalQuestions % 10 === 1 && totalQuestions % 100 !== 11 ? 'вопрос' : totalQuestions % 10 >= 2 && totalQuestions % 10 <= 4 && (totalQuestions % 100 < 10 || totalQuestions % 100 >= 20) ? 'вопроса' : 'вопросов'}</span>
        </div>
      </div>

      {totalAnswers > 0 && (
        <div className={s['export-actions']}>
          <button className={s['export-btn']} onClick={() => exportPDF(items)}>
            <FileText size={16} /> Экспорт в PDF
          </button>
          <button className={s['export-btn']} onClick={() => exportMarkdown(items)}>
            <Download size={16} /> Экспорт в Markdown
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
    </div>
  )
}
