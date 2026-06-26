---
id: product-ab-testing
title: Как проводить A/B тесты и анализировать результаты?
category: Product Analytics
scope: universal
languages: []
roles: ["Product Analytics"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["A/B Testing", "Product Analytics", "Statistics"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

A/B тест: сравнение двух вариантов на random samples. Этапы: гипотеза → sample size → randomization → collection → analysis. Статистическая значимость: p-value < 0.05, power > 80%.

## Контекст

Ключевой инструмент для product decisions. Проверяют понимание statistics.

## Как строить ответ

### Этапы

1. Гипотеза: вариант B лучше A. 2. Sample size: calculator. 3. Randomization: равные группы. 4. Collection: data. 5. Analysis: p-value, confidence interval.

### Статистика

p-value < 0.05: significance. Power > 80%: detects effect. Confidence interval: range of true value.

### Инструменты

Optimizely, LaunchDarkly, GA4, internal tools.

## Пример ответа

A/B: гипотеза "новый checkout increase conversion". Sample: 10000 users per variant. Duration: 2 недели. Результат: +5% conversion, p-value 0.03 → deploy.

## Частые ошибки

- Останавливать тест рано
- Не рассчитывать sample size
- Игнорировать multiple testing
- Не учитывать novelty effect

## Дополнительные вопросы

- Как рассчитать sample size?
- Что такое multiple testing correction?
- Как избежать peeking problem?
