---
id: genai-gpt-architecture
title: Как устроен GPT и чем он отличается от BERT?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["GenAI", "GPT", "BERT", "LLM"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

GPT: decoder-only, autoregressive (предсказывает следующий token). BERT: encoder-only, bidirectional (понимает контекст в обе стороны). GPT для генерации, BERT для understanding/classification.

## Контекст

Ключевое сравнение для понимания LLM architectures. Проверяют понимание differences.

## Как строить ответ

### GPT

Decoder-only. Autoregressive: P(w_t | w_1, ..., w_{t-1}). Left-to-right. Для генерации текста.

### BERT

Encoder-only. Bidirectional: видит весь контекст. Masked language modeling. Для classification, NER, Q&A.

### Сравнение

GPT: generates text. BERT: understands text. GPT: one-directional. BERT: bidirectional.

## Пример ответа

GPT: "The cat" →预测 "sat". BERT: "The [MASK] sat on" → predicts "cat". GPT: chatbot, code generation. BERT: sentiment analysis, named entity recognition.

## Частые ошибки

- Использовать GPT для classification
- Использовать BERT для text generation
- Путать autoregressive и bidirectional
- Не пониматьmasked language modeling

## Дополнительные вопросы

- Как работает masked language modeling в BERT?
- Что такое autoregressive generation?
- Как GPT и BERT связаны с fine-tuning?
