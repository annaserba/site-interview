---
id: avito-moderation
title: Как Avito модерирует контент на площадке?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Avito"]
level: Senior
stage: Архитектура
tags: ["Moderation", "ML", "Content"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Content moderation: automated ML (text, images, video), rules engine, human review. Ключевые: scale (millions listings), accuracy, speed.

## Контекст

Ключевой для trust and safety. Проверяют понимание moderation system.

## Как строить ответ

### Automated moderation

ML models: text classification (spam, fraud). Image recognition: nudity, violence. Video analysis.

### Rules engine

Business rules: prohibited items, pricing rules. Keyword filtering.

### Human review

Escalation: uncertain cases. Quality: accuracy improvements. Training: feedback loop.

## Пример ответа

Listing: text contains "garant" → spam score 0.9 → auto-block. Image: nudity detected → block. Uncertain: human reviewer → approve/block → feedback to ML.

## Частые ошибки

- Использовать только automated moderation
- Не делать human review
- Не обновлять ML models
- Не монитеритьaccuracy

## Дополнительные вопросы

- How to build content moderation ML model?
- What is human-in-the-loop moderation?
- How to measure moderation accuracy?
