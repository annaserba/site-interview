---
id: ds-positive-target-negative-prediction
title: Какая модель может предсказать отрицательное значение при положительном target?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regression", "Extrapolation", "Constraints"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Линейная регрессия, нейросеть, boosting могут дать минус при положительных targets — output не ограничен. Деревья остаются в диапазоне обучения. Для positivity: log(y), log-link/Gamma/Tweedie.

## Что ожидают в ответе

Проверяется разница между интерполяцией и экстраполяцией. Ожидается, что кандидат объяснит, почему неограниченный output space модели даёт отрицательные предсказания, и предложит корректные решения (log-transform, log-link, Tweedie) вместо clipping, который создаёт bias.

## Контекст

Проверяется различие interpolation/extrapolation и способ кодировать ограничение target.

## Как строить ответ

### Посмотреть output space

Linear output не знает о положительности, независимо от training sample.

### Выбрать корректную связь

Log-link гарантирует положительное expected value и часто лучше соответствует multiplicative noise.

### Проверить последствия

Простое clipping создаёт bias и скрывает проблему за пределами training support.


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

Линейная регрессия может предсказывать отрицательные значения при положительном target, потому что она не ограничивает область значений. Пример: если обучающие данные содержат дома от 100K до 1M, модель может предсказать -50K для нетипичного входа. Решения: 1) Трансформация target — log(y); 2) Использование моделей с ограничениями (decision tree); 3) Post-processing — обрезать предсказания до min(target_train); 4) Модели, которые не экстраполируют (KNN, Random Forest). На практике я использую log-трансформацию для положительных целей и exp для обратного преобразования.

## Частые ошибки

- Утверждать, что положительный train target запрещает отрицательный prediction.
- Клиппировать к нулю без оценки bias.
- Делать log transform и забывать bias correction.

## Дополнительные вопросы

- Какие модели плохо экстраполируют?
- Когда использовать Gamma regression?
- Как восстановить mean после log transform?
