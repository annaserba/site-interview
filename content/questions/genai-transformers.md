---
id: genai-transformers
title: Как работают Transformers в генеративном AI?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["GenAI", "Transformers", "Architecture"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Transformers: self-attention mechanism для обработки sequences. Encoder-decoder архитектура. Self-attention: каждый token attended к каждому. Positional encoding: порядок tokens. Multi-head attention: параллельные attention heads.

## Контекст

Фундаментальная архитектура для GPT, BERT, и других LLM. Проверяют глубокое понимание.

## Как строить ответ

### Self-attention

Attention(Q,K,V) = softmax(QK^T / √d_k) × V. Каждый token вычисляет attention к каждому.

### Архитектура

Encoder: bidirectional (BERT). Decoder: autoregressive (GPT). Encoder-decoder: sequence-to-sequence (T5).

### Ключевые concepts

Positional encoding: добавляет информацию о позиции. Multi-head attention: параллельные attention patterns. Layer normalization.

## Пример ответа

GPT: decoder-only transformer. Token prediction: P(w_t | w_1, ..., w_{t-1}). Self-attention: "The cat sat on" → attention weights определяют relationships. Multi-head: один head может фокуситься на语法, другой на semantics.

## Частые ошибки

- Игнорировать positional encoding
- Не понимать attention mechanism
- Путать encoder и decoder
- Игнорировать computational complexity

## Дополнительные вопросы

- Как работает multi-head attention?
- Что такое positional encoding и зачем он нужен?
- Как связаны transformers и RNN?
