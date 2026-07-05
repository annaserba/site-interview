import { useEffect, useState } from 'react'
import { ProfilePage } from '../ProfilePage'
import { fetchCurrentUser, type User } from '../api'

export function ProfileLoader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCurrentUser()
      .then(u => setUser(u))
      .catch(() => setError('Не удалось проверить авторизацию'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Загрузка...</div>
  if (error) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
    <p>{error}</p>
    <a href="/" style={{ color: 'var(--acid)' }}>На главную</a>
  </div>
  if (!user) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
    <p>Нужно войти через Яндекс</p>
    <a href="/" style={{ color: 'var(--acid)' }}>На главную</a>
  </div>
  return <ProfilePage user={user} />
}
