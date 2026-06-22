---
id: ds-recall-first
title: Когда recall важнее precision?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Recall", "Precision", "Threshold"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Recall приоритетен, когда false negative намного дороже false positive: первичный медицинский скрининг, поиск мошенничества для последующей проверки, обнаружение критических дефектов. Precision всё равно не становится «неважным»: поток ложных тревог ограничен стоимостью проверки, доверием пользователей и capacity. Поэтому оптимизируют recall при минимальном precision, максимальном FPR или фиксированном бюджете.

## Контекст

Проверяется перевод бизнес-стоимости ошибок в threshold policy.

## Как строить ответ

### Задать цену ошибок

Сравните вред пропуска и стоимость ложного срабатывания.

### Добавить capacity

Если ручная команда проверяет тысячу кейсов в день, threshold должен учитывать этот лимит.

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

Recall важнее precision, когда критичны пропущенные положительные (FN). Примеры: 1) Медицина — пропустить рак страшнее, чем назначить лишнее обследование; 2) Фрод-детекция — пропустить мошенничество стоит дороже; 3) Безопасность — пропустить уязвимость критичнее. Формула: Recall = TP / (TP + FN). Чтобы увеличить recall, понижаем порог классификации: больше объектов помечается как положительные, FN уменьшаются, но FP растут. На практике я оптимизирую через F-beta с β > 1 (например, F2), который сильнее весит recall.

## Частые ошибки

- Говорить, что precision совсем не имеет значения.
- Максимизировать recall выбором «всё positive».
- Игнорировать изменение prevalence.

## Дополнительные вопросы

- Как выбрать threshold при фиксированном бюджете?
- Когда precision важнее recall?
- Как построить cost-sensitive metric?
