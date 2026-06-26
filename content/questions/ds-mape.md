---
id: ds-mape
title: Что такое MAPE?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MAPE", "Regression", "Metrics"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MAPE — среднее `|y − ŷ| / |y|`, обычно выраженное в процентах. Метрика безразмерна и понятна бизнесу, но не определена при `y = 0`, взрывается около нуля и асимметрично штрафует завышение и занижение. Она также даёт маленьким target чрезмерный вес. Альтернативы: WAPE, sMAPE, MAE по сегментам или model-specific loss.

## Контекст

Нужно объяснить полезность относительной ошибки и её математические ловушки.

## Как строить ответ

### Проверить target

Есть ли нули, отрицательные значения и большой диапазон масштабов.

### Обсудить агрегацию

Среднее процентов по объектам и ошибка агрегированного объёма отвечают на разные вопросы.

### Выбрать альтернативу

WAPE устойчивее к отдельным малым знаменателям, но крупные объекты доминируют.


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

MAPE (Mean Absolute Percentage Error) — средняя абсолютная процентная ошибка: MAPE = (1/n) × Σ|y_true - y_pred| / |y_true| × 100%. Показывает ошибку в процентах, что удобно для бизнеса: «Мы ошибаемся в среднем на 5%». Но MAPE имеет проблемы: 1) Бесконечность при y_true = 0; 2) Асимметрия — переоценка штрафуется сильнее недооценки; 3) Смещение в сторону малых значений. На практике я использую MAPE для отчётов перед бизнесом, но для оптимизации моделей предпочитаю MAE или MSE. Альтернативы: sMAPE (симметричный), WMAPE (взвешенный).

## Частые ошибки

- Добавлять epsilon без анализа изменившейся метрики.
- Использовать MAPE для target около нуля.
- Считать MAPE симметричной.

## Дополнительные вопросы

- Чем WAPE отличается от MAPE?
- Какие проблемы есть у sMAPE?
- Как оценивать прогноз с отрицательными target?
