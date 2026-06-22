---
id: ds-regularization-methods
title: Какие методы регуляризации вы знаете?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regularization", "Generalization", "Model selection"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Методы зависят от модели: L1 даёт sparsity, L2 сжимает веса, Elastic Net сочетает их; для деревьев работают ограничение глубины, min samples, subsampling и shrinkage; для нейросетей — weight decay, dropout, augmentation и early stopping. Также регуляризуют через feature selection, priors и ограничение hypothesis class. Силу выбирают только на validation внутри корректной схемы split.

## Контекст

Проверяется системное понимание способов снизить variance и встроить prior.

## Как строить ответ

### Объяснить механизм

Penalty меняет objective, early stopping ограничивает путь оптимизации, augmentation расширяет наблюдаемые инварианты.

### Связать с моделью

L1/L2 не являются универсальным ответом для любого алгоритма.

### Настраивать без leakage

Все preprocessing и подбор hyperparameters должны находиться внутри cross-validation pipeline.


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

Основные методы регуляризации: 1) L1 (Lasso) — штрафует сумму абсолютных весов, обнуляет некоторые коэффициенты (feature selection); 2) L2 (Ridge) — штрафует сумму квадратов весов, уменьшает все веса пропорционально; 3) Elastic Net — комбинация L1 и L2; 4) Dropout — в нейросетях случайно отключает нейроны при обучении; 5) Early stopping — останавливаем обучение при росте validation loss; 6) Data augmentation — увеличиваем обучающую выборку. На практике: для линейных моделей — Ridge или Lasso, для нейросетей — dropout + early stopping + weight decay.

## Частые ошибки

- Называть dropout аналогом L2 без оговорок.
- Подбирать lambda на test set.
- Считать регуляризацию заменой качественным данным.

## Дополнительные вопросы

- Почему L1 создаёт нулевые коэффициенты?
- Чем weight decay отличается от L2 в adaptive optimizers?
- Когда early stopping является регуляризацией?
