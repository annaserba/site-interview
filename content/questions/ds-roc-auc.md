---
id: ds-roc-auc
title: Что такое ROC-AUC?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Science"]
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

ROC-AUC — площадь под ROC-кривой (Receiver Operating Characteristic). ROC-кривая строится по точкам (FPR, TPR) при разных порогах классификации. AUC = 1 — идеальная модель, AUC = 0.5 — случайная. Интерпретация: AUC показывает вероятность, что модель присвоит более высокий скор положительному объекту, чем отрицательному. Преимущество перед accuracy: AUC не зависит от порога и устойчива к дисбалансу. Но AUC не учитывает стоимость FP/FN. На практике: ROC-AUC — хорошая метрика для сравнения моделей, но для выбора порога использую precision-recall curve.

## Частые ошибки

- Называть ROC-AUC accuracy.
- Считать AUC метрикой калибровки.
- Игнорировать PR-кривую при редком positive class.

## Дополнительные вопросы

- Когда PR-AUC информативнее?
- Как сравнить AUC двух моделей статистически?
- Почему AUC не задаёт рабочий порог?
