---
id: ds-mse-vs-mae
title: В чём разница между MSE и MAE?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["MSE", "MAE", "Regression"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

MSE усредняет квадраты residuals, сильнее штрафует большие ошибки, гладкая и оптимизирует conditional mean. MAE усредняет модули, устойчивее к выбросам, негладкая в нуле и оптимизирует conditional median. Выбор — это решение о цене ошибки и целевой статистике, а не только о математическом удобстве. Для компромисса используют Huber loss.

## Контекст

Нужно сравнить чувствительность, оптимизацию и интерпретацию.

## Как строить ответ

### Сравнить штраф

Покажите, как residual 10 влияет на MSE в сто раз, а на MAE в десять.

### Назвать estimand

Squared loss ведёт к mean, absolute loss — к median.

### Выбрать по задаче

Исходите из business cost, tail behavior и требований к robustness.

## Частые ошибки

- Говорить, что MAE всегда лучше при выбросах.
- Сравнивать численные значения MAE и MSE напрямую.
- Не учитывать единицы измерения.

## Дополнительные вопросы

- Что делает Huber loss?
- Какой loss выбрать для асимметричной ошибки?
- Почему median устойчивее mean?
