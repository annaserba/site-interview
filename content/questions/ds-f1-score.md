---
id: ds-f1-score
title: Что такое F1-score?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Science"]
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

F1-score — это гармоническое среднее precision и recall: F1 = 2 × (Precision × Recall) / (Precision + Recall). Гармоническое среднее сильно уменьшается, если одна из составляющих мала. Например, если Precision = 0.9, Recall = 0.1, F1 = 0.18. F1 полезен при дисбалансе классов, когда accuracy обманчива. Но F1 не учитывает true negatives и не различает FP и FN. На практике я использую F1 как компактную метрику, но всегда смотрю на precision и recall отдельно. Для multiclass есть macro, micro и weighted усреднение.

## Частые ошибки

- Называть F1 средним accuracy и recall.
- Выбирать threshold по test set.
- Сравнивать macro и micro F1 как одну метрику.

## Дополнительные вопросы

- Когда использовать F-beta?
- Почему F1 не учитывает TN?
- Как выбрать threshold под F1?
