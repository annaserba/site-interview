---
id: product-cohort-analysis
title: Как проводить cohort analysis для понимания retention?
category: Product Analytics
scope: universal
languages: []
roles: ["Product Analytics"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Cohort Analysis", "Product Analytics", "Retention"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Cohort analysis: группировка users по共同特征 (дата signup, источник). Отслеживание behavior over time. Ключевое: retention curves, comparison between cohorts.

## Контекст

Важный инструмент для retention analysis. Проверяют понимание cohort methodology.

## Как строить ответ

### Типы когорт

Acquisition cohort: по дате signup. Behavioral cohort: по actions. Size cohort: по размеру company.

### Метрики

Retention rate: % users returning. Churn rate: % users leaving. Revenue per cohort.

### Инструменты

Amplitude, Mixpanel, GA4, SQL.

## Пример ответа

Cohort: January 2024 signup. Week 1: 100% → Week 4: 60% → Week 12: 40%. Comparison: January vs February cohorts. January: +10% retention (onboarding improved).

## Частые ошибки

- Не сегментировать когорты
- Игнорировать time-based analysis
- Не сравнивать когорты
- Не учитывать acquisition source

## Дополнительные вопросы

- Как определить cohort boundaries?
- Что такое retention curve?
- Как использовать cohort analysis для product decisions?
