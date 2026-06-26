---
id: llm-embeddings
title: Что такое embeddings и зачем они нужны?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Embeddings", "Vector Search"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Embeddings: векторные представления текста/изображений. Семантический поиск: похожие meaning → близкие векторы. Инструменты: OpenAI embeddings, sentence-transformers, Cohere. Использование: RAG, semantic search, clustering.

## Контекст

Фундаментальный concept для AI applications. Проверяют понимание vector representations.

## Как строить ответ

### Что такое embeddings

Текст → вектор (1536 dimensions для OpenAI). Семантическое сходство: cosine similarity.

### Применение

Semantic search: "как настроить CORS" → ищет по meaning, не keywords. RAG: retrieve relevant chunks. Clustering: группировка документов.

### Инструменты

OpenAI text-embedding-3-small. Sentence-transformers (local). Cohere embed.

## Пример ответа

"React" → [0.02, -0.05, 0.12, ...]. "JavaScript framework" → [0.03, -0.04, 0.11, ...]. Cosine similarity: 0.95 (очень похожи). Поиск: query embedding → compare с document embeddings → top matches.

## Частые ошибки

- Не нормализовать vectors
- Использовать неправильный similarity metric
- Не учитывать размер embeddings
- Игнорировать latency

## Дополнительные вопросы

- Как выбрать embedding model?
- Что такое cosine similarity?
- Как оптимизировать vector search?
