---
id: math-regression
title: Какие типы регрессии существуют в ML?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Regression", "ML"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Linear: y = wx + b. Polynomial: нелинейные relationships. Ridge/L2: regularization. Lasso/L1: feature selection. Logistic: classification (sigmoid).

## Контекст

Фундаментальные models для prediction. Проверяют понимание regression types.

## Как строить ответ

### Linear regression

y = Xw + b. Loss: MSE. Minimize: normal equation or gradient descent.

### Regularized

Ridge: MSE + λΣw² → small weights. Lasso: MSE + λΣ|w| → sparse weights. ElasticNet: combination.

### Logistic

Classification: σ(Xw + b). Loss: cross-entropy. Output: probability 0-1.

## Пример ответа

Linear: price = 50×area + 10000. Ridge: same but smaller coefficients. Lasso: some coefficients → 0 (feature selection). Logistic: P(spam) = σ(-2 + 3×"free" + 1×"click") = 0.87.

## Частые ошибки

- Использовать linear regression для classification
- Не делать regularization
- Игнорировать overfitting
- Не нормализовать features

## Дополнительные вопросы

- Как работает logistic regression?
- Что такое Ridge vs Lasso?
- Как связаны регрессия и neural networks?
