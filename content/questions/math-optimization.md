---
id: math-optimization
title: Какие методы оптимизации используются в ML?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Optimization", "ML"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Gradient descent (batch, stochastic, mini-batch), momentum, Adam, RMSprop. Convex vs non-convex optimization. Regularization: L1 (Lasso), L2 (Ridge), dropout.

## Контекст

Ключевой topic для training ML models. Проверяют понимание optimization methods.

## Как строить ответ

### Градиентные методы

Batch GD: весь dataset. SGD: one sample. Mini-batch: subset. Adam: adaptive learning rate.

### Regularization

L1: sparse models (Lasso). L2: small weights (Ridge). Dropout: overfitting.

### Метрики

Loss function: minimize. Learning rate: step size. Convergence: when loss stabilizes.

## Пример ответа

SGD: w = w - α × ∂L/∂w для одного sample. Adam: adaptive learning rate для каждого weight. L2: loss + λΣw² → smaller weights. Dropout: random neurons off → prevents co-adaptation.

## Частые ошибки

- Не настраивать learning rate
- Использовать SGD без momentum
- Не делать regularization
- Игнорировать overfitting

## Дополнительные вопросы

- Как работает Adam optimizer?
- Что такое learning rate scheduling?
- Как связаны regularization и overfitting?
