---
id: ds-boosting-concept
title: Что такое бустинг?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Boosting", "Ensembles", "Bias variance"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Бустинг — семейство последовательных ансамблей, где каждый новый weak learner фокусируется на ошибках текущей композиции. AdaBoost меняет веса наблюдений и оптимизирует exponential loss, gradient boosting добавляет модель вдоль отрицательного градиента произвольного differentiable loss. В отличие от bagging, learners зависимы и обучаются последовательно; shrinkage, depth и early stopping контролируют переобучение.

## Контекст

Проверяется общая идея ансамбля и отличие от bagging.

## Как строить ответ

### Объяснить последовательность

Итог — взвешенная сумма слабых моделей, каждая строится с учётом текущей ошибки.

### Сравнить с bagging

Bagging параллельно снижает variance; boosting чаще последовательно снижает bias, одновременно требуя регуляризации.

### Назвать семейства

Разделите AdaBoost, gradient boosting и конкретные библиотеки.


## Код из интервью

```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV

param_grid = {
    "n_estimators": [100, 200, 500],
    "max_depth": [3, 5, 7],
    "learning_rate": [0.01, 0.1, 0.2],
}

gb = GradientBoostingClassifier(random_state=42)
grid = GridSearchCV(gb, param_grid, cv=5, scoring="f1", n_jobs=-1)
grid.fit(X_train, y_train)

print(f"Best params: {grid.best_params_}")
print(f"Best F1: {grid.best_score_:.3f}")
```

## Пример ответа

Бустинг — это ансамблевый метод, где слабые модели обучаются последовательно, и каждая следующая исправляет ошибки предыдущей. Ключевая идея: каждая новая модель фокусируется на примерах, которые предыдущие модели ошибочно классифицировали. В Gradient Boosting минимизируем функцию потерь: каждое новое дерево предсказывает градиент функции потерь. Преимущества: высокая точность, работает с разными функциями потерь. Недостатки: склонность к переобучению, медленное обучение, чувствительность к шуму. На практике использую XGBoost с early stopping и регуляризацией.

## Частые ошибки

- Называть любой ансамбль бустингом.
- Говорить, что boosting всегда переобучается на шуме.
- Путать алгоритм с XGBoost-библиотекой.

## Дополнительные вопросы

- Почему weak learners полезны?
- Чем boosting отличается от stacking?
- Можно ли обучать boosting параллельно?
