---
id: goznak-css-specificity
title: Как рассчитывается специфичность CSS-селекторов?
category: CSS
scope: language-specific
languages: ["CSS", "HTML"]
roles: ["Frontend"]
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


## Код из интервью

```javascript
/* CSS Specificity — порядок приоритетов */
/* 1. inline (1000) > ID (100) > class (10) > element (1) */
.nav .item { color: gray; }    /* 0,0,2,0 */
#header .item { color: red; }  /* 0,1,1,0 */

/* SASS — избегайте глубокой вложенности */
/* Плохо */
.nav ul li a span.label { }
/* Хорошо — BEM */
.nav__link-label { }
```

## Пример ответа

Специфичность CSS-селекторов рассчитывается как тройка чисел (a, b, c): a = количество #id, b = количество .class/[attr]/:pseudo-class, c = количество element/::pseudo-element. Сравнение: (1,0,0) > (0,10,0) > (0,0,100). Пример:

```css
.button { color: red; }           /* (0, 1, 0) */
.button.primary { color: blue; }  /* (0, 2, 0) — побеждает */
#submit { color: green; }         /* (1, 0, 0) — побеждает всё */
```

!important обходит специфичность (но это антипаттерн). На практике: избегаю !important, использую BEM для предсказуемой специфичности. Инструмент specificity calculator помогает при отладке.

## Частые ошибки

- Считать specificity десятичным числом.
- Говорить, что `!important` просто добавляет вес.
- Забывать cascade layers.

## Дополнительные вопросы

- Как снизить specificity библиотечного CSS?
- Что сильнее: layer или порядок файла?

