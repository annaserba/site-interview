---
id: genai-fine-tuning
title: Как fine-tune LLM для конкретной задачи?
category: System Design
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["GenAI", "Fine-tuning", "LLM"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Этапы: сбор training data, выбор base model, настройка hyperparameters, training, evaluation. Методы: full fine-tuning, LoRA, QLoRA, instruction tuning.

## Контекст

Практический topic для LLM customization. Проверяют понимание fine-tuning process.

## Как строить ответ

### Подготовка данных

Format: instruction-input-output pairs. Quality > quantity. Size: 100-10000 examples.

### Методы

Full fine-tuning: обновление всех weights. LoRA: low-rank adaptation (меньше compute). QLoRA: quantized LoRA (ещё дешевле).

### Evaluation

Human evaluation: quality assessment. Automated metrics: BLEU, ROUGE. A/B testing: comparison с baseline.

## Пример ответа

Data: 1000 instruction pairs. Model: LLaMA 2 7B. Method: LoRA (rank=16). Training: 3 epochs, learning rate 2e-4. Evaluation: human rating + automated metrics. Result: +15% quality на target task.

## Частые ошибки

- Слишком мало training data
- Использовать wrong format
- Не оценивать quality после training
- Игнорировать overfitting

## Дополнительные вопросы

- Как выбрать between LoRA и full fine-tuning?
- Что такое instruction tuning?
- How to evaluate fine-tuned model quality?
