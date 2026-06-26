---
id: data-least-squares-mean
title: В какой точке минимальна сумма квадратов отклонений?
category: Statistics
scope: universal
languages: []
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Least squares", "Mean", "Optimization"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Сумма `Σ(xᵢ − a)²` минимальна при `a` равном выборочному среднему. Производная по `a` равна `2Σ(a − xᵢ)`; приравнивая её к нулю, получаем `a = Σxᵢ/n`. Вторая производная `2n > 0`, значит это минимум. Для суммы абсолютных отклонений оптимальна медиана, поэтому squared loss сильнее реагирует на выбросы.

## Контекст

Проверяется связь статистики, функции потерь и оптимизации.

## Как строить ответ

### Записать функцию

Явно обозначьте переменную оптимизации и наблюдения.

### Найти стационарную точку

Возьмите производную и подтвердите минимум положительной второй производной.

### Сравнить loss

Поясните, почему L2 ведёт к среднему, а L1 — к медиане и большей устойчивости.


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

Сумма квадратов отклонений минимальна в точке, равной среднему арифметическому наблюдений. Это можно показать аналитически: берём производную суммы квадратов и приравниваем к нулю. На практике это означает, что среднее — это оптимальная оценка минимума MSE. Например, если данные [2, 4, 6, 8], среднее = 5, и сумма квадратов отклонений = 20. Если взять любое другое число, сумма будет больше. Это свойство используется в линейной регрессии — метод наименьших квадратов находит коэффициенты, минимизирующие MSE. Важно: среднее чувствительно к выбросам, поэтому иногда используют медиану.

## Частые ошибки

- Отвечать «медиана» для квадратов.
- Не доказывать, что точка является минимумом.
- Игнорировать чувствительность L2 к выбросам.

## Дополнительные вопросы

- Что минимизирует сумму абсолютных отклонений?
- Как изменится ответ с весами?
- Почему least squares связан с нормальным шумом?
