---
id: math-dimensionality-reduction
title: Как работает dimensionality reduction?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "PCA", "Dimensionality Reduction"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

PCA (Principal Component Analysis): проекция на principal components через eigendecomposition. t-SNE: nonlinear для visualization. UMAP: быстрее t-SNE, сохраняет global structure. LDA: supervised reduction.

## Контекст

Важный technique для data preprocessing и visualization. Проверяют понимание reduction methods.

## Как строить ответ

### PCA

1. Нормализовать данные. 2. Compute covariance matrix. 3. Eigendecomposition. 4. Select top k eigenvectors. 5. Project data.

### t-SNE

Nonlinear, для visualization в 2D/3D. Сохраняет local structure.

### UMAP

Быстрее t-SNE, лучше сохраняет global structure.

## Пример ответа

PCA: 100 features → 10 principal components (90% variance explained). t-SNE: 784 pixels (MNIST) → 2D visualization. UMAP: clustering в high-dimensional data.

## Частые ошибки

- Использовать PCA без нормализации
- Не проверять variance explained
- Использовать t-SNE для clustering
- Игнорировать interpretability

## Дополнительные вопросы

- Как выбрать количество components в PCA?
- Что такое variance explained?
- Как связать dimensionality reduction и overfitting?
