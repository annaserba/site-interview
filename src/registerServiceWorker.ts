export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  // В dev-режиме сносим Service Worker и CacheStorage, оставшиеся от прод-билдов
  // на этом же origin: иначе SW перехватывает запросы и показывает устаревшую
  // «офлайн-версию» сайта поверх живого dev-сервера.
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    })
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
    }
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.info('Offline cache is unavailable:', error)
    })
  })
}
