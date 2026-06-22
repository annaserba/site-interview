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

Основные метрики бинарной классификации: Accuracy = (TP+TN)/(TP+TN+FP+FN) — доля правильных ответов, но обманчива при дисбалансе. Precision = TP/(TP+FP) — из предсказанных положительных сколько действительно положительных. Recall = TP/(TP+FN) — из реальных положительных сколько нашли. F1 = 2PR/(P+R) — гармоническое среднее. ROC-AUC — площадь под ROC-кривой. Log-loss — штрафует за уверенные неправильные предсказания. Выбор метрики зависит от бизнес-задачи: при фрод-детекции важен recall, при спам-фильтре — precision. Я всегда смотрю на confusion matrix и выбираю метрику для конкретного кейса.

## Частые ошибки

- Использовать accuracy при редком классе.
- Выбирать threshold на test set.
- Считать ROC-AUC достаточной метрикой production-модели.

## Дополнительные вопросы

- Когда использовать MCC?
- Как оценить calibration?
- Как выбрать порог при capacity constraint?
