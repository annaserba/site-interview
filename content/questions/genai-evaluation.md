---
id: genai-evaluation
title: Как оценить качество генеративного AI?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["GenAI", "Evaluation", "Metrics"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Automated: BLEU (translation), ROUGE (summarization), faithfulness, relevance. Human evaluation: expert review, user feedback. LLM-as-judge: GPT-4 оценивает. Benchmarks: MMLU, HumanEval.

## Контекст

Важный aspect для production GenAI. Проверяют понимание evaluation methodologies.

## Как строить ответ

### Automated metrics

BLEU: n-gram overlap для translation. ROUGE: для summarization. Faithfulness: factual accuracy.

### Human evaluation

Expert review: quality assessment. User satisfaction: feedback. A/B testing: comparison.

### LLM-as-judge

GPT-4 оценивает relevance и coherence. Дёшево, scalable, ноbiased.

## Пример ответа

Translation: BLEU score 0.45 (good). Summarization: ROUGE-L 0.65. Faithfulness: 90%. Human eval: 4.2/5 rating. LLM-as-judge: GPT-4 rates coherence 8/10.

## Частые ошибки

- Использовать только automated metrics
- Не делать human evaluation
- Игнорировать bias в LLM-as-judge
- Не мониторить в production

## Дополнительные вопросы

- Как работает BLEU score?
- Что такое faithfulness и relevance?
- Как связать evaluation и deployment decisions?
