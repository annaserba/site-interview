---
id: goznak-proxy-performance
title: Как Proxy влияет на производительность JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["Proxy", "Performance", "Reactivity"]
duration: 15 мин
difficulty: 4
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=2532s"
---

## Короткий ответ

Proxy перехватывает внутренние операции объекта и вызывает traps, поэтому ухудшает возможности JIT для inline caches и specialization. Цена зависит от engine, trap и hot path; универсального множителя нет. В reactive-системе важнее не только стоимость `get`, но число обёрнутых объектов, dependency tracking и лишние updates. Измеряйте на целевом workload и избегайте Proxy в плотных вычислительных циклах.

## Контекст

Вопрос возник при обсуждении реактивности Vue.

## Как строить ответ

### Объяснить механизм

Trap вместо обычного optimized property access.

### Назвать системную цену

Allocation, identity, deep wrapping и tracking dependencies.

### Измерить

Профиль production-сценария на целевых браузерах.

## Частые ошибки

- Приводить устаревший benchmark как закон.
- Считать Proxy всегда недопустимым.
- Забывать про изменение identity.

## Дополнительные вопросы

- Чем Proxy отличается от getter/setter?
- Почему Vue использует Proxy?

