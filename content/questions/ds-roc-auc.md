---
id: ds-roc-auc
title: Что такое ROC-AUC?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["ROC-AUC", "Classification", "Metrics"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

ROC-кривая показывает TPR против FPR при изменении порога, а ROC-AUC — вероятность, что случайный positive получит больший score, чем случайный negative. Метрика инвариантна к монотонному преобразованию score и оценивает ranking, но не калибровку. При сильном дисбалансе высокий ROC-AUC может скрывать неприемлемый precision; для решения выбирайте operating point по стоимости ошибок и смотрите PR-AUC.

## Контекст

Проверяется понимание ranking, порогов и ограничений метрики.

## Как строить ответ

### Определить оси

TPR равен recall, FPR — доля false positives среди negative.

### Дать вероятностную интерпретацию

AUC 0.5 соответствует случайному ranking, 1.0 — идеальному.

### Связать с продуктом

Порог выбирают по cost matrix, capacity и guardrails, а не по максимальному AUC.

## Частые ошибки

- Называть ROC-AUC accuracy.
- Считать AUC метрикой калибровки.
- Игнорировать PR-кривую при редком positive class.

## Дополнительные вопросы

- Когда PR-AUC информативнее?
- Как сравнить AUC двух моделей статистически?
- Почему AUC не задаёт рабочий порог?
