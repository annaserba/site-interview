---
id: ds-binary-classification-metrics
title: Какие метрики качества бинарной классификации вы знаете?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Classification", "Metrics", "Evaluation"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Пороговые метрики: precision, recall/TPR, specificity, FPR, F1, balanced accuracy, MCC и cost-weighted utility. Порог-независимые ranking-метрики: ROC-AUC и PR-AUC. Для вероятностей: log loss, Brier score и calibration error. Выбор определяется prevalence, стоимостью FP/FN, capacity и необходимостью калиброванных вероятностей; итог оценивают на временно корректном holdout и по сегментам.

## Контекст

Нужно построить систему оценки модели, а не перечислить три формулы.

## Как строить ответ

### Начать с решения

Как модель используется: ranking, auto-decision, ручная проверка или оценка риска.

### Разделить качества

Ranking, threshold performance и calibration — разные свойства.

### Проверить устойчивость

Смотрите confidence intervals, drift, сегменты и business utility.

## Частые ошибки

- Использовать accuracy при редком классе.
- Выбирать threshold на test set.
- Считать ROC-AUC достаточной метрикой production-модели.

## Дополнительные вопросы

- Когда использовать MCC?
- Как оценить calibration?
- Как выбрать порог при capacity constraint?
