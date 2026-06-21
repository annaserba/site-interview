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

## Частые ошибки

- Говорить, что каждое дерево исправляет отдельные ошибочные строки.
- Настраивать число деревьев без learning rate.
- Делать random split для временных данных.

## Дополнительные вопросы

- Чем gradient boosting отличается от AdaBoost?
- Зачем stochastic subsampling?
- Как интерпретировать вклад признаков?
