---
id: ds-regression-metrics
title: Какие метрики регрессии вы знаете?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regression", "Metrics", "Model evaluation"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MAE устойчивее к выбросам и оптимизирует условную медиану; MSE/RMSE сильнее штрафуют большие ошибки и соответствуют условному среднему при squared loss; RMSLE и MAPE работают с относительной ошибкой, но имеют проблемы около нуля; R² сравнивает модель с baseline среднего и может быть отрицательным. Метрику выбирают по цене ошибки, распределению target, сегментам и тому, что оптимизируется в продукте.

## Контекст

Нужно не перечислить названия, а связать loss, статистический estimand и бизнес-стоимость.

## Как строить ответ

### Начать с ошибки бизнеса

Симметрична ли стоимость, важны ли хвосты, допустима ли относительная шкала.

### Добавить baseline

Сравнивайте с naive prediction и показывайте метрики по ключевым сегментам.

### Проверить распределение

Оценивайте residuals, heteroskedasticity, drift и uncertainty, а не одну среднюю цифру.


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

Основные метрики регрессии: MSE = (1/n) × Σ(y-ŷ)² — штрафует за большие ошибки квадратично, чувствителен к выбросам. RMSE = √MSE — в тех же единицах. MAE = (1/n) × Σ|y-ŷ| — линейный штраф, робастен к выбросам. R² = 1 - SS_res/SS_tot — доля объяснённой дисперсии. MAPE — средняя процентная ошибка. На практике я считаю: MSE/RMSE для оптимизации модели, MAE для robustness check, R² для понимания, сколько дисперсии объясняет модель, MAPE для отчётов. Большая разница MSE/MAE указывает на выбросы.

## Частые ошибки

- Использовать MAPE при нулевых target.
- Интерпретировать R² как долю точных прогнозов.
- Выбирать RMSE только потому, что она популярна.

## Дополнительные вопросы

- Как оценить интервальный прогноз?
- Когда нужен quantile loss?
- Почему offline metric может не коррелировать с бизнес-эффектом?
