---
id: data-standard-error-mean
title: Что такое стандартная ошибка среднего?
category: Statistics
scope: multi-language
languages: ["Python", "R", "SQL"]
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Statistics", "Standard error", "Sampling"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Стандартная ошибка среднего — стандартное отклонение sampling distribution оценки среднего. Для независимых одинаково распределённых наблюдений её оценивают как `s / sqrt(n)`. Она измеряет неопределённость оценки, а не разброс отдельных значений. При кластерах, автокорреляции, весах или heteroskedasticity простая формула неверна — нужны cluster-robust, HAC, survey или bootstrap-оценки.

## Контекст

Нужно отличить standard deviation от standard error и проговорить допущения формулы.

## Как строить ответ

### Разделить две величины

SD описывает вариативность данных, SE — вариативность оценщика между выборками.

### Показать масштабирование

При iid-данных SE убывает как `1/sqrt(n)`: уменьшить её вдвое требует примерно в четыре раза больше наблюдений.

### Проверить зависимость

Повторные события одного пользователя не являются независимыми наблюдениями; кластеризуйте на уровне рандомизации.


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

Стандартная ошибка среднего (SEM) — это стандартное отклонение выборочного среднего. SEM = σ / √n, где σ — стандартное отклонение генеральной совокупности, n — размер выборки. Она показывает, насколько точна оценка среднего: меньше SEM — точнее оценка. Пример: если средний чек = 1000 руб., SEM = 50, то 95% CI ≈ [902, 1098]. Важно: SEM уменьшается с ростом n, но по закону убывающей отдачи (√n). Удвоение точности требует учетверения выборки. На практике я использую SEM для определения необходимого размера выборки для A/B-теста.

## Частые ошибки

- Использовать SD как ошибку среднего.
- Считать события, а не независимые единицы.
- Игнорировать временную автокорреляцию.

## Дополнительные вопросы

- Почему SE уменьшается как корень из n?
- Как оценить SE доли?
- Что меняется при кластерной выборке?
