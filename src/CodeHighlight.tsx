import { useMemo } from 'react'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'

// Подсветка синтаксиса кода через highlight.js (общий набор языков: js/ts/python/java/go/sql и др.)
export function highlightCode(code: string, language?: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value
    }
    return hljs.highlightAuto(code).value
  } catch {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

export function CodeHighlight({ code, language, className }: { code: string; language?: string; className?: string }) {
  const html = useMemo(() => highlightCode(code, language), [code, language])
  return (
    <pre className={className} style={{ margin: 0 }}>
      <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}
