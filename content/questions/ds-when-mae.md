---
id: ds-when-mae
title: В каких случаях предпочтительнее использовать MAE?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MAE", "Regression", "Loss"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MAE выбирают, когда стоимость ошибки приблизительно линейна и большие residuals не должны непропорционально доминировать. Она устойчивее MSE к выбросам и соответствует условной медиане, поэтому полезна при тяжёлых хвостах. Но MAE негладкая в нуле, а одинаковый штраф может быть неверен, если крупная ошибка критична или цена завышения отличается от занижения.

## Контекст

Нужно связать loss с noise model, estimand и бизнес-стоимостью.

## Как строить ответ

### Проверить cost function

Линейна ли цена абсолютного отклонения и симметричны ли ошибки.

### Посмотреть residuals

Тяжёлые хвосты и выбросы делают squared loss нестабильной.

### Назвать estimand

Минимизация expected absolute loss даёт conditional median.


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

MAE предпочтительнее, когда: 1) В данных есть выбросы — MAE не чувствителен к ним (штраф линейный), в отличие от MSE; 2) Нужна интерпретируемость — MAE показывает среднюю абсолютную ошибку в тех же единицах; 3) Медиана важнее среднего — MAE оптимизирует медиану, MSE — среднее; 4) Когда FN и FP одинаково ценны. На практике: MAE используется для预测温度, спроса, цен (когда выбросы). Но MAE не дифференцируем в нуле — для оптимизации градиентным спуском используют Huber loss (комбинация MSE и MAE).

## Частые ошибки

- Называть MAE полностью нечувствительной к выбросам.
- Выбирать loss только по удобству интерпретации.
- Игнорировать асимметричную стоимость.

## Дополнительные вопросы

- Когда использовать Huber loss?
- Что прогнозирует quantile loss?
- Как сравнивать MAE между сегментами?
