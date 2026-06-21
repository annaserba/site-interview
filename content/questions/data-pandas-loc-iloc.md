---
id: data-pandas-loc-iloc
title: В чём разница между loc и iloc в Pandas?
category: Python
scope: language-specific
languages: ["Python"]
roles: ["Data Analyst", "Data Scientist"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Pandas", "Indexing", "DataFrame"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

`.loc` выбирает по labels и включает обе границы label slice; `.iloc` выбирает по целочисленным позициям и следует Python half-open slice. При integer index `.loc[0]` означает label 0, а `.iloc[0]` — первую строку. Для присваивания используйте один `.loc[...] = ...`, чтобы избежать chained assignment и неоднозначности view/copy.

## Контекст

Проверяется не синтаксис, а корректность при нестандартных индексах и мутациях.

## Как строить ответ

### Разделить label и position

Покажите DataFrame с индексом `[10, 20]`: `loc[10]` и `iloc[0]` выберут одну строку разными способами.

### Объяснить slices

Label slice у `.loc` обычно включает конечную метку, positional slice у `.iloc` — нет.

### Безопасно присваивать

Булевую маску и столбец передавайте одному `.loc`, избегая промежуточного среза.

## Частые ошибки

- Считать `.loc` строковым, а `.iloc` числовым индексатором.
- Забывать включённую правую границу `.loc`.
- Делать chained assignment.

## Дополнительные вопросы

- Что такое SettingWithCopyWarning?
- Как работает boolean alignment в `.loc`?
- Когда индекс стоит сбросить?
