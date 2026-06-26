---
id: ds-precision
title: Что такое precision?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Science"]
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

Precision — доля верно предсказанных положительных среди всех предсказанных положительных: Precision = TP / (TP + FP). Пример: модель предсказала 100 спам-писем, из них 90 действительно спам → Precision = 0.9. Precision важен, когда критичны ложные срабатывания: в спам-фильтре — не удалить нормальное письмо; в медицине — не назначить лишнее лечение. Низкий precision означает много FP. Связь с recall: обычно precision и recall обратно пропорциональны. Порог классификации позволяет регулировать этот компромисс: выше порог → выше precision, ниже recall.

## Частые ошибки

- Путать precision с accuracy.
- Считать метрику независимой от порога.
- Игнорировать стоимость false negatives.

## Дополнительные вопросы

- Как выбрать threshold при ограниченной capacity?
- Почему precision меняется при data drift?
- Что показывает PR-кривая?
