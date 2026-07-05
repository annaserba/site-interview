const VERSION = 'in-depth-offline-v2'
const STATIC_CACHE = `${VERSION}:static`
const DATA_CACHE = `${VERSION}:data`

const APP_SHELL = [
  '/',
  '/index.html',
  '/data/questions.json',
  '/data/questions-index.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('in-depth-offline-') && !key.startsWith(VERSION))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)
  return cached || await network || Response.error()
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname === '/data/questions.json' || url.pathname === '/data/questions-index.json') {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE))
    return
  }

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => await caches.match(request) || caches.match('/index.html') || caches.match('/'))
    )
  }
})
