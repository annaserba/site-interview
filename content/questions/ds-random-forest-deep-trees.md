---
id: ds-random-forest-deep-trees
title: Зачем в Random Forest нужны глубокие деревья?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Random Forest", "Trees", "Bias variance"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

В Random Forest отдельные деревья часто выращивают глубокими, чтобы они имели низкий bias и могли описывать сложные взаимодействия. Их высокая variance уменьшается усреднением многих декоррелированных деревьев, обученных на bootstrap и случайных подмножествах признаков. Глубина не обязана быть максимальной: min samples, leaf size и depth всё равно настраивают по validation с учётом памяти и latency.

## Контекст

Нужно объяснить, почему ансамбль способен использовать нестабильные base learners.

## Как строить ответ

### Разделить bias и variance

Глубокое дерево снижает bias, bagging уменьшает variance ансамбля.

### Объяснить декорреляцию

Feature subsampling не даёт сильному признаку сделать все деревья одинаковыми.

### Учесть стоимость

Глубина увеличивает размер модели, inference latency и риск leaves с малым support.

## Частые ошибки

- Говорить, что forest не может переобучиться.
- Считать глубокие деревья обязательным правилом.
- Игнорировать корреляцию деревьев.

## Дополнительные вопросы

- Как влияет `max_features`?
- Что произойдёт с bias при ограничении depth?
- Почему одно дерево нестабильно?
