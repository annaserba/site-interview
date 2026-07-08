import type { ApiQuestion, UserAnswerWithQuestion } from './api'

function openPrintWindow(html: string) {
  const w = window.open('', '_blank')!
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
  w.addEventListener('afterprint', () => w.close())
}

function highlightCode(code: string): string {
  return code
    // Strings
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="s">$&</span>')
    // Comments
    .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="c">$&</span>')
    // Keywords
    .replace(/\b(function|const|let|var|return|if|else|for|while|class|export|import|from|new|this|async|await|try|catch|throw|typeof|instanceof|void|delete|in|of|switch|case|break|continue|default|do|finally|with|yield|extends|super|static|get|set|private|public|protected|readonly|abstract|implements|interface|type|enum|namespace|module|require|true|false|null|undefined|NaN|Infinity)\b/g, '<span class="k">$&</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/g, '<span class="n">$&</span>')
    // Function calls
    .replace(/\b([a-zA-Z_$][\w$]*)\(/g, '<span class="f">$1</span>(')
    // HTML tags
    .replace(/&lt;(\/?)(\w[\w-]*)/g, '&lt;<span class="t">$1$2</span>')
    // HTML attributes
    .replace(/ (\w[\w-]*)=["']/g, ' <span class="a">$1</span>=<span class="s">"</span>')
    // CSS properties
    .replace(/([\w-]+):/g, '<span class="p">$1</span>:')
}

function formatAnswer(text: string): string {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks with highlighting
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang || 'plain'}">${highlightCode(code.trim())}</code></pre>`)

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Lists
  html = html.replace(/((?:^- .*\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(line =>
      `<li>${line.replace(/^- /, '')}</li>`
    ).join('')
    return `<ul>${items}</ul>`
  })

  const parts = html.split('\n\n')
  return parts.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
}

const pdfStyles = `@media print { body { padding: 0; } .grid { grid-template-columns: 1fr 1fr; } }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 100%; margin: 0 auto; padding: 14px; color: #222; line-height: 1.4; }
h1 { font-size: 18px; margin-bottom: 16px; font-weight: 700; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.q { border: 1px solid #d0d0d0; border-radius: 8px; padding: 14px 16px; break-inside: avoid; }
.q h2 { font-size: 13px; margin: 0 0 8px; line-height: 1.3; font-weight: 700; }
.answer { margin-bottom: 8px; white-space: pre-wrap; font-size: 10px; }
.answer p { margin: 0 0 4px; }
.answer ul { margin: 2px 0; padding-left: 16px; }
.answer li { margin-bottom: 1px; }
.answer strong { font-weight: 700; }
.answer code { font-family: 'SF Mono', 'JetBrains Mono', monospace; font-size: 9px; background: #f0f0f0; padding: 1px 4px; border-radius: 3px; color: #333; border: 1px solid #e0e0e0; }
.answer pre { margin: 4px 0 8px; padding: 10px 12px; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; overflow-x: auto; line-height: 1.5; }
.answer pre code { background: none; padding: 0; color: #333; font-size: 9px; white-space: pre; }
/* Syntax — light theme */
.k { color: #0033b3; }  /* keyword */
.s { color: #067d17; }  /* string */
.c { color: #8c8c8c; }  /* comment */
.n { color: #1750eb; }  /* number */
.f { color: #6c3e9c; }  /* function */
.t { color: #0033b3; }  /* tag */
.a { color: #871094; }  /* attr */
.p { color: #871094; }  /* property */
.label { font-size: 8px; text-transform: uppercase; color: #999; margin-bottom: 3px; font-family: monospace; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 2px; display: inline-block; }`

export function exportQuestionsPDF(questions: ApiQuestion[]) {
  let body = `<h1>Вопросы для собеседования (${questions.length})</h1><div class="grid">`
  for (const q of questions) {
    body += `<div class="q"><h2>${q.title}</h2>`
    body += `<div class="label">Ответ</div><div class="answer">${formatAnswer(q.answer || '')}</div>`
    if (q.example_answer) body += `<div class="label">Пример ответа</div><div class="answer">${formatAnswer(q.example_answer)}</div>`
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
      body += `<div class="label">Вариант ответа</div><div class="answer">${formatAnswer(answer.answer)}</div>`
    }
    body += '</div>'
  }
  body += '</div>'
  openPrintWindow(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Мои ответы</title><style>${pdfStyles}</style></head><body>${body}</body></html>`)
}
