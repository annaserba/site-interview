---
id: ds-precision
title: Что такое precision?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Precision", "Classification", "Metrics"]
duration: 8 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Precision = TP / (TP + FP): среди объектов, которым модель назначила positive, какая доля действительно positive. Метрика важна, когда false positive дорог — например, ручная проверка ограничена. Она зависит от threshold и prevalence, поэтому precision между выборками с разной базовой частотой нельзя сравнивать без оговорок.

## Контекст

Нужно связать confusion matrix с рабочим порогом и стоимостью ошибки.

## Как строить ответ

### Назвать знаменатель

Precision смотрит на предсказанные positives, recall — на реальные positives.

### Обсудить threshold

Повышение порога часто увеличивает precision ценой recall, но зависимость проверяют на данных.

### Учесть prevalence

При редком классе даже хороший classifier может иметь низкий precision.

## Частые ошибки

- Путать precision с accuracy.
- Считать метрику независимой от порога.
- Игнорировать стоимость false negatives.

## Дополнительные вопросы

- Как выбрать threshold при ограниченной capacity?
- Почему precision меняется при data drift?
- Что показывает PR-кривая?
