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

Recall (полнота) — доля найденных положительных среди всех реальных положительных: Recall = TP / (TP + FN). Пример: из 100 больных раком модель нашла 90 → Recall = 0.9. Recall важен, когда FN дороги: в медицине,安检, поиске. Recall = 1.0 означает, что модель нашла все положительные, но может быть много FP. Связь с precision: обычно обратно пропорциональны. Порог классификации调节这种权衡. На практике я строю PR-кривую и выбираю operating point в зависимости от бизнес-задачи.

## Частые ошибки

- Путать recall со specificity.
- Максимизировать recall без цены false positive.
- Сравнивать модели при разных порогах без оговорки.

## Дополнительные вопросы

- Как связаны recall и TPR?
- Что такое recall@k?
- Как оценить fairness по recall?
