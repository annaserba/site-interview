import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { blogArticles } from './blog-articles'
import s from './BlogPage.module.css'

interface BlogPageProps {
  onOpenArticle: (id: string) => void
  onBack: () => void
}

export function BlogPage({ onOpenArticle, onBack }: BlogPageProps) {
  return (
    <div className={s.page}>
      <button className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
      <h1>Блог</h1>
      <p className={s.subtitle}>Практические руководства по прохождению технических собеседований</p>
      <div className={s.grid}>
        {blogArticles.map((article) => (
          <article key={article.id} className={s.card} onClick={() => onOpenArticle(article.id)}>
            <div className={s['card-tags']}>
              {article.tags.map((tag) => <span key={tag} className={s.tag}><Tag size={10} /> {tag}</span>)}
            </div>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <div className={s['card-footer']}>
              <span className={s['read-time']}><Clock size={12} /> {article.readTime}</span>
              <span className={s['read-more']}>Читать →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
