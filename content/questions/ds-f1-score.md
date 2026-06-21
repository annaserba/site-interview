---
id: ds-f1-score
title: Что такое F1-score?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["F1", "Classification", "Metrics"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

F1 — гармоническое среднее precision и recall: `2PR/(P+R)`. Оно высоко только при приемлемых обеих метриках и игнорирует true negatives. F1 полезно как компактная метрика при дисбалансе и сопоставимой цене FP/FN, но не заменяет cost function. Threshold и способ усреднения macro/micro/weighted должны соответствовать задаче.

## Контекст

Проверяется смысл гармонического среднего и границы применения.

## Как строить ответ

### Объяснить компромисс

Низкое значение одной составляющей сильно ограничивает F1.

### Назвать ограничения

True negatives не входят; одинаковый F1 может скрывать разные precision и recall.

### Выбрать averaging

Для multiclass macro даёт равный вес классам, micro агрегирует decisions, weighted зависит от support.

## Частые ошибки

- Называть F1 средним accuracy и recall.
- Выбирать threshold по test set.
- Сравнивать macro и micro F1 как одну метрику.

## Дополнительные вопросы

- Когда использовать F-beta?
- Почему F1 не учитывает TN?
- Как выбрать threshold под F1?
