---
id: ds-gradient-boosting
title: Что такое градиентный бустинг?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Gradient boosting", "Trees", "Optimization"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Градиентный бустинг строит аддитивную модель последовательно: каждый weak learner приближает отрицательный градиент loss по текущим predictions. Для деревьев модель хорошо ловит нелинейности и взаимодействия без масштабирования признаков. Качество контролируют learning rate, число и глубина деревьев, subsampling, регуляризация и early stopping; уменьшение learning rate обычно требует больше итераций.

## Контекст

Проверяется понимание функционального градиентного спуска и контроля переобучения.

## Как строить ответ

### Описать итерацию

Текущие predictions → gradients или residuals → новое дерево → шаг learning rate.

### Связать с loss

Алгоритм применим к разным differentiable losses, не только squared error.

### Обсудить эксплуатацию

Используйте time-aware split, early stopping, мониторинг drift и проверку leakage.


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

Градиентный бустинг строит ансамбль деревьев последовательно, где каждое новое дерево предсказывает антиградиент функции потерь. Алгоритм: 1) Инициализируем базовое предсказание; 2) Вычисляем рессидулы (градиент loss); 3) Обучаем дерево на рессидулах; 4) Обновляем предсказания: F_new = F_old + lr × tree_pred. Learning rate контролирует вклад каждого дерева — меньше lr нужно больше деревьев, но модель стабильнее. Регуляризация: max_depth деревьев (обычно 3-8), subsample, column subsample. На практике: XGBoost автоматизирует выбор числа деревьев через early stopping.

## Частые ошибки

- Говорить, что каждое дерево исправляет отдельные ошибочные строки.
- Настраивать число деревьев без learning rate.
- Делать random split для временных данных.

## Дополнительные вопросы

- Чем gradient boosting отличается от AdaBoost?
- Зачем stochastic subsampling?
- Как интерпретировать вклад признаков?
