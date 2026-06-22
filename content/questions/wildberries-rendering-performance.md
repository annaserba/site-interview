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
// Пример использования
const example = () => {
  const state = { loading: false, data: null, error: null };

  return {
    async fetch(url) {
      state.loading = true;
      try {
        const res = await fetch(url);
        state.data = await res.json();
      } catch (err) {
        state.error = err.message;
      } finally {
        state.loading = false;
      }
      return state;
    },
  };
};
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
