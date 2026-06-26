---
id: math-distance-metrics
title: Какие метрики расстояния используются в ML?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Distance Metrics", "ML"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Euclidean (L2), Manhattan (L1), Cosine similarity, Hamming distance, Jaccard distance. Выбор зависит от типа данных: числовые → Euclidean, тексты → Cosine, categorical → Hamming.

## Контекст

Ключевой concept для clustering, classification, search. Проверяют понимание distance metrics.

## Как строить ответ

### Числовые данные

Euclidean: √Σ(x_i - y_i)². Manhattan: Σ|x_i - y_i|. Chebyshev: max|x_i - y_i|.

### Тексты/векторы

Cosine: similarity angle between vectors. Jaccard: set similarity.

### Категориальные

Hamming: number of different positions. Matching coefficient.

## Пример ответа

Euclidean: [1,2] и [4,6] → √(9+16) = 5. Cosine: [1,1] и [1,0] → 0.707 (45°). Hamming: "10101" и "10011" → 2 differences.

## Частые ошибки

- Использовать Euclidean для текстов
- Не нормализовать данные перед distance calculation
- Игнорировать dimensionality curse
- Не выбирать metric для данных

## Дополнительные вопросы

- Когда использовать Cosine vs Euclidean?
- Что такое dimensionality curse?
- Как связаны distance metrics и clustering?
