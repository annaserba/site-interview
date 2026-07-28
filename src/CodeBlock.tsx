import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { Code2 } from 'lucide-react'
import s from './CodeBlock.module.css'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export function CodeBlock({ code, language, title = 'Код из интервью' }: CodeBlockProps) {
  return (
    <div className={s.block}>
      <div className={s.head}>
        <Code2 size={15} />
        <span>{title}</span>
        {language && <small>{language}</small>}
      </div>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {`\`\`\`${language || 'text'}\n${code}\n\`\`\``}
      </Markdown>
    </div>
  )
}
