---
id: llm-prompt-engineering
title: Что такое prompt engineering и какие техники существуют?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Prompt Engineering", "AI"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Prompt engineering — искусство составления запросов к LLM для получения качественных ответов. Техники: zero-shot, few-shot, chain-of-thought, role prompting, structured output, RAG.

## Контекст

Актуальный topic для разработки AI-powered приложений. Проверяют понимание LLM capabilities.

## Как строить ответ

### Базовые техники

Zero-shot: просто вопрос. Few-shot: примеры в prompt. Chain-of-thought: "давай пошагово". Role: "ты — эксперт по..."".

### Продвинутые

RAG: retrieval augmented generation — подсказки из базы знаний. Structured output: JSON schema. Function calling: LLM вызывает functions.

### Оптимизация

Temperature: creativity (0-1). Max tokens: длина ответа. Top-p: nucleus sampling.

## Пример ответа

Few-shot: "Пример: INPUT: что такое React? OUTPUT: React — это JavaScript библиотека... INPUT: что такое Vue? OUTPUT:". Chain-of-thought: "Реши задачу пошагово: 1) Определи переменные, 2) Составь уравнение, 3) Решите". RAG: ищем релевантные документы → добавляем в context.

## Частые ошибки

- Слишком длинные prompts
- Не давать context
- Не использовать examples
- Игнорировать hallucinations

## Дополнительные вопросы

- Как работать с hallucinations?
- Что такое temperature и top-p?
- Как интегрировать RAG в приложение?
