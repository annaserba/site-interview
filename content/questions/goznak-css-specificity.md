---
id: goznak-css-specificity
title: Как рассчитывается специфичность CSS-селекторов?
category: CSS
scope: language-specific
languages: ["CSS", "HTML"]
roles: ["Frontend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["CSS", "Specificity", "Cascade"]
duration: 15 мин
difficulty: 4
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=2674s"
---

## Короткий ответ

Сначала cascade сравнивает origin, importance и layer, затем specificity и только потом порядок объявления. Условно specificity — ID, затем class/attribute/pseudo-class, затем type/pseudo-element. `:where()` всегда даёт ноль; `:is()`, `:not()` и `:has()` берут вес самого специфичного аргумента; nesting следует похожему правилу. Inline style сильнее author rules, но не origin/importance целиком.

## Контекст

Senior должен объяснить современный cascade, а не только формулу из трёх чисел.

## Как строить ответ

### Cascade

Origin, importance, context и cascade layers.

### Specificity

Сравнить категории слева направо без «переноса» десятков.

### Современные селекторы

Разобрать `:where`, `:is`, `:not`, `:has`.

## Частые ошибки

- Считать specificity десятичным числом.
- Говорить, что `!important` просто добавляет вес.
- Забывать cascade layers.

## Дополнительные вопросы

- Как снизить specificity библиотечного CSS?
- Что сильнее: layer или порядок файла?

