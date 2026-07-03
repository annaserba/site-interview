import { ArrowLeft, Clock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { blogArticles } from './blog-articles'
import s from './BlogPage.module.css'

interface ArticlePageProps {
  articleId: string
  onBack: () => void
}

export function ArticlePage({ articleId, onBack }: ArticlePageProps) {
  const article = blogArticles.find((a) => a.id === articleId)
  if (!article) return <div className={s.page}>Статья не найдена</div>

  return (
    <div className={s.page}>
      <button className={s.back} onClick={onBack}><ArrowLeft /> К блогу</button>
      <article className={s.article}>
        <div className={s['article-meta']}>
          {article.tags.map((tag) => <span key={tag} className={s.tag}><Tag size={10} /> {tag}</span>)}
          <span className={s['read-time']}><Clock size={12} /> {article.readTime}</span>
        </div>
        <h1>{article.title}</h1>
        <div className={s['article-content']}>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
