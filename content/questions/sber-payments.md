---
id: sber-payments
title: Как Сбер обеспечивает безопасность онлайн-платежей?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["Payments", "Security", "Banking"]
duration: 10 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Безопасность платежей: tokenization, 3D Secure, fraud detection, encryption, PCI DSS compliance. Ключевые: real-time fraud scoring, secure authentication.

## Контекст

Критически важный для банка. Проверяют понимание payment security.

## Как строить ответ

### Tokenization

Replace card data с tokens. No card storage. Secure vault.

### 3D Secure

Two-factor authentication. 3DS2: frictionless flow для low-risk.

### Fraud detection

ML models: transaction patterns. Real-time scoring: < 100ms. Rules + ML.

## Пример ответа

Payment: card data → tokenization → 3DS2 authentication → fraud score 0.1 → approve. Token: replace card number → secure storage. 3DS: risk-based → frictionless для trusted devices.

## Частые ошибки

- Хранить card data
- Не использовать 3D Secure
- Игнорировать fraud detection
- Не делать tokenization

## Дополнительные вопросы

- How does tokenization work?
- What is 3D Secure 2.0?
- How to implement real-time fraud detection?
