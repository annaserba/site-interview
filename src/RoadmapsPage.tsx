import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Map, Route } from 'lucide-react'
import { roadmaps, roadmapGroups, matchTopicQuestions, countStepQuestions, type Roadmap, type RoadmapTopic } from './roadmaps'
import { questionWord } from './filters'
import type { Question } from './types'
import { safeGetItem, safeSetItem } from './safeStorage'
import s from './RoadmapsPage.module.css'

const PROGRESS_KEY = 'sobes_roadmap_progress'

type ProgressMap = Record<string, string[]>

const readProgress = (): ProgressMap => {
  try {
    const raw = safeGetItem(PROGRESS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch { return {} }
}

interface TopicRowProps {
  roadmapId: string
  topic: RoadmapTopic
  questions: Question[]
  done: boolean
  onToggle: () => void
}

function TopicRow({ roadmapId, topic, questions, done, onToggle }: TopicRowProps) {
  const [open, setOpen] = useState(false)
  const matched = useMemo(() => matchTopicQuestions(topic, questions).slice(0, 12), [topic, questions])
  const total = useMemo(() => matchTopicQuestions(topic, questions).length, [topic, questions])

  return (
    <div className={`${s.topic} ${done ? s.done : ''}`}>
      <div className={s['topic-head']}>
        <button
          type="button"
          className={s.check}
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? `Отметить тему «${topic.title}» как неизученную` : `Отметить тему «${topic.title}» как изученную`}
        >
          {done && <Check size={13} />}
        </button>
        <span className={s['topic-title']}>{topic.title}</span>
        {total > 0 && (
          <button
            type="button"
            className={`${s['topic-count']} ${open ? s.open : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {total} {questionWord(total)} <ChevronDown size={13} />
          </button>
        )}
        {total === 0 && <span className={s['topic-empty']}>скоро</span>}
      </div>
      {open && total > 0 && (
        <ul className={s['topic-questions']}>
          {matched.map((q) => (
            <li key={q.id}>
              <a href={`#question/${q.id}`}>{q.title}</a>
            </li>
          ))}
          {total > matched.length && (
            <li className={s['topic-more']}>и ещё {total - matched.length} — ищите по базе вопросов</li>
          )}
        </ul>
      )}
    </div>
  )
}

export function RoadmapsPage({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [group, setGroup] = useState(roadmapGroups[0])
  const [roadmapId, setRoadmapId] = useState(roadmaps[0].id)
  const [progress, setProgress] = useState<ProgressMap>(readProgress)

  useEffect(() => { safeSetItem(PROGRESS_KEY, JSON.stringify(progress)) }, [progress])

  const groupRoadmaps = roadmaps.filter((r) => r.group === group)
  const roadmap: Roadmap = groupRoadmaps.find((r) => r.id === roadmapId) ?? groupRoadmaps[0]

  const doneTopics = new Set(progress[roadmap.id] ?? [])
  const totalTopics = roadmap.steps.reduce((acc, step) => acc + step.topics.length, 0)
  const doneCount = roadmap.steps.reduce((acc, step) => acc + step.topics.filter((t) => doneTopics.has(t.id)).length, 0)
  const percent = totalTopics ? Math.round((doneCount / totalTopics) * 100) : 0

  const toggleTopic = (topicId: string) => {
    setProgress((prev) => {
      const current = new Set(prev[roadmap.id] ?? [])
      if (current.has(topicId)) current.delete(topicId)
      else current.add(topicId)
      return { ...prev, [roadmap.id]: [...current] }
    })
  }

  return (
    <div className={s.page}>
      <button type="button" className={s.back} onClick={onBack}><ArrowLeft size={16} /> Назад</button>

      <header className={s.header}>
        <h1><Route size={28} /> Роадмапы</h1>
        <p>Пошаговые планы подготовки по ролям. Отмечайте изученные темы — прогресс сохраняется в браузере. К каждой теме подобраны вопросы из базы.</p>
      </header>

      <div className={s.groups} role="tablist" aria-label="Направления">
        {roadmapGroups.map((g) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={g === group}
            className={`${s.group} ${g === group ? s.active : ''}`}
            onClick={() => { setGroup(g); setRoadmapId(roadmaps.find((r) => r.group === g)!.id) }}
          >
            {g}
          </button>
        ))}
      </div>

      {groupRoadmaps.length > 1 && (
        <div className={s.tracks} role="tablist" aria-label="Треки">
          {groupRoadmaps.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === roadmap.id}
              className={`${s.track} ${r.id === roadmap.id ? s.active : ''}`}
              onClick={() => setRoadmapId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className={s['roadmap-head']}>
        <div>
          <h2>{roadmap.group} · {roadmap.label}</h2>
          <p>{roadmap.description}</p>
        </div>
        <div className={s.progress}>
          <span className={s['progress-num']}>{percent}%</span>
          <div className={s['progress-bar']}>
            <div style={{ width: `${percent}%` }} />
          </div>
          <span className={s['progress-label']}>{doneCount} из {totalTopics} тем</span>
        </div>
      </div>

      <ol className={s.steps}>
        {roadmap.steps.map((step, index) => {
          const count = countStepQuestions(step, questions)
          const stepDone = step.topics.every((t) => doneTopics.has(t.id))
          return (
            <li key={step.id} className={`${s.step} ${stepDone ? s.complete : ''}`}>
              <div className={s['step-marker']}>
                <span className={s['step-num']}>{stepDone ? <Check size={15} /> : index + 1}</span>
                {index < roadmap.steps.length - 1 && <span className={s['step-line']} />}
              </div>
              <div className={s['step-body']}>
                <div className={s['step-head']}>
                  <h3>{step.title.replace(/^Шаг \d+\.\s*/, '')}</h3>
                  {count > 0 && <span className={s['step-count']}><Map size={12} /> {count} {questionWord(count)}</span>}
                </div>
                <p className={s['step-desc']}>{step.description}</p>
                <div className={s.topics}>
                  {step.topics.map((topic) => (
                    <TopicRow
                      key={topic.id}
                      roadmapId={roadmap.id}
                      topic={topic}
                      questions={questions}
                      done={doneTopics.has(topic.id)}
                      onToggle={() => toggleTopic(topic.id)}
                    />
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
