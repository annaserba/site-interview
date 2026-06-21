---
id: ds-regularization-concept
title: Что такое регуляризация в машинном обучении?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regularization", "Generalization", "Bias variance"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Регуляризация ограничивает эффективную сложность модели или вводит prior, чтобы улучшить expected generalization. Это может быть penalty в objective, ограничение структуры, шум, augmentation или early stopping. Она обычно увеличивает bias и снижает variance; силу подбирают на validation data. Регуляризация не исправляет leakage, неверную target и несовпадение training и production distribution.

## Контекст

Нужно объяснить общий принцип шире L1 и L2.

## Как строить ответ

### Связать с objective

`loss + λ penalty` меняет предпочтение между fit и сложностью; λ задаёт trade-off.

### Дать prior-интерпретацию

L2 соответствует Gaussian prior на веса, L1 — Laplace prior и sparsity.

### Проверить generalization

Выбирайте λ внутри cross-validation и оценивайте итог один раз на untouched test set.

## Частые ошибки

- Считать регуляризацию гарантией от переобучения.
- Подбирать λ на test set.
- Ограничивать понятие только penalty весов.

## Дополнительные вопросы

- Почему L1 создаёт sparsity?
- Как регуляризация связана с Bayesian prior?
- Когда early stopping эквивалентен regularization?
