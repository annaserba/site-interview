---
id: vk-ads-platform
title: Как VK строит рекламную платформу?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["VK"]
level: Senior
stage: Архитектура
tags: ["Ads", "Platform", "Data"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Ads platform: targeting (user segments), bidding (auction), ad serving, conversion tracking, reporting. Ключевые: real-time bidding, relevance scoring, budget optimization.

## Контекст

Ключевой revenue stream для соцсети. Проверяют понимание ads architecture.

## Как строить ответ

### Targeting

User segments: demographics, interests, behavior. Custom audiences:上传 user lists.

### Bidding

Second-price auction. Budget optimization: pacing. Real-time bidding: < 100ms.

### Ad serving

Relevance scoring: ad quality, user interest. Frequency capping. Rotation.

## Пример ответа

Advertiser: target "мужчины 25-35, интересы: technology". User visits → auction → bid $0.50 → relevance score 0.8 → win → show ad. Conversion tracking: click → purchase → report.

## Частые ошибки

- Не оптимизировать relevance
- Игнорировать frequency capping
- Не делать conversion tracking
- Не балансировать advertiser и user experience

## Дополнительные вопросы

- How does real-time bidding work?
- What is ad relevance scoring?
- How to optimize ad budget pacing?
