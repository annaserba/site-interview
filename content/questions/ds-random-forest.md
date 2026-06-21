---
id: ds-random-forest
title: Что такое Random Forest?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Random Forest", "Bagging", "Trees"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Random Forest — ансамбль деревьев, обученных на bootstrap-выборках с случайным подмножеством признаков в каждом split. Усреднение декоррелированных деревьев снижает variance относительно одного глубокого дерева. Модель устойчива и даёт OOB-оценку, но может быть тяжёлой по памяти и latency, плохо экстраполирует регрессию и даёт смещённую impurity importance.

## Контекст

Нужно связать bagging, декорреляцию и bias-variance trade-off.

## Как строить ответ

### Описать разнообразие

Bootstrap меняет строки, feature subsampling — доступные split, уменьшая корреляцию деревьев.

### Объяснить агрегацию

Классификация голосует или усредняет probabilities, регрессия усредняет predictions.

### Разобрать оценку

OOB полезен, но time-dependent data всё равно требует временного split; importance лучше проверять permutation или SHAP.

## Частые ошибки

- Называть Random Forest boosting.
- Интерпретировать impurity importance как причинность.
- Считать, что больше деревьев всегда ухудшает overfitting.

## Дополнительные вопросы

- Чем bagging отличается от boosting?
- Что такое OOB score?
- Как forest работает с коррелированными признаками?
