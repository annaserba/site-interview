---
id: llm-guardrails
title: Как обеспечить безопасность LLM приложения?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Safety", "Guardrails"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Guardrails: фильтрация input/output, content moderation, PII detection, prompt injection protection. Инструменты: OpenAI moderation, Guardrails AI, NeMo Guardrails. Практики: rate limiting, logging, human review.

## Контекст

Критически важный для production LLM apps. Проверяют понимание safety measures.

## Как строить ответ

### Input filtering

Prompt injection detection. PII masking. Toxicity detection. Content moderation.

### Output filtering

Fact checking. Toxicity detection. PII leakage prevention. Hallucination detection.

### Мониторинг

Logging: все interactions. Alerting: anomalous behavior. Human review: для flagged content.

## Пример ответа

Input: prompt injection detection → "ignore previous instructions" → blocked. PII: "мой телефон 8-999-123-45-67" → masked. Output: toxicity check → blocked. Logging: все queries в БД. Alerting: anomaly detection.

## Частые ошибки

- Не фильтровать input
- Не мониторить output
- Не делать logging
- Не обрабатывать prompt injection

## Дополнительные вопросы

- Как работает prompt injection detection?
- Что такое NeMo Guardrails?
- Как связать guardrails и compliance?
