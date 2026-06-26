---
id: wildberries-interview-inventory
title: Как управлять inventory на нескольких складах?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Wildberries"]
level: Senior
stage: Архитектура
tags: ["Inventory", "Warehouse", "E-commerce"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Inventory management: real-time tracking, multi-warehouse, reservation, reconciliation. Ключевые: accuracy, availability, optimization.

## Контекст

Типичный system design вопрос для маркетплейса. Проверяют ability проектировать inventory system.

## Как строить ответ

### Real-time tracking

Stock levels: available, reserved, shipped. Event sourcing: audit trail.

### Multi-warehouse

Inventory allocation: closest warehouse. Transfer: rebalance stock. Reservation: prevent overselling.

### Reconciliation

Periodic counts. Discrepancy resolution. Automation: RFID, barcode scanning.

## Пример ответа

Stock: warehouse A: 100, warehouse B: 50. Order: allocate from closest warehouse. Reservation: decrement available. Reconciliation: weekly count, adjust discrepancies.

## Частые ошибки

- Не делать real-time tracking
- Игнорироватьreservation
- Не планировать reconciliation
- Не оптимизировать allocation

## Дополнительные вопросы

- How to prevent overselling?
- What is event sourcing для inventory?
- How to optimize warehouse allocation?
