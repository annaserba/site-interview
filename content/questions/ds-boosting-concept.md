---
id: ds-boosting-concept
title: Что такое бустинг?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
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

## Частые ошибки

- Называть любой ансамбль бустингом.
- Говорить, что boosting всегда переобучается на шуме.
- Путать алгоритм с XGBoost-библиотекой.

## Дополнительные вопросы

- Почему weak learners полезны?
- Чем boosting отличается от stacking?
- Можно ли обучать boosting параллельно?
