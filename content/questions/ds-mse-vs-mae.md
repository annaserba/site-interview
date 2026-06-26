---
id: ds-mse-vs-mae
title: В чём разница между MSE и MAE? Когда что использовать?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MSE", "MAE", "Regression", "Loss", "Robustness"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MSE усредняет квадраты residuals — сильнее штрафует большие ошибки, гладкая, оптимизирует conditional mean. MAE усредняет модули — устойчивее к выбросам, негладкая в нуле, оптимизирует conditional median. MSE подходит, когда крупные ошибки непропорционально дороги. MAE — когда есть выбросы или нужна робастность. Для компромисса — Huber loss.

## Контекст

Нужно связать loss с noise model, estimand и бизнес-стоимостью. Проверяется осознанный выбор квадратичного штрафа.

## Как строить ответ

### Сравнить штраф

Покажите, как residual 10 влияет на MSE в сто раз, а на MAE в десять.

### Назвать estimand

Squared loss ведёт к mean, absolute loss — к median.

### Проверить noise

Выбросы, heteroskedasticity и heavy tails могут сделать MSE нестабильной.

## Код из интервью

```python
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

y_true = np.array([10, 10, 10, 20])
y_pred = np.array([10, 10, 20, 20])

mse = mean_squared_error(y_true, y_pred)   # 25.0
mae = mean_absolute_error(y_true, y_pred)   # 2.5

print(f"MSE: {mse}, MAE: {mae}")

# Huber loss — компромисс
from sklearn.linear_model import HuberRegressor
model = HuberRegressor(epsilon=1.35)  # переход MSE→MAE
model.fit(X_train, y_train)
```

## Пример ответа

MSE = (1/n) × Σ(y_true - y_pred)² — штрафует за большие ошибки квадратично. MAE = (1/n) × Σ|y_true - y_pred| — линейный штраф. Разница: MSE чувствителен к выбросам (ошибка в 10 → штраф 100), MAE — нет (штраф 10). Пример: y_true = [10, 10, 10], y_pred = [10, 10, 20]. MSE = 33.3, MAE = 3.33.

MSE предпочтительнее, когда: 1) Крупные ошибки критичнее мелких; 2) Данные без выбросов или они обработаны; 3) Нужна дифференцируемость для градиентного спуска; 4) При нормальном распределении ошибок MSE эквивалентен MLE.

MAE предпочтительнее, когда: 1) В данных есть выбросы — MAE не чувствителен к ним; 2) Нужна интерпретируемость — MAE показывает среднюю абсолютную ошибку; 3) Медиана важнее среднего; 4) Когда FN и FP одинаково ценны.

RMSE = √MSE — в тех же единицах, что и target. На практике: MSE для нейросетей, MAE для табличных данных с выбросами. Huber loss — комбинация: MSE для малых ошибок, MAE для больших.

## Частые ошибки

- Говорить, что MAE всегда лучше при выбросах.
- Сравнивать численные значения MAE и MSE напрямую.
- Не учитывать единицы измерения.
- Игнорировать асимметричную стоимость ошибки.

## Дополнительные вопросы

- Что делает Huber loss?
- Какой loss выбрать для асимметричной ошибки?
- Почему median устойчивее mean?
- Когда использовать quantile loss?
