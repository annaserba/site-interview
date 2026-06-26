import s from './InterviewerAvatar.module.css'

export function InterviewerAvatar({ name = 'Интервьюер', size = 64 }: { name?: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className={s.avatar} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bg)" />
        <circle cx="50" cy="38" r="16" fill="rgba(255,255,255,0.9)" />
        <ellipse cx="50" cy="72" rx="24" ry="18" fill="rgba(255,255,255,0.9)" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </svg>
    </div>
  )
}
