---
id: llm-evaluation
title: Как оценить качество LLM приложения?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Evaluation", "AI"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Оценка LLM: automated metrics (BLEU, ROUGE, faithfulness), human evaluation, A/B testing, LLM-as-judge. Ключевые: accuracy, relevance, coherence, safety. Benchmarks: MMLU, HumanEval.

## Контекст

Важный aspect для production LLM apps. Проверяют понимание evaluation methodologies.

## Как строить ответ

### Automated metrics

BLEU: translation quality. ROUGE: summarization. Faithfulness: factual accuracy. Relevance: topical similarity.

### Human evaluation

Expert review, user feedback, A/B testing. Дорого, нонаиболее accurate.

### LLM-as-judge

GPT-4 оценивает ответы другого LLM. Дёшево, scalable.

## Пример ответа

Metrics: accuracy (85%), faithfulness (90%), relevance (88%). Human eval: 5 экспертов оценивают 100 ответов. A/B test: variant A vs B, metric: user satisfaction. LLM-as-judge: GPT-4 оценивает relevance и coherence.

## Частые ошибки

- Использовать только automated metrics
- Не делать human evaluation
- Игнорировать safety evaluation
- Не мониторить в production

## Дополнительные вопросы

- Как работает LLM-as-judge?
- Что такое faithfulness score?
- Как настроить A/B testing для LLM?
