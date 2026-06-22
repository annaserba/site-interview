---
id: ds-mse-vs-mae
title: В чём разница между MSE и MAE?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MSE", "MAE", "Regression"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MSE усредняет квадраты residuals, сильнее штрафует большие ошибки, гладкая и оптимизирует conditional mean. MAE усредняет модули, устойчивее к выбросам, негладкая в нуле и оптимизирует conditional median. Выбор — это решение о цене ошибки и целевой статистике, а не только о математическом удобстве. Для компромисса используют Huber loss.

## Контекст

Нужно сравнить чувствительность, оптимизацию и интерпретацию.

## Как строить ответ

### Сравнить штраф

Покажите, как residual 10 влияет на MSE в сто раз, а на MAE в десять.

### Назвать estimand

Squared loss ведёт к mean, absolute loss — к median.

### Выбрать по задаче

Исходите из business cost, tail behavior и требований к robustness.


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

MSE = (1/n) × Σ(y_true - y_pred)² — штрафует за большие ошибки квадратично. MAE = (1/n) × Σ|y_true - y_pred| — линейный штраф. Разница: MSE чувствителен к выбросам (ошибка в 10 → штраф 100), MAE — нет (штраф 10). Пример: y_true = [10, 10, 10], y_pred = [10, 10, 20]. MSE = 33.3, MAE = 3.33. MSE оптимизируется через среднее, MAE через медиану. На практике: MSE используется, когда критичны выбросы, MAE — когда нужна робастность. RMSE = √MSE — в тех же единицах, что и target.

## Частые ошибки

- Говорить, что MAE всегда лучше при выбросах.
- Сравнивать численные значения MAE и MSE напрямую.
- Не учитывать единицы измерения.

## Дополнительные вопросы

- Что делает Huber loss?
- Какой loss выбрать для асимметричной ошибки?
- Почему median устойчивее mean?
