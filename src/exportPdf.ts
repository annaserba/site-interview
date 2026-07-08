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
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 100%; margin: 0 auto; padding: 14px; color: #222; line-height: 1.35; }
h1 { font-size: 18px; margin-bottom: 16px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.q { border: 1px solid #ddd; border-radius: 10px; padding: 12px 14px; background: #fafafa; break-inside: avoid; }
.q h2 { font-size: 12px; margin: 0 0 5px; line-height: 1.3; }
.answer { background: #f3f3f3; padding: 6px 10px; margin-bottom: 6px; border-radius: 5px; white-space: pre-wrap; font-size: 10px; }
.answer p { margin: 0 0 4px; }
.answer ul { margin: 2px 0; padding-left: 16px; }
.answer li { margin-bottom: 1px; }
.answer strong { font-weight: 700; color: #111; }
.answer code { font-family: 'SF Mono', 'JetBrains Mono', monospace; font-size: 9px; background: #e0e0e0; padding: 1px 4px; border-radius: 3px; color: #c7254e; }
.answer pre { margin: 4px 0; padding: 10px 12px; background: #1e1e1e; border-radius: 6px; overflow-x: auto; line-height: 1.5; }
.answer pre code { background: none; padding: 0; color: #d4d4d4; font-size: 9px; white-space: pre; }
/* Syntax */
.k { color: #569cd6; }  /* keyword */
.s { color: #ce9178; }  /* string */
.c { color: #6a9955; }  /* comment */
.n { color: #b5cea8; }  /* number */
.f { color: #dcdcaa; }  /* function */
.t { color: #569cd6; }  /* tag */
.a { color: #9cdcfe; }  /* attr */
.p { color: #d7ba7d; }  /* property */
.label { font-size: 8px; text-transform: uppercase; color: #999; margin-bottom: 2px; font-family: monospace; letter-spacing: 0.04em; }`

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
