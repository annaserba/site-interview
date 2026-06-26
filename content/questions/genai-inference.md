---
id: genai-inference
title: Как оптимизировать inference для LLM?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["GenAI", "Inference", "Optimization"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Оптимизация inference: quantization (INT8/INT4), pruning, distillation, batching, caching, GPU optimization. Инструменты: vLLM, TensorRT-LLM, llama.cpp, Ollama.

## Контекст

Ключевой topic для production deployment. Проверяют понимание inference optimization.

## Как строить ответ

### Quantization

INT8: halves memory, faster. INT4: even smaller, some quality loss. GPTQ, AWQ, GGUF.

### Pruning

Remove unnecessary weights. Structured/unstructured pruning.

### Batching

Group requests для GPU efficiency. Continuous batching: dynamic batching.

## Пример ответа

LLaMA 70B: 140GB FP16 → 35GB INT4. vLLM: continuous batching → higher throughput. llama.cpp: CPU inference, quantized models. TensorRT-LLM: GPU optimization.

## Частые ошибки

- Не использовать quantization
- Не batch requests
- Игнорировать memory constraints
- Не мониторить latency

## Дополнительные вопросы

- Как работает quantization?
- Что такое vLLM и зачем он нужен?
- Как связать inference optimization и cost?
