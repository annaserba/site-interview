---
id: math-linear-algebra
title: Какая линейная алгебра нужна для ML?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Linear Algebra", "ML"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Векторы, матрицы, линейные преобразования, собственные значения, SVD. Применение: embeddings (векторы), PCA (собственные значения), recommendation systems (matrix factorization).

## Контекст

Фундаментальная math для ML. Проверяют понимание mathematical foundations.

## Как строить ответ

### Векторы и матрицы

Vector operations: add, multiply, dot product. Matrix operations: multiply, transpose, inverse.

### Ключевые concepts

Eigenvalues/eigenvectors: важны для PCA. SVD: matrix factorization. Norms: L1, L2 distances.

### Применение в ML

Embeddings = векторы. Attention = matrix operations. PCA = eigendecomposition. SVD = dimensionality reduction.

## Пример ответа

Embedding: "кот" → [0.2, -0.5, 0.8]. Dot product: similarity = 0.2×0.3 + (-0.5)×0.1 + 0.8×0.4 = 0.43. PCA: собственные значения матрицы ковариации → principal components. SVD: U × Σ × V^T → factorize ratings matrix в recommendation system.

## Частые ошибки

- Не понимать dot product meaning
- Игнорировать eigendecomposition
- Забывать про numerical stability
- Не нормализовать vectors

## Дополнительные вопросы

- Как работает PCA математически?
- Что такое SVD и зачем он нужен?
- Как связаны cosine similarity и dot product?
