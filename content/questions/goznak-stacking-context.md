---
id: goznak-stacking-context
title: Как работают z-index, stacking context и top layer?
category: CSS
scope: language-specific
languages: ["CSS", "HTML", "JavaScript"]
roles: ["Frontend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["z-index", "Stacking Context", "Top Layer"]
duration: 15 мин
difficulty: 4
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=2985s"
---

## Короткий ответ

`z-index` сравнивается только внутри одного stacking context; ребёнок не может обойти соседний context родителя даже огромным числом. Context создают, среди прочего, positioned element с `z-index`, fixed/sticky, opacity меньше 1, transform, isolation и contain. Для modal/popover предпочтителен browser top layer через `dialog` или Popover API: он находится выше document stacking contexts и снижает потребность в portal.

## Контекст

Проверяются реальные ограничения слоёв, а не правило «больше число — выше».

## Как строить ответ

### Найти context

Проверить предков и причины создания нового слоя наложения.

### Сравнить siblings

Сначала позиции родительских contexts, потом детей внутри них.

### Выбрать top layer

Dialog/Popover для перекрывающих интерфейсов с правильной семантикой.


## Код из интервью

```javascript
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

Stacking context — это группа элементов, которые отрисовываются вместе и сравниваются как единое целое по z-index. Новый stacking context создают: 1) position: relative/absolute + z-index; 2) opacity < 1; 3) transform, filter, will-change; 4) position: fixed/sticky. Пример проблемы:

```css
.parent { position: relative; z-index: 1; }
.child { position: relative; z-index: 9999; }
.sibling { position: relative; z-index: 2; }
```

z-index работает только внутри stacking context. Top layer (modal, dialog) — всегда поверх всех stacking contexts. На практике: если элемент «не поднимается» — проверяю, не создал ли родитель новый stacking context. Использую position: fixed + z-index для модалок.

## Частые ошибки

- Увеличивать `z-index` до бесконечности.
- Смешивать stacking context и compositor layer.
- Делать modal без focus management.

## Дополнительные вопросы

- Что создаёт stacking context?
- Когда portal всё ещё нужен?

