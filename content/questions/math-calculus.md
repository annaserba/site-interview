---
id: math-calculus
title: Какой calculus нужен для deep learning?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Calculus", "Deep Learning"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Производные, градиенты, chain rule, partial derivatives. Применение: backpropagation (chain rule), gradient descent (gradients), optimization (learning rate).

## Контекст

Фундаментальная math для deep learning. Проверяют понимание calculus в ML.

## Как строить ответ

### Производные

Rate of change. Partial derivatives: derivative по одной переменной. Gradient: vector of partial derivatives.

### Chain rule

d/dx f(g(x)) = f'(g(x)) × g'(x). В deep learning: backpropagation = chain rule through layers.

### Gradient descent

θ = θ - α × ∇J(θ). Learning rate α controls step size.

## Пример ответа

Loss function: L = (y - ŷ)². Gradient: ∂L/∂w = 2(y - ŷ) × (-x). Update: w = w - α × gradient. Chain rule: ∂L/∂w₁ = ∂L/∂ŷ × ∂ŷ/∂h × ∂h/∂w₁.

## Частые ошибки

- Не понимать chain rule
- Использовать слишком большой learning rate
- Игнорировать gradient vanishing/exploding
- Не нормализовать входные данные

## Дополнительные вопросы

- Как работает backpropagation?
- Что такое vanishing gradient problem?
- Как связаны gradient descent и convexity?
