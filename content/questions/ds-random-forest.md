---
id: ds-random-forest
title: Что такое Random Forest?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Random Forest", "Bagging", "Trees"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Random Forest — ансамбль деревьев, обученных на bootstrap-выборках с случайным подмножеством признаков в каждом split. Усреднение декоррелированных деревьев снижает variance относительно одного глубокого дерева. Модель устойчива и даёт OOB-оценку, но может быть тяжёлой по памяти и latency, плохо экстраполирует регрессию и даёт смещённую impurity importance.

## Контекст

Нужно связать bagging, декорреляцию и bias-variance trade-off.

## Как строить ответ

### Описать разнообразие

Bootstrap меняет строки, feature subsampling — доступные split, уменьшая корреляцию деревьев.

### Объяснить агрегацию

Классификация голосует или усредняет probabilities, регрессия усредняет predictions.

### Разобрать оценку

OOB полезен, но time-dependent data всё равно требует временного split; importance лучше проверять permutation или SHAP.


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

Random Forest — ансамблевый метод на основе bagging деревьев решений. Каждое дерево обучается на bootstrap-выборке и в каждом разбиении考虑只 случайного подмножества признаков. Это снижает корреляцию между деревьями и уменьшает variance. Пример: 100 деревьев, каждое видит случайные 60% данных и случайные √m признаков. Для классификации предсказание — голосование, для регрессии — среднее. Преимущества: robust к переобучению, не нужна стандартизация, feature importance. Недостатки: интерпретируемость (黑盒), память, скорость предсказания. На практике: Random Forest — мой baseline для табличных данных.

## Частые ошибки

- Называть Random Forest boosting.
- Интерпретировать impurity importance как причинность.
- Считать, что больше деревьев всегда ухудшает overfitting.

## Дополнительные вопросы

- Чем bagging отличается от boosting?
- Что такое OOB score?
- Как forest работает с коррелированными признаками?
