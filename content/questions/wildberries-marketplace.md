---
id: wildberries-marketplace
title: Как Wildberries обеспечивает работу маркетплейса?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Wildberries"]
level: Senior
stage: Архитектура
tags: ["Marketplace", "E-commerce", "Scale"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Wildberries: catalog management, search, payments, seller tools, analytics. Ключевые: millions products, high traffic, seller onboarding, order processing.

## Контекст

Ключевой domain для маркетплейса. Проверяют понимание marketplace architecture.

## Как строить ответ

### Catalog

Product management. Search: inverted index + ML ranking. Filters: attributes.

### Payments

Payment processing. Escrow: hold funds until delivery. seller payouts.

### Analytics

Seller dashboard: sales, views, conversion. Real-time data.

## Пример ответа

Search: "iPhone" → inverted index → ML ranking (relevance, popularity, seller rating) → top results. Payment: buyer pays → escrow → delivery confirmed → seller payout.

## Частые ошибки

- Не масштабировать search
- Игнорировать seller analytics
- Не делать real-time inventory
- Не обеспечивать payment security

## Дополнительные вопросы

- How to build marketplace search?
- What is escrow payment system?
- Как обеспечить seller onboarding?
