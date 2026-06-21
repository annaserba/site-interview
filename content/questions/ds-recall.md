---
id: ds-recall
title: Что такое recall?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Recall", "Classification", "Metrics"]
duration: 8 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Recall = TP / (TP + FN): какую долю реальных positive модель нашла. Он критичен, когда пропуск дорог, но максимизация recall без ограничения обычно приводит к большому числу false positives. Поэтому фиксируют минимальный precision, capacity или стоимость и выбирают threshold на validation data.

## Контекст

Проверяется понимание знаменателя, компромисса и пороговой политики.

## Как строить ответ

### Связать с ошибкой

Recall напрямую уменьшается из-за false negatives.

### Добавить ограничение

Оптимизируйте recall при допустимом precision, FPR или числе ручных проверок.

### Проверить сегменты

Общий recall может скрывать провал на важной группе.

## Частые ошибки

- Путать recall со specificity.
- Максимизировать recall без цены false positive.
- Сравнивать модели при разных порогах без оговорки.

## Дополнительные вопросы

- Как связаны recall и TPR?
- Что такое recall@k?
- Как оценить fairness по recall?
