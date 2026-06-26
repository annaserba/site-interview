---
id: yandex-frontend-optimization
title: Какие методы оптимизации фронтенда вы знаете?
aliases: []
category: Browser Performance
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Яндекс"]
level: Middle
stage: Техническое
tags: ["Performance", "Optimization", "Web Vitals", "Bundle"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Оптимизация фронтенда охватывает уменьшение размера бандла (code splitting, tree shaking, compression), кэширование (HTTP cache, service workers), оптимизацию рендеринга (critical CSS, lazy loading, memo) и мониторинг производительности через Web Vitals (LCP, FID, CLS) и Lighthouse. Важно подходить системно: сначала измерить, затем оптимизировать каждое узкое место.

## Контекст

Интервьюер хочет убедиться, что вы знаете конкретные техники, а не просто слышали слова «оптимизация». Ожидается структурированный ответ по категориям (бандл, рендеринг, кэширование, измерение) и понимание, когда какая техника применима.

## Как строить ответ

### Уменьшение размера бандла

Code splitting по роутам и компонентам (dynamic import, React.lazy). Tree shaking — удаление неиспользуемого экспорта (ES modules, sideEffects: false). Анализ бандла через webpack-bundle-analyzer. Минификация и uglify. Дедупликация зависимостей.

### Сетевая оптимизация и кэширование

Сжатие gzip/brotli на сервере. CDN для статики. HTTP-кэширование (Cache-Control, ETag). Preloading критических ресурсов, prefetching следующих страниц. Service workers для кэширования и offline.

### Оптимизация рендеринга

Critical CSS — инлайн только выше-folding стилей. Lazy loading изображений и компонентов (IntersectionObserver, loading="lazy"). Мемоизация (React.memo, useMemo, useCallback) для предотвращения лишних ре-рендеров. Virtual scrolling для длинных списков. Избегание layout thrashing (чтение DOM и запись раздельно).

### Измерение производительности

Web Vitals: LCP (largest contentful paint < 2.5s), FID (first input delay < 100ms), CLS (cumulative layout shift < 0.1). Lighthouse для аудита. Chrome DevTools Performance tab для профилирования рендеринга и JS. Real User Monitoring (RUM) для данных с реальных пользователей.

## Код из интервью

```javascript
// Динамическая загрузка компонента (code splitting + lazy)
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}

// Lazy loading изображения с IntersectionObserver
function LazyImage({ src, alt }) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible && <img src={src} alt={alt} loading="lazy" />}
    </div>
  );
}
```

## Пример ответа

Оптимизация фронтенда делится на несколько уровней:

**Бандл:** Используем code splitting по роутам — каждая страница загружается только при навигации. Tree shaking удаляет неиспользуемый код. Webpack-bundle-analyzer помогает найти тяжёлые зависимости. Сжатие gzip/brotli на сервере уменьшает размер передачи на 60-80%.

**Рендеринг:** Critical CSS инлайним в `<head>` для быстрой отрисовки выше-folding контента. Lazy loading для изображений и тяжёлых компонентов. React.memo и useMemo предотвращают лишние ре-рендеры. Virtual scrolling (react-window) для списков из тысяч элементов.

**Кэширование:** Статика на CDN с длинным Cache-Control. Service worker для кэширования API-ответов и offline-режима. Preloading для критических шрифтов и CSS.

**Измерение:** Начинаем с Lighthouse — получаем общий скор. Далее смотрим Web Vitals в Chrome DevTools. На проде — RUM для реальных данных. Оптимизируем самое медленное, а не всё подряд.

## Частые ошибки

- Оптимизировать без измерения — тратить время на то, что не является bottle neck.
- Считать, что smaller bundle = быстрее страница —忽略了 рендеринг и кэширование.
- Использовать React.memo повсеместно вместо профилирования ре-рендеров.
- Забывать про Web Vitals на проде — Lighthouse в dev-режиме не отражает реальность.

## Дополнительные вопросы

- Как измерить и улучшить CLS (Cumulative Layout Shift)?
- В чём разница между lazy loading и prefetching?
- Как service worker влияет на кэширование и инвалидацию?
- Что такое React Server Components и как они помогают оптимизации?
