---
id: ozon-payments
title: Как Ozon обрабатывает платежи и возвраты?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Ozon"]
level: Senior
stage: Архитектура
tags: ["Payments", "E-commerce", "Security"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Payments: payment processing, escrow, seller payouts, refunds, fraud prevention. Ключевые: security (PCI DSS), reliability, reconciliation.

## Контекст

Критически важный для маркетплейса. Проверяют понимание payment system.

## Как строить ответ

### Payment processing

Multiple methods: cards, wallets, SBP. Idempotency: double charges. 3D Secure: authentication.

### Escrow

Hold funds until delivery. Release: confirmation received. Disputes: arbitration.

### Reconciliation

Match transactions с bank statements. Reconcile daily. Handle mismatches.

## Пример ответа

Order: buyer pays 5000₽ → escrow → seller ships → delivery confirmed → release to seller (minus commission). Refund: buyer returns → inspect → refund. Reconciliation: daily batch с bank.

## Частые ошибки

- Не делать idempotency
- Игнорировать reconciliation
- Не обрабатывать disputes
- Не обеспечивать PCI DSS

## Дополнительные вопросы

- How to implement idempotent payments?
- What is escrow payment system?
- How to handle payment reconciliation?
