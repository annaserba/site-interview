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

## Частые ошибки

- Увеличивать `z-index` до бесконечности.
- Смешивать stacking context и compositor layer.
- Делать modal без focus management.

## Дополнительные вопросы

- Что создаёт stacking context?
- Когда portal всё ещё нужен?

