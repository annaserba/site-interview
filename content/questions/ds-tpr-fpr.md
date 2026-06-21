---
id: ds-tpr-fpr
title: В чём разница между TPR и FPR?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["TPR", "FPR", "ROC"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

TPR = TP/(TP+FN), то есть recall среди реальных positives. FPR = FP/(FP+TN), доля реальных negatives, ошибочно признанных positive. ROC-кривая показывает компромисс TPR и FPR по threshold. Низкий FPR не гарантирует высокий precision: при редком positive class даже малая доля огромного negative population создаёт много false positives.

## Контекст

Проверяется чтение confusion matrix и base-rate effect.

## Как строить ответ

### Назвать разные знаменатели

TPR нормируется на positives, FPR — на negatives.

### Связать с threshold

Снижение порога обычно увеличивает обе величины.

### Добавить prevalence

Precision зависит от base rate, хотя TPR и FPR условно считаются внутри классов.

## Частые ошибки

- Путать FPR с `1 − precision`.
- Считать TPR и FPR абсолютным числом ошибок.
- Игнорировать масштаб negative class.

## Дополнительные вопросы

- Чем FPR отличается от FDR?
- Как получить specificity?
- Почему ROC может вводить в заблуждение при дисбалансе?
