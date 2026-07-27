// Безопасный доступ к localStorage: в некоторых окружениях (webview с запретом
// хранилища, режим блокировки cookie в браузере) любое обращение к localStorage
// бросает SecurityError и роняет приложение ещё на этапе маунта.

export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Хранилище недоступно — просто работаем без персистентности.
  }
}

export function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // noop
  }
}
