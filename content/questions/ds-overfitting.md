---
id: ds-overfitting
title: Что такое переобучение модели?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Overfitting", "Generalization", "Validation"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Переобучение — ситуация, когда модель подстраивается под шум и особенности training sample, поэтому training quality растёт, а ожидаемое качество на новых данных ухудшается. Диагностируют по корректной validation-схеме и learning curves, но сначала исключают leakage и distribution shift. Снижают complexity, усиливают regularization, добавляют данные, early stopping и устойчивые признаки.

## Контекст

Проверяется generalization, bias-variance и корректность эксперимента.

## Как строить ответ

### Проверить split

Time, group и entity leakage часто маскируются под «слишком хорошую модель».

### Сравнить curves

Большой train-validation gap указывает на variance; плохи обе метрики — вероятен underfitting.

### Выбрать лечение

Метод зависит от источника: complexity, шум labels, малый sample или неверная validation distribution.


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

Переобучение — это когда модель слишком хорошо запомнила обучающие данные, включая шум, и плохо обобщает на новых. Признаки: высокая точность на train, низкая на validation. Методы борьбы: 1) Регуляризация (L1/L2, dropout); 2) Упрощение модели; 3) Больше данных (data augmentation); 4) Cross-validation; 5) Early stopping; 6) Ensemble methods. На практике я использую learning curves: если train accuracy растёт, а validation падает — модель переобучается. Также полезен feature importance — если модель полагается на один признак, это red flag.

## Частые ошибки

- Называть любое падение production quality overfitting.
- Настраивать модель по test set.
- Лечить leakage регуляризацией.

## Дополнительные вопросы

- Как отличить overfitting от drift?
- Что показывают learning curves?
- Почему больше данных не всегда помогает?
