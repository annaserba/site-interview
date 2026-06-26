---
id: llm-fine-tuning
title: Когда использовать fine-tuning vs prompt engineering?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["LLM", "Fine-tuning", "AI"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Prompt engineering: быстрый старт, без training data. Fine-tuning: custom behavior, domain-specific knowledge. Когда fine-tune: consistent format, proprietary data, performance requirements. Cost/benefit analysis.

## Контекст

Стратегический decision для LLM apps. Проверяют понимание trade-offs.

## Как строить ответ

### Prompt engineering

Быстро, дёшево, без training. Ограничения: context window, generic behavior.

### Fine-tuning

Custom model behavior, domain knowledge. Требует: training data, compute, maintenance. Преимущество: consistent output, better performance.

### Выбор

Начните с prompt engineering. Если не хватает → fine-tuning. Если нужна скорость → fine-tuning.

## Пример ответа

Prompt engineering: для chatbot, Q&A, summarization. Fine-tuning: для medical diagnosis (domain knowledge), code generation (specific style), (custom labels). Cost: prompt engineering $0, fine-tuning $100-1000+.

## Частые ошибки

- Fine-tune без необходимости
- Не собирать training data
- Игнорировать cost/benefit
- Не оценивать quality

## Дополнительные вопросы

- Как собрать training data для fine-tuning?
- Что такое LoRA и зачем она нужна?
- Как оценить качество fine-tuned model?
