import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { fetchCurrentUser, loginWithYandex, logout, type User } from '../api'
import s from '../App.module.css'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurrentUser().then(u => { setUser(u); setLoading(false) })
  }, [])

  function handleLogout() {
    logout().then(() => setUser(null))
  }

  if (loading) return null

  if (user) {
    return (
      <div className={s['user-menu']} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="/profile" className={s['user-avatar-link']}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className={s['user-avatar']} />
          ) : (
            <div className={s['user-avatar-placeholder']}>{user.displayName[0]}</div>
          )}
        </a>
        <a href="/profile" className={s['user-name']}>{user.displayName}</a>
        <button className={s['auth-btn-logout']} onClick={handleLogout} title="Выйти">
          <LogOut size={16} />
        </button>
      </div>
    )
  }

  return (
    <button className={s['auth-btn']} onClick={loginWithYandex} aria-label="Войти через Яндекс">
      <span className={s['yandex-mark']} aria-hidden="true">Я</span>
      <span>Войти через Яндекс</span>
    </button>
  )
}
