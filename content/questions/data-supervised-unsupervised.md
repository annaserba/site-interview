---
id: data-supervised-unsupervised
title: В чём разница между supervised и unsupervised learning?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Analyst", "Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Machine learning", "Supervised", "Unsupervised"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Supervised learning обучает отображение признаков в наблюдаемую target по размеченным примерам — классификацию, регрессию, ranking. Unsupervised learning ищет структуру без целевой разметки: кластеры, низкоразмерное представление, аномалии. Граница не равна «есть данные или нет»: self-supervised создаёт обучающий сигнал из самих данных, semi-supervised сочетает малую разметку и большой unlabeled corpus.

## Контекст

Нужно связать постановку, валидацию и бизнес-смысл результата.

## Как строить ответ

### Начать с сигнала

Есть ли target, как она получена и соответствует ли будущему решению.

### Сравнить оценку

Supervised-модель валидируют на holdout по целевой метрике; unsupervised требует proxy, stability и внешней интерпретации.

### Обсудить риски

Для supervised опасны leakage и label bias; для clustering — произвольность метрики расстояния и числа кластеров.


## Код из интервью

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Важность признаков
import pandas as pd
fi = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)
print(fi.head(10))
```

## Пример ответа

Supervised learning — обучение с учителем, где есть размеченные данные (X → y). Пример: предсказание оттока пользователей — на входе признаки, на выходе — бинарный класс. Методы: линейная регрессия, деревья, XGBoost. Unsupervised learning — обучение без учителя, данные не размечены. Пример: сегментация клиентов по поведению без заранее известных категорий. Методы: K-Means, DBSCAN, PCA. Ключевое отличие: в supervised мы знаем «правильный ответ» и минимизируем loss, в unsupervised ищем структуру в данных. На практике я использую unsupervised для первичного исследования, а supervised — для предсказания.

## Частые ошибки

- Считать clusters объективными классами реального мира.
- Оценивать clustering только по красивой визуализации.
- Допускать target leakage в supervised pipeline.

## Дополнительные вопросы

- Как валидировать кластеризацию?
- Что такое self-supervised learning?
- Когда anomaly detection является supervised?
