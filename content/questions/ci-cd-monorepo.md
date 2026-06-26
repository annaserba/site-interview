---
id: ci-cd-monorepo
title: Как настроить CI/CD для монорепозитория?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["CI/CD", "Monorepo", "Tooling"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Monorepo CI/CD: affected packages only. Инструменты: Nx, Turborepo, Lerna. Кеширование: build once, reuse. Параллелизация: affected commands.

## Контекст

Продвинутый topic для крупных проектов. Проверяют понимание monorepo challenges.

## Как строить ответ

### Проблема

Monorepo: 100+ packages. CI для всех: медленно и дорого.

### Решение

Affected only: тестировать/билдить только изменённые packages. Кеширование: hash-based cache.

### Инструменты

Nx: affected commands, distributed caching. Turborepo: parallel execution, caching. Lerna: package management.

## Пример ответа

Nx: git affected → affected:build → только изменённые packages. Кеш: hash source files → reuse build artifacts. Результат: 100 packages, affected 3 → build 3 вместо 100.

## Частые ошибки

- Билдить всё в monorepo
- Не кешировать build artifacts
- Не использовать affected commands
- Игнорировать dependency graph

## Дополнительные вопросы

- Как работает Nx affected commands?
- Что такое build caching в Turborepo?
- Как связаны monorepo и micro-frontends?
