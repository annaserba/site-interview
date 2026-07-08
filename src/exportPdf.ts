import type { ApiQuestion, UserAnswerWithQuestion } from './api'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import plaintext from 'highlight.js/lib/languages/plaintext'
import githubCss from 'highlight.js/styles/github.css?inline'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c++', cpp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('plain', plaintext)
hljs.registerLanguage('text', plaintext)

function openPrintWindow(html: string) {
  const w = window.open('', '_blank')!
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
  w.addEventListener('afterprint', () => w.close())
}

function formatAnswer(text: string): string {
  if (!text) return ''

  // Extract code blocks before any escaping
  const codeBlocks: string[] = []
  let html = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langName = lang || 'plaintext'
    try {
      const result = hljs.getLanguage(langName)
        ? hljs.highlight(code.trim(), { language: langName })
        : hljs.highlightAuto(code.trim())
      codeBlocks.push(`<pre><code class="hljs language-${langName}">${result.value}</code></pre>`)
    } catch {
      codeBlocks.push(`<pre><code class="hljs">${highlightCodeFallback(code.trim())}</code></pre>`)
    }
    return `%%CODEBLOCK${codeBlocks.length - 1}%%`
  })

  // Escape only unescaped HTML
  html = html
    .replace(/&(?!(?:amp|lt|gt|quot|#39|#x27);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Restore code blocks
  html = html.replace(/%%CODEBLOCK(\d+)%%/g, (_, i) => codeBlocks[+i])

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

function highlightCodeFallback(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const pdfStyles = `@page { size: landscape; margin: 6mm; }
@media print { body { padding: 0; margin: 0; } }
*, *::before, *::after { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 100%; margin: 0; padding: 0; color: #222; line-height: 1.35; overflow-wrap: break-word; }
h1 { font-size: 16px; margin: 0 0 12px; font-weight: 700; }
.grid { column-count: 2; column-gap: 8px; }
.q { border: 1px solid #d0d0d0; border-radius: 6px; padding: 8px 8px; break-inside: avoid; margin-bottom: 8px; min-width: 0; overflow: hidden; }
.q h2 { font-size: 11px; margin: 0 0 6px; line-height: 1.3; font-weight: 700; }
.answer { margin-bottom: 6px; white-space: pre-wrap; font-size: 9px; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
.answer p { margin: 0 0 3px; padding: 0; }
.answer ul { margin: 2px 0; padding-left: 12px; }
.answer li { margin-bottom: 1px; }
.answer strong { font-weight: 700; }
.answer code { font-family: 'SF Mono', 'JetBrains Mono', monospace; font-size: 8px; background: #f0f0f0; padding: 1px 3px; border-radius: 3px; color: #333; border: 1px solid #e0e0e0; }
.answer pre { margin: 3px 0 6px; padding: 6px 8px; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; overflow-x: auto; line-height: 1.4; max-width: 100%; white-space: pre-wrap; word-break: break-all; }
.answer pre code { background: none; padding: 0; color: #333; font-size: 8px; white-space: pre-wrap; word-break: break-all; }
.label { font-size: 7px; text-transform: uppercase; color: #999; margin-bottom: 2px; font-family: monospace; letter-spacing: 0.04em; border-bottom: 1px solid #eee; padding-bottom: 1px; display: inline-block; }`

export function exportQuestionsPDF(questions: ApiQuestion[]) {
  let body = `<h1>Вопросы для собеседования (${questions.length})</h1><div class="grid">`
  for (const q of questions) {
    const example = (q as any).example_answer || (q as any).exampleAnswer || ''
    body += `<div class="q"><h2>${q.title}</h2>`
    body += `<div class="label">Ответ</div><div class="answer">${formatAnswer(q.answer || '')}</div>`
    if (example) body += `<div class="label">Пример ответа</div><div class="answer">${formatAnswer(example)}</div>`
    body += '</div>'
  }
  body += '</div>'
  openPrintWindow(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Вопросы для собеседования</title><style>${githubCss}\n${pdfStyles}</style></head><body>${body}</body></html>`)
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
  openPrintWindow(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Мои ответы</title><style>${githubCss}\n${pdfStyles}</style></head><body>${body}</body></html>`)
}
