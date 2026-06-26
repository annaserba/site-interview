---
id: ds-recall
title: Что такое recall? Когда recall важнее precision?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Recall", "Precision", "Classification", "Metrics", "Threshold"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Recall = TP / (TP + FN): какую долю реальных positive модель нашла. Критичен, когда пропуск дорог (медицина, фрод, безопасность).recision не становится неважным — поток ложных тревог ограничен стоимостью проверки и capacity. Оптимизируют recall при минимальном precision, максимальном FPR или фиксированном бюджете. Порог выбирают на validation через PR-кривую или F-beta (β > 1).

## Контекст

Проверяется понимание компромисса precision/recall, перевод бизнес-стоимости ошибок в threshold policy.

## Как строить ответ

### Задать цену ошибок

Сравните вред пропуска (FN) и стоимость ложного срабатывания (FP).

### Добавить capacity

Если ручная команда проверяет N кейсов в день, threshold должен учитывать лимит.

### Проверить сегменты

Минимальный recall может быть обязателен отдельно для критичных групп.

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

Recall (полнота) — доля найденных положительных среди всех реальных положительных: Recall = TP / (TP + FN). Пример: из 100 больных раком модель нашла 90 → Recall = 0.9. Recall важен, когда FN дороги: в медицине, скрининге, поиске мошенничества. Recall = 1.0 означает, что модель нашла все положительные, но может быть много FP.

Когда recall важнее precision: 1) Медицина — пропустить рак страшнее, чем назначить лишнее обследование; 2) Фрод-детекция — пропустить мошенничество стоит дороже; 3) Безопасность — пропустить уязвимость критичнее. Чтобы увеличить recall, понижаем порог: больше объектов помечается как положительные, FN уменьшаются, но FP растут. На практике оптимизирую через F-beta с β > 1 (например, F2), который сильнее весит recall. Строю PR-кривую и выбираю operating point в зависимости от бизнес-задачи.

## Частые ошибки

- Путать recall со specificity.
- Максимизировать recall без цены false positive (выбор «всё positive»).
- Говорить, что precision совсем не имеет значения.
- Сравнивать модели при разных порогах без оговорки.

## Дополнительные вопросы

- Как связаны recall и TPR?
- Что такое recall@k?
- Как оценить fairness по recall?
- Как выбрать threshold при фиксированном бюджете?
- Когда precision важнее recall?
