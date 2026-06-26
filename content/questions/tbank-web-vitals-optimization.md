---
id: tbank-web-vitals-optimization
title: Как оптимизировать Core Web Vitals в крупном SPA?
category: Browser Performance
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["Web Vitals", "LCP", "FID", "CLS", "Performance"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

LCP (Largest Contentful Paint) — оптимизируйте largest element: preloading критических изображений, server-side rendering, image format (WebP/AVIF), приоритетная загрузка. FID (First Input Delay) — минимизируйте main thread blocking: code splitting, defer non-critical JS, web workers. CLS (Cumulative Layout Shift) — резервируйте пространство под изображения/ads, используйте font-display: swap. Измеряйте через Lighthouse, CrUX, PerformanceObserver.

## Контекст

Проверяется понимание метрик производительности веб-приложений и практических техник оптимизации для крупных SPA.

## Как строить ответ

### Назвать три метрики

LCP — загрузка контента, FID — интерактивность, CLS — стабильность визуала. Все три влияют на SEO и пользовательский опыт.

### LCP оптимизация

Preload hero image, SSR для начального HTML, responsive images, lazy loading для non-critical, server response time (TTFB).

### FID оптимизация

Code splitting (dynamic import), web workers для тяжёлых вычислений, defer/async скриптов, yield main thread (requestIdleCallback).

### CLS оптимизация

width/height на изображения, aspect-ratio CSS, font-display: swap, reserved space для dynamic content.


## Код из интервью

```typescript
// LCP: preload critical image
const link = document.createElement("link");
link.rel = "preload";
link.as = "image";
link.href = "/hero.webp";
document.head.appendChild(link);

// FID: defer heavy computation
async function processData(data: unknown[]) {
  // Yield to main thread
  await new Promise((resolve) => setTimeout(resolve, 0));
  return data.map((item) => heavyTransform(item));
}

// CLS: reserve space for images
// CSS: .ad-container { min-height: 250px; }

// Measure with PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "largest-contentful-paint") {
      console.log("LCP:", entry.startTime);
    }
  }
});
observer.observe({ type: "largest-contentful-paint", buffered: true });
```

## Пример ответа

Core Web Vitals — три метрики, измеряющие реальный пользовательский опыт:

LCP (Largest Contentful Paint) — время загрузки крупнейшего элемента. Оптимизация: preload hero image, responsive images (srcset), WebP/AVIF форматы, SSR для начального HTML.

```html
<link rel="preload" as="image" href="/hero.webp" />
<img src="/hero.webp" width="1200" height="600" fetchpriority="high" />
```

FID (First Input Delay) — задержка отклика на первый ввод. Code splitting, web workers, defer non-critical scripts.

```javascript
const module = await import("./heavy-module.js");
```

CLS (Cumulative Layout Shift) — визуальная стабильность. Always set dimensions, font-display: swap, reserved space.

## Частые ошибки

- Использовать только Lighthouse вместо реальных данных CrUX — лабораторные данные не отражают пользовательский опыт.
- Lazy loading hero image — LCP элемент должен загружаться приоритетно.
- Не резервировать пространство под динамический контент (ads, banners) — основная причина CLS.
- Игнорировать FCP — это precursor к LCP, если FCP медленный, LCP будет ещё хуже.


## Дополнительные вопросы

- Как измерить Core Web Vitals в реальном времени (RUM)?
- Что такое INP (Interaction to Next Paint) и как он заменяет FID?
- Как оптимизировать Web Vitals для SPA с client-side routing?
- Как service worker может повлиять на Core Web Vitals?
