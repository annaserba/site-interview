import { useEffect, useMemo, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { safeGetItem, safeSetItem } from './safeStorage'
import s from './ProfilePage.module.css'

interface ChecklistItem {
  id: string
  label: string
  link?: { hash: string; label: string }
}

interface ChecklistStage {
  id: string
  title: string
  items: ChecklistItem[]
}

const CHECKLIST: ChecklistStage[] = [
  {
    id: 'story',
    title: 'Самопрезентация',
    items: [
      { id: 'intro', label: '«Расскажите о себе» — ответ на 60–90 секунд, проговорён вслух' },
      { id: 'star', label: '3–5 STAR-историй: конфликт, ошибка, достижение, сложное решение' },
      { id: 'goals', label: 'Ответы на «почему мы» и «куда растёте»' },
    ],
  },
  {
    id: 'theory',
    title: 'Теория',
    items: [
      { id: 'roadmap', label: 'Пройден роадмап своей роли, темы отмечены', link: { hash: 'roadmaps', label: 'Открыть роадмапы' } },
      { id: 'company', label: 'Разобраны вопросы целевой компании', link: { hash: 'all-questions', label: 'Вопросы по компаниям' } },
      { id: 'weak', label: 'Слабые темы повторены отдельно' },
    ],
  },
  {
    id: 'practice',
    title: 'Практика',
    items: [
      { id: 'mock', label: 'Минимум 3 мок-интервью с ИИ-оценкой', link: { hash: 'mock-interview', label: 'Пройти мок-интервью' } },
      { id: 'livecode', label: 'Лайвкодинг: задачи на JS/алгоритмы вслух и с таймером' },
      { id: 'sysdesign', label: 'Одна системная дизайн-сессия «спроектируйте систему»' },
      { id: 'voice', label: 'Ответы проговорены голосом, а не только прочитаны' },
    ],
  },
  {
    id: 'logistics',
    title: 'Логистика и финал',
    items: [
      { id: 'cv', label: 'Резюме обновлено и вычитано, ссылки рабочие' },
      { id: 'setup', label: 'Тихое место, проверены камера, микрофон и интернет' },
      { id: 'questions', label: 'Подготовлены 2–3 вопроса интервьюеру' },
      { id: 'feedback', label: 'Попросить фидбэк в конце интервью' },
    ],
  },
]

const storageKey = (userId?: number) => `sobes_prep_checklist:${userId ?? 'guest'}`

const readChecked = (userId?: number): string[] => {
  try {
    const raw = safeGetItem(storageKey(userId))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function PrepChecklist({ userId }: { userId?: number }) {
  const [checked, setChecked] = useState<string[]>(() => readChecked(userId))

  useEffect(() => { safeSetItem(storageKey(userId), JSON.stringify(checked)) }, [checked, userId])

  const done = useMemo(() => new Set(checked), [checked])
  const total = CHECKLIST.reduce((acc, stage) => acc + stage.items.length, 0)
  const percent = total ? Math.round((done.size / total) * 100) : 0

  const toggle = (id: string) => {
    setChecked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <div className={s.checklist}>
      <div className={s['checklist-head']}>
        <div>
          <h2>Чеклист подготовки к собеседованию</h2>
          <p>Отметки сохраняются в вашем браузере.</p>
        </div>
        <div className={s['checklist-progress']}>
          <span className={s['checklist-num']}>{percent}%</span>
          <div className={s['checklist-bar']}><div style={{ width: `${percent}%` }} /></div>
          <span className={s['checklist-count']}>{done.size} из {total}</span>
        </div>
      </div>

      {done.size > 0 && (
        <button type="button" className={s['checklist-reset']} onClick={() => setChecked([])}>
          <RotateCcw size={13} /> Сбросить прогресс
        </button>
      )}

      {CHECKLIST.map((stage) => {
        const stageDone = stage.items.every((item) => done.has(item.id))
        return (
          <section key={stage.id} className={`${s['checklist-stage']} ${stageDone ? s.complete : ''}`}>
            <h3>{stage.title}</h3>
            <ul>
              {stage.items.map((item) => {
                const isDone = done.has(item.id)
                return (
                  <li key={item.id} className={isDone ? s.done : ''}>
                    <button
                      type="button"
                      className={s['checklist-check']}
                      onClick={() => toggle(item.id)}
                      aria-pressed={isDone}
                      aria-label={isDone ? `Снять отметку: ${item.label}` : `Отметить: ${item.label}`}
                    >
                      {isDone && <Check size={13} />}
                    </button>
                    <span className={s['checklist-label']}>{item.label}</span>
                    {item.link && <a href={`#${item.link.hash}`} className={s['checklist-link']}>{item.link.label}</a>}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
