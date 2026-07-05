import { useState } from 'react'
import s from './CookieConsent.module.css'

const STORAGE_KEY = 'cookie_consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={s.banner}>
      <p className={s.text}>
        Мы используем файлы cookie для работы сайта. Продолжая, вы соглашаетесь с{' '}
        <a href="#privacy" className={s.link}>политикой конфиденциальности</a>.
      </p>
      <button className={s.btn} onClick={accept}>OK</button>
    </div>
  )
}
