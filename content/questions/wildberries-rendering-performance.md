---
id: wildberries-rendering-performance
title: Чем отличаются reflow, repaint и compositing?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript", "CSS"]
roles: ["Frontend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Layout", "Paint", "Composite"]
duration: 15 мин
difficulty: 4
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=621s"
sourceVideos: [{"company":"Wildberries","url":"https://www.youtube.com/watch?v=HF7zkpSrByE&t=621s"},{"company":"Frontend-интервью","url":"https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2850s"}]
---

## Короткий ответ

Layout/reflow пересчитывает геометрию и может затронуть большую часть дерева; paint перерисовывает пиксели для изменившихся visual properties; composite собирает уже растеризованные слои. Анимации `transform` и `opacity` часто обходятся compositing, но отдельный слой не бесплатен — он потребляет GPU memory. Чередование DOM writes и layout reads вызывает forced synchronous layout и layout thrashing.

## Контекст

Нужно объяснить стоимость изменений и практическую диагностику rendering performance.

## Как строить ответ

### Классифицировать свойство

Изменение width влияет на layout, background — обычно на paint, transform — часто только на composite.

### Устранить thrashing

Группируйте reads до writes, используйте `requestAnimationFrame`, containment и virtualized lists.

### Измерить

Проверяйте Performance panel, long frames, Layout events, paint flashing и memory layers.


## Код из интервью

```typescript
// Layout thrashing: interleaving reads and writes
function animateBadge(el: HTMLElement) {
  el.style.width = '100px';    // write → triggers layout
  const h = el.offsetHeight;   // read → forces synchronous layout
  el.style.height = h + 'px';  // write → layout again
}

// Correct: batch reads, then writes
function animateBadgeOptimized(el: HTMLElement) {
  const h = el.offsetHeight;   // read (no pending writes)
  el.style.width = '100px';
  el.style.height = h + 'px';
}

// Use requestAnimationFrame for smooth visual updates
let position = 0;
function animate() {
  position += 2;
  el.style.transform = `translateX(${position}px)`; // composite-only
  if (position < 500) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

## Пример ответа

Reflow (layout) — пересчёт геометрии (position, size) для одного или нескольких элементов. Paint (repaint) — перерисовка пикселей (color, shadow, text). Composite — объединение слоёв в финальное изображение. Стоимость: Reflow > Paint > Composite. Reflow вызывает: изменение размеров, position, font, добавление/удаление элементов. Paint вызывает: color, background, shadow. Composite вызывает: transform, opacity. На практике: использую transform вместо top/left (composite-only), will-change для создания нового слоя, избегаю layout thrashing (чтение layout после записи).

## Частые ошибки

- Утверждать, что repaint запускается при любом изменении.
- Добавлять `will-change` всем элементам.
- Оптимизировать свойства без профиля кадра.

## Дополнительные вопросы

- Что вызывает forced reflow?
- Когда `transform` всё равно приводит к paint?
- Чем `content-visibility` помогает большим страницам?
