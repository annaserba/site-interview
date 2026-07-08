import type { ApiQuestion, UserAnswerWithQuestion } from './api'

function openPrintWindow(html: string) {
  const w = window.open('', '_blank')!
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
  w.addEventListener('afterprint', () => w.close())
}

const pdfStyles = `@media print { body { padding: 0; } .grid { grid-template-columns: 1fr 1fr; } }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 100%; margin: 0 auto; padding: 14px; color: #222; line-height: 1.35; }
h1 { font-size: 18px; margin-bottom: 16px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.q { border: 1px solid #ddd; border-radius: 10px; padding: 12px 14px; background: #fafafa; break-inside: avoid; }
.q h2 { font-size: 12px; margin: 0 0 5px; line-height: 1.3; }
.answer { background: #f0f0f0; padding: 6px 10px; margin-bottom: 6px; border-radius: 5px; white-space: pre-wrap; font-size: 10px; }
.label { font-size: 8px; text-transform: uppercase; color: #999; margin-bottom: 2px; font-family: monospace; letter-spacing: 0.04em; }`

export function exportQuestionsPDF(questions: ApiQuestion[]) {
  let body = `<h1>Вопросы для собеседования (${questions.length})</h1><div class="grid">`
  for (const q of questions) {
    body += `<div class="q"><h2>${q.title}</h2>`
    body += `<div class="label">Ответ</div><div class="answer">${q.answer || ''}</div>`
    if (q.example_answer) body += `<div class="label">Пример ответа</div><div class="answer">${q.example_answer}</div>`
    body += '</div>'
  }
  body += '</div>'
  openPrintWindow(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Вопросы для собеседования</title><style>${pdfStyles}</style></head><body>${body}</body></html>`)
}

export function exportAnswersPDF(items: UserAnswerWithQuestion[]) {
  const grouped = items.reduce<Record<string, UserAnswerWithQuestion[]>>((acc, item) => {
    if (!acc[item.question_id]) acc[item.question_id] = []
    acc[item.question_id].push(item)
    return acc
  }, {})

  let body = '<h1>Мои ответы на вопросы</h1><div class="grid">'
  for (const [, answers] of Object.entries(grouped)) {
    const first = answers[0]
    body += `<div class="q"><h2>${first.title}</h2>`
    for (const answer of answers) {
      body += `<div class="label">Вариант ответа</div><div class="answer">${answer.answer}</div>`
    }
    body += '</div>'
  }
  body += '</div>'
  openPrintWindow(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Мои ответы</title><style>${pdfStyles}</style></head><body>${body}</body></html>`)
}
