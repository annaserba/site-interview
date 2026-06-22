---
id: avito-accessibility-grid
title: Как CSS Grid влияет на доступность и как это исправить?
category: CSS
scope: multi-language
languages: ["CSS"]
roles: ["Frontend-разработчик"]
companies: ["Avito"]
level: Middle
stage: Техническое
tags: ["CSS Grid", "Accessibility", "a11y", "Semantic HTML"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

CSS Grid через order и grid-column изменяет визуальный порядок, но не DOM-порядок — таб-навигация идёт по исходному порядку, что вводит пользователей screen reader в замешательство. display: contents может скрыть элемент от скринридера. grid-template-areas помогает сохранять семантику.

## Контекст

Интервьюер проверяет понимание влияния CSS Grid на доступность: как visual reflow влияет на таб-навигацию, семантику HTML и работу screen reader'ов.

## Как строить ответ

### Объяснить проблему order и grid-column

CSS изменяет визуальный порядок, но DOM остаётся тем же. Скринридер и таб-навигация следуют DOM, поэтому порядок прослушивания не совпадает с визуальным.

### Описать проблему display: contents

display: contents удаляет элемент из accessibility tree — скринридер его не видит. Это полезно для обёрток, но опасно, если элемент содержит контент.

### Показать grid-template-areas и семантику

grid-template-areas позволяет задать визуальный порядок через именованные области, сохраняя семантический порядок в DOM.

### Дать рекомендации

Используйте семантический HTML, избегайте order для изменения порядка контента, тестируйте с screen reader и таб-навигацией.

## Код из интервью

```css
/* Плохо — порядок для скринридера другой */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.sidebar { order: 2; }
.main { order: 1; }

/* Лучше — grid-template-areas сохраняет семантику */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-areas:
    "header header"
    "main sidebar"
    "footer footer";
}
.header { grid-area: header; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }

/* Опасно — display: contents скрывает элемент */
.hidden-wrapper {
  display: contents; /* скринридер не видит этот div */
}
```

## Пример ответа

CSS Grid может сломать доступность двумя способами: order/grid-column меняют визуальный порядок, но не DOM — скринридер читает в другом порядке. Используйте grid-template-areas вместо order.

display: contents удаляет элемент из accessibility tree. Это полезно для wrapper-дивов, но опасно если элемент содержит текст или интерактивные элементы — скринридер его пропустит.

Практические рекомендации: используйте семантический HTML (nav, main, article), не меняйте порядок через CSS, тестируйте таб-навигацией и screen reader (VoiceOver, NVDA).

## Частые ошибки

- Использовать order для изменения порядка важного контента — ломает таб-навигацию.
- Использовать display: contents на элементе с текстом — скринридер его не прочитает.
- Не тестировать с реальным screen reader — визуально всё ок, но a11y сломано.
- Полагаться только на CSS для семантики — семантика должна быть в HTML.

## Дополнительные вопросы

- Как протестировать доступность с помощьюaxe-core?
- В чём разница между aria-label и aria-labelledby?
- Как CSS Grid влияет на zoom 200% и high contrast mode?
- Как использовать ARIA для обозначения regions в Grid?
