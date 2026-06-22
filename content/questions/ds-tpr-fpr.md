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


## Код из интервью

```python
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    roc_auc_score, classification_report
)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.3f}")

# Precision-Recall tradeoff
for threshold in [0.3, 0.5, 0.7]:
    preds = (y_prob >= threshold).astype(int)
    print(f"t={threshold}: P={precision_score(y_test, preds):.2f} "
          f"R={recall_score(y_test, preds):.2f} "
          f"F1={f1_score(y_test, preds):.2f}")
```

## Пример ответа

TPR (True Positive Rate, Recall) = TP / (TP + FN) — доля найденных положительных среди всех реальных положительных. FPR (False Positive Rate) = FP / (FP + TN) — доля ложных среди всех реальных отрицательных. TPR показывает, насколько хорошо модель «находит» положительные, FPR — насколько она «ошибается» на отрицательных. ROC-кривая строится по точкам (FPR, TPR). Идеальная точка — левый верхний угол (FPR=0, TPR=1). На практике: при понижении порога TPR растёт, но FPR тоже растёт. Баланс зависит от бизнес-задачи.

## Частые ошибки

- Путать FPR с `1 − precision`.
- Считать TPR и FPR абсолютным числом ошибок.
- Игнорировать масштаб negative class.

## Дополнительные вопросы

- Чем FPR отличается от FDR?
- Как получить specificity?
- Почему ROC может вводить в заблуждение при дисбалансе?
