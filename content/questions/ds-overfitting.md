---
id: ds-overfitting
title: Что такое переобучение модели?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Overfitting", "Generalization", "Validation"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Переобучение — ситуация, когда модель подстраивается под шум и особенности training sample, поэтому training quality растёт, а ожидаемое качество на новых данных ухудшается. Диагностируют по корректной validation-схеме и learning curves, но сначала исключают leakage и distribution shift. Снижают complexity, усиливают regularization, добавляют данные, early stopping и устойчивые признаки.

## Контекст

Проверяется generalization, bias-variance и корректность эксперимента.

## Как строить ответ

### Проверить split

Time, group и entity leakage часто маскируются под «слишком хорошую модель».

### Сравнить curves

Большой train-validation gap указывает на variance; плохи обе метрики — вероятен underfitting.

### Выбрать лечение

Метод зависит от источника: complexity, шум labels, малый sample или неверная validation distribution.

## Частые ошибки

- Называть любое падение production quality overfitting.
- Настраивать модель по test set.
- Лечить leakage регуляризацией.

## Дополнительные вопросы

- Как отличить overfitting от drift?
- Что показывают learning curves?
- Почему больше данных не всегда помогает?
