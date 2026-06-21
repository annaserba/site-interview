---
id: ds-when-mse
title: В каких случаях предпочтительнее использовать MSE?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MSE", "Regression", "Loss"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MSE подходит, когда крупные ошибки действительно непропорционально дороги или residual noise близок к Gaussian с постоянной дисперсией. Expected squared loss оптимизируется условным средним и имеет гладкий gradient, удобный для обучения. Цена — высокая чувствительность к outliers и зависимость единиц от квадрата target; для отчётности часто показывают RMSE.

## Контекст

Проверяется осознанный выбор квадратичного штрафа.

## Как строить ответ

### Связать с риском

Объясните, почему ошибка в два раза больше должна стоить примерно в четыре раза дороже.

### Проверить noise

Выбросы, heteroskedasticity и heavy tails могут сделать MSE нестабильной.

### Разделить loss и report metric

Модель можно обучать по MSE, а бизнесу показывать RMSE, MAE и сегментные ошибки.

## Частые ошибки

- Выбирать MSE по умолчанию без анализа выбросов.
- Сравнивать MSE для target разных единиц.
- Считать RMSE линейной стоимостью ошибки.

## Дополнительные вопросы

- Почему MSE прогнозирует mean?
- Когда Huber loss лучше?
- Как heteroskedasticity влияет на модель?
