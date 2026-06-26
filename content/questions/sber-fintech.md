---
id: sber-fintech
title: Как Сбер обеспечивает безопасность финансовых сервисов?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["Security", "Fintech", "Compliance"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Финансовая безопасность: fraud detection (ML), PCI DSS compliance, encryption, transaction monitoring, AML (anti-money laundering). Ключевые: real-time fraud scoring, regulatory compliance.

## Контекст

Ключевой domain для банка. Проверяют понимание fintech security.

## Как строить ответ

### Fraud detection

ML models: transaction patterns, user behavior. Real-time scoring: < 100ms. Rules engine + ML.

### Compliance

PCI DSS: card data security. GDPR: user data. AML: suspicious activity reporting.

### Encryption

Data at rest: AES-256. Data in transit: TLS. Key management: HSM.

## Пример ответа

Transaction: $500 purchase in different country → fraud score 0.85 → flag for review. ML model: features = amount, location, time, history. PCI DSS: tokenization, no card data storage.

## Частые ошибки

- Не делать real-time fraud detection
- Игнорировать compliance requirements
- Не шифровать sensitive data
- Не мониторить suspicious patterns

## Дополнительные вопросы

- Как работает fraud detection ML model?
- Что такое PCI DSS и как его соблюдать?
- How to implement AML monitoring?
