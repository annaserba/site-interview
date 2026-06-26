---
id: ms-architecture-overview
title: Что такое микросервисная архитектура и чем она отличается от монолита?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Microservices", "Architecture", "System Design"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Микросервисная архитектура — подход, где приложение разделено на небольшие независимые сервисы, каждый из которых выполняет одну бизнес-функцию. Отличия от монолита: независимое деплои, отдельные базы данных, технологический стек для каждого сервиса.

## Контекст

Фундаментальный вопрос для понимания современной архитектуры. Проверяют знание trade-offs.

## Как строить ответ

### Монолит

Всё в одном процессе. Преимущества: простота, транзакции, debugging. Недостаток: масштабирование, déploiement coupling.

### Микросервисы

Каждый сервис — отдельный процесс. Преимущества: независимое масштабирование, technology freedom. Недостатки: operational complexity, distributed transactions.

### Trade-offs

Монолит проще для старта, микросервисы — для scale и команд.

## Пример ответа

Монолит: всё в одном JVM-процессе, одна БД. Преимущество: ACID транзакции, простота debugging. Микросервисы: userService, orderService, paymentService — каждый с own DB. Преимущество: деплой orderService не влияет на userService. Недостатки: network calls между сервисами, eventual consistency.

## Частые ошибки

- Начинать с микросервисов без необходимости
- Делать слишком много сервисов (nano services)
- Не планировать operational complexity
- Игнорировать distributed transactions

## Дополнительные вопросы

- Когда стоит переходить с монолита на микросервисы?
- Что такое nano services и почему это плохо?
- Как связаны микросервисы и Domain-Driven Design?
