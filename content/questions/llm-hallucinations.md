---
id: llm-hallucinations
title: Как бороться с hallucinations в LLM?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Hallucinations", "AI"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Hallucinations: LLM генерирует правдоподобные, но неверные ответы. Борьба: RAG (real data), factual grounding, confidence scoring, human-in-the-loop, fine-tuning.

## Контекст

Ключевая проблема LLM applications. Проверяют понимание limitations.

## Как строить ответ

### Причины

Training data cutoff, lack of context, ambiguous queries, confidence calibration.

### Решения

RAG: provide real data. Factual grounding: cite sources. Confidence: score answers. Human review: для critical decisions.

### Инструменты

RAG pipeline, fact-checking APIs, confidence scoring, guardrails.

## Пример ответа

Hallucination: LLM говорит "React создан в 2015" (на самом деле 2013). Решения: RAG с актуальными данными, citation: "Источник: react.dev", confidence: "70% уверен". Практика: для medical/legal — human review обязателен.

## Частые ошибки

- Доверять LLM на 100%
- Не проверять факты
- Не использовать RAG
- Не делать human review для critical tasks

## Дополнительные вопросы

- Как измерить hallucination rate?
- Что такое factual grounding?
- Как связать RAG и hallucinations?
