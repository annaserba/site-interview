---
id: llm-rag
title: Что такое RAG и как его реализовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["LLM", "RAG", "Vector Database"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

RAG (Retrieval Augmented Generation): LLM + поиск в базе знаний. Этапы: indexing (embedding documents), retrieval (finding relevant chunks), generation (LLM с context). Инструменты: Pinecone, Weaviate, ChromaDB, LangChain.

## Контекст

Ключевой architecture pattern для LLM apps. Проверяют понимание RAG pipeline.

## Как строить ответ

### Indexing

Документы → chunks → embeddings → vector database. Размер chunks: 200-1000 tokens. Overlap: 10-20%.

### Retrieval

Query → embedding → similarity search → top-k chunks. Фильтрация: metadata, relevance threshold.

### Generation

System prompt + retrieved chunks + user query → LLM response. Context window management.

## Пример ответа

RAG pipeline: документы → text splitter (500 tokens) → OpenAI embeddings → Pinecone. Query: "как настроить CORS?" → embedding → search → top 3 chunks → prompt: "Ответь используя: {chunks}". Преимущество: актуальные данные, fewer hallucinations.

## Частые ошибки

- Слишком большие chunks
- Не использовать metadata filtering
- Игнорировать relevance threshold
- Не обновлять index

## Дополнительные вопросы

- Как выбрать размер chunks?
- Что такое hybrid search?
- Как оценить качество RAG?
