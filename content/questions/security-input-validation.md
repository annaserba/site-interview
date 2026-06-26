---
id: security-input-validation
title: Как валидировать user input на клиенте и сервере?
category: Backend
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Validation", "Input"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Валидация: проверка input на correctness и security. Клиент: UX (мгновенный feedback). Сервер: security (единственный source of truth). Инструменты: Zod, Joi, Yup,express-validator.

## Контекст

Ключевой security layer. Проверяют понимание defense in depth.

## Как строить ответ

### Клиентская валидация

UX: мгновенный feedback, server load. Не security: можно bypass.

### Серверная валидация

Security: единственный source of truth. Never доверять client input.

### Инструменты

Zod: TypeScript-first. Joi: popular. Yup: React forms. express-validator: middleware.

## Пример ответа

Zod schema: `z.object({ email: z.string().email(), age: z.number().min(0) })`. Клиент: React Hook Form + Zod resolver. Сервер: express-validator middleware. Never: доверять client validation.

## Частые ошибки

- Доверять клиентской валидации
- Не валидировать на сервере
- Использовать regex для email
- Не escaping special characters

## Дополнительные вопросы

- Как выбрать между Zod и Joi?
- Что такое schema validation?
- Как связаны валидация и injection attacks?
