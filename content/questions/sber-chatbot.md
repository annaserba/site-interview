---
id: sber-chatbot
title: как Сбер строит AI-чатботы для банковских сервисов?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["AI", "Chatbot", "Banking"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

AI chatbot: NLU (intent recognition), dialogue management, integration с banking systems,安全保障. Ключевые: точность распознавания, безопасность, compliance.

## Контекст

Ключевой AI use case для банка. Проверяют понимание conversational AI.

## Как строить ответ

### NLU

Intent recognition: transfer money, check balance. Entity extraction: amount, recipient.槽 filling: gathering required info.

### Dialogue management

State tracking: conversation context. Policy: next action. Fallback: transfer to human.

### Integration

Banking API: account info, transfers. Security: authentication, authorization.

## Пример ответа

User: "Переведи 1000₽ на карту 1234" → intent: transfer, amount: 1000, card: 1234. Bot: "Подтвердите перевод 1000₽ на карту ****1234?" → user: "Да" → execute transfer.

## Частые ошибки

- Не распознавать intents correctly
- Игнорировать security
- Не делать fallback на human
- Не тестировать edge cases

## Дополнительные вопросы

- How to improve NLU accuracy?
- What is dialogue state tracking?
- Как обеспечить безопасность чатбота в банке?
