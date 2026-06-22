---
id: goznak-intersection-observer
title: Как работает Intersection Observer?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["IntersectionObserver", "Lazy loading", "Infinite scroll"]
duration: 15 мин
difficulty: 3
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=3360s"
---

## Короткий ответ

IntersectionObserver асинхронно сообщает о пересечении target с root по заданным thresholds с учётом rootMargin. Он подходит для lazy loading, sentinel бесконечной ленты и приблизительного visibility tracking, не обещая callback на каждый pixel или точную длительность видимости. Переиспользуйте observer, вызывайте `unobserve`/`disconnect`, учитывайте initial entry и не путайте `isIntersecting` с достаточной долей видимости.

## Контекст

Вопрос проверяет контракт API и его ограничения.

## Как строить ответ

### Конфигурация

Root, rootMargin и массив threshold.

### Entry

Intersection ratio, rects, time и isIntersecting.

### Lifecycle

Observe, unobserve, disconnect и cleanup.


## Код из интервью

```typescript
// Intersection Observer — ленивая загрузка
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "200px" }
);

document.querySelectorAll("img[data-src]").forEach(img => {
  observer.observe(img);
});
```

## Пример ответа

Intersection Observer API асинхронно отслеживает пересечение элемента с viewport. Пример lazy loading:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

Параметры: root — контейнер (null = viewport), rootMargin — отступ, threshold — порог видимости. В React: react-intersection-observer хук. Применения: lazy loading, infinite scroll, анимация при появлении, аналитика видимости рекламы. Важно: IntersectionObserver не блокирует main thread.

## Частые ошибки

- Создавать observer на каждый элемент.
- Ожидать синхронный callback.
- Использовать как точную систему рекламной аналитики.

## Дополнительные вопросы

- Как реализовать infinite scroll?
- Чем отличается от ResizeObserver?

