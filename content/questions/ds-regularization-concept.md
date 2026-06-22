---
id: ds-regularization-concept
title: Что такое регуляризация в машинном обучении?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regularization", "Generalization", "Bias variance"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Регуляризация ограничивает эффективную сложность модели или вводит prior, чтобы улучшить expected generalization. Это может быть penalty в objective, ограничение структуры, шум, augmentation или early stopping. Она обычно увеличивает bias и снижает variance; силу подбирают на validation data. Регуляризация не исправляет leakage, неверную target и несовпадение training и production distribution.

## Контекст

Нужно объяснить общий принцип шире L1 и L2.

## Как строить ответ

### Связать с objective

`loss + λ penalty` меняет предпочтение между fit и сложностью; λ задаёт trade-off.

### Дать prior-интерпретацию

L2 соответствует Gaussian prior на веса, L1 — Laplace prior и sparsity.

### Проверить generalization

Выбирайте λ внутри cross-validation и оценивайте итог один раз на untouched test set.


## Код из интервью

```python
from sklearn.model_selection import cross_val_score, learning_curve
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Pipeline с регуляризацией
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", Ridge(alpha=1.0))   # L2-регуляризация
])

# Cross-validation для оценки generalization
scores = cross_val_score(pipe, X, y, cv=5, scoring="r2")
print(f"R2: {scores.mean():.3f} + {scores.std():.3f}")

# Learning curves для диагностики
train_sizes, train_scores, val_scores = learning_curve(
    pipe, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 10)
)
```

## Пример ответа

Регуляризация — метод ограничения сложности модели для борьбы с переобучением. Идея: добавляем штраф за «сложность» модели в функцию потерь. Пример: без регуляризации loss = MSE, с L2: loss = MSE + λ × Σw². λ — коэффициент регуляризации: больше λ → сильнее штраф → проще модель. Bias-variance tradeoff: регуляризация увеличивает bias, но снижает variance. Типы: L1 (Lasso) — обнуляет некоторые веса, L2 (Ridge) — уменьшает все веса, Elastic Net — комбинация. В нейросетях: dropout, early stopping.

## Частые ошибки

- Считать регуляризацию гарантией от переобучения.
- Подбирать λ на test set.
- Ограничивать понятие только penalty весов.

## Дополнительные вопросы

- Почему L1 создаёт sparsity?
- Как регуляризация связана с Bayesian prior?
- Когда early stopping эквивалентен regularization?
