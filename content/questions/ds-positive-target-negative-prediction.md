---
id: ds-positive-target-negative-prediction
title: Какая модель может предсказать отрицательное значение при положительном target?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regression", "Extrapolation", "Constraints"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Неограниченная регрессионная модель — например linear regression, neural network с линейным output или boosting с подходящим objective — может вернуть отрицательное значение, даже если все training targets положительны. Деревья с prediction как средним leaf обычно остаются в диапазоне наблюдаемых target, но ансамбль и objective надо проверять. Если domain требует positivity, моделируйте `log(y)`, используйте log-link/Gamma/Tweedie objective или положительную output-функцию и валидируйте bias обратного преобразования.

## Контекст

Проверяется различие interpolation/extrapolation и способ кодировать ограничение target.

## Как строить ответ

### Посмотреть output space

Linear output не знает о положительности, независимо от training sample.

### Выбрать корректную связь

Log-link гарантирует положительное expected value и часто лучше соответствует multiplicative noise.

### Проверить последствия

Простое clipping создаёт bias и скрывает проблему за пределами training support.

## Частые ошибки

- Утверждать, что положительный train target запрещает отрицательный prediction.
- Клиппировать к нулю без оценки bias.
- Делать log transform и забывать bias correction.

## Дополнительные вопросы

- Какие модели плохо экстраполируют?
- Когда использовать Gamma regression?
- Как восстановить mean после log transform?
