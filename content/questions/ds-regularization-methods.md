---
id: ds-regularization-methods
title: Какие методы регуляризации вы знаете?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Regularization", "Generalization", "Model selection"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Методы зависят от модели: L1 даёт sparsity, L2 сжимает веса, Elastic Net сочетает их; для деревьев работают ограничение глубины, min samples, subsampling и shrinkage; для нейросетей — weight decay, dropout, augmentation и early stopping. Также регуляризуют через feature selection, priors и ограничение hypothesis class. Силу выбирают только на validation внутри корректной схемы split.

## Контекст

Проверяется системное понимание способов снизить variance и встроить prior.

## Как строить ответ

### Объяснить механизм

Penalty меняет objective, early stopping ограничивает путь оптимизации, augmentation расширяет наблюдаемые инварианты.

### Связать с моделью

L1/L2 не являются универсальным ответом для любого алгоритма.

### Настраивать без leakage

Все preprocessing и подбор hyperparameters должны находиться внутри cross-validation pipeline.

## Частые ошибки

- Называть dropout аналогом L2 без оговорок.
- Подбирать lambda на test set.
- Считать регуляризацию заменой качественным данным.

## Дополнительные вопросы

- Почему L1 создаёт нулевые коэффициенты?
- Чем weight decay отличается от L2 в adaptive optimizers?
- Когда early stopping является регуляризацией?
