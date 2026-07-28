import { ArrowLeft } from 'lucide-react'
import { PrepChecklist } from './PrepChecklist'
import s from './ProfilePage.module.css'

export function ChecklistPage({ userId, onBack }: { userId?: number; onBack?: () => void }) {
  return (
    <div className={s.page}>
      {onBack ? (
        <button type="button" className={s.back} onClick={onBack}><ArrowLeft /> Назад</button>
      ) : (
        <a href="/" className={s.back} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft /> На главную</a>
      )}
      <PrepChecklist userId={userId} />
    </div>
  )
}
