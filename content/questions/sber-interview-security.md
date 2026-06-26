---
id: sber-interview-security
title: Как спроектировать безопасную authentication system?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["Security", "Auth", "Banking"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Authentication: multi-factor (password + OTP + biometric), session management, token rotation, fraud detection. Ключевые: security, compliance, user experience.

## Контекст

Типичный system design вопрос для банка. Проверяют ability проектировать secure auth.

## Как строить ответ

### MFA

Something you know (password) + have (phone) + are (biometric). Risk-based: step-up auth.

### Session management

Short-lived access tokens. Refresh token rotation. Session fixation prevention.

### Fraud detection

Behavioral analysis. Device fingerprinting. Risk scoring.

## Пример ответа

Login: password → OTP via SMS → biometric (Face ID). Access token: 15 min, refresh: 7 days. Risk: new device → additional verification. Fraud: suspicious pattern → block + alert.

## Частые ошибки

- Делать MFAобязательным всегда
- Не делать token rotation
- Игнорировать fraud detection
- Не планировать account recovery

## Дополнительные вопросы

- Как реализовать step-up authentication?
- What is token rotation и зачем она нужна?
- How to implement behavioral analysis?
