---
id: yandex-intersection-observer-lazy-load
title: Реализуйте lazy loading изображений с помощью Intersection Observer
aliases: []
category: Web Platform
scope: universal
languages: ["JavaScript"]
roles: ["Frontend"]
companies: ["Яндекс"]
level: Junior
stage: Live coding
tags: ["Intersection Observer", "Lazy Loading", "Performance", "DOM"]
duration: 15 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Intersection Observer API позволяет отслеживать, когда элемент появляется в viewport. Для lazy loading изображений: храним реальный URL в data-src, подставляем в src при пересечении, отписываемся после загрузки. rootMargin позволяет начать загрузку заранее, до появления в viewport.

## Контекст

Интервьюер проверяет знание browser API для оптимизации производительности. Ожидается понимание Intersection Observer, работа с DOM, обработка fallback для старых браузеров и оптимизация (отписка, rootMargin).

## Как строить ответ

### HTML-структура

Изображение с пустым src (или плейсхолдером) и data-src с реальным URL. Это позволяет начать загрузку только при необходимости, а не при рендеринге страницы.

### Intersection Observer

Создаём observer с callback, который проверяет isIntersecting. При пересечении — подставляем data-src в src, отписываемся от наблюдения. observer.disconnect() после загрузки предотвращает утечку памяти.

### rootMargin для предзагрузки

rootMargin: '200px' — callback срабатывает, когда элемент ещё не виден, но до него 200px. Это даёт время начать загрузку заранее, чтобы пользователь не ждал.

### Fallback для старых браузер

Проверяем поддержку: if ('IntersectionObserver' in window). Если нет — загружаем все изображения сразу. Это graceful degradation.

### Disconnect и cleanup

Обязательно отписываемся после загрузки: observer.disconnect(). В React — в useEffect cleanup. Это предотвращает утечки памяти и лишние вызовы.

## Код из интервью

```html
<img class="lazy" data-src="image.jpg" src="placeholder.jpg" alt="Lazy loaded">
```

```javascript
function lazyLoadImages() {
  const images = document.querySelectorAll('img.lazy');

  if (!('IntersectionObserver' in window)) {
    // Fallback: загружаем все
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '200px 0px', // Начать загрузку за 200px до появления
      threshold: 0.01,
    }
  );

  images.forEach((img) => observer.observe(img));
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// React-компонент
function LazyImage({ src, alt, placeholder }) {
  const imgRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (!('IntersectionObserver' in window)) {
      img.src = src;
      setLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.onload = () => setLoaded(true);
          observer.unobserve(img);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={placeholder || ''}
      alt={alt}
      style={{ opacity: loaded ? 1 : 0.5, transition: 'opacity 0.3s' }}
    />
  );
}
```

## Пример ответа

Подход: используем data-src для хранения реального URL и Intersection Observer для отслеживания появления в viewport. При пересечении — подставляем src, отписываемся.

rootMargin: '200px' — начинаем загрузку за 200px до появления. Это важно для плавного UX: пользователь не видит задержки. threshold: 0.01 — достаточно 1% видимости элемента.

Fallback: если Intersection Observer не поддерживается — загружаем все изображения сразу. Это graceful degradation для старых браузеров.

В React: используем useRef для доступа к DOM-элементу и useEffect для подписки. Обязательно возвращаем cleanup с observer.disconnect().

## Частые ошибки

- Не отписываться от observer — утечка памяти и лишние вызовы callback.
- Не использовать rootMargin — загрузка начинается только при полном появлении в viewport, пользователь видит задержку.
- Забывать про fallback — старые браузеры не загрузят изображения вообще.
- Использовать вместо Intersection Observer scroll-события — менее эффективно, нет автоматической оптимизации браузером.

## Дополнительные вопросы

- В чём разница между Intersection Observer и scroll-событиями для lazy loading?
- Как реализовать lazy loading для видео или iframe?
- Что такое native lazy loading (loading="lazy") и когда лучше использовать JS-решение?
- Как Intersection Observer влияет на SEO — поисковики видят ли lazy-загруженный контент?
