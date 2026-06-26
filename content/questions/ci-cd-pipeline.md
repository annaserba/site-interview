---
id: ci-cd-pipeline
title: Как спроектировать CI/CD pipeline?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["CI/CD", "Pipeline", "Automation"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

CI/CD pipeline: Build → Test → Deploy. CI: сборка + тесты при каждом push. CD: автоматический deploy в staging/production. Инструменты: GitHub Actions, GitLab CI, Jenkins.

## Контекст

Ключевой automation concept. Проверяют понимание pipeline stages.

## Как строить ответ

### CI (Continuous Integration)

При каждом PR: install deps → lint → build → test → coverage report.

### CD (Continuous Delivery)

После merge: build → deploy to staging → smoke tests → manual approval → deploy to production.

### CD (Continuous Deployment)

Автоматический deploy без manual approval.

## Пример ответа

GitHub Actions: PR → install → lint → tsc → build → test → coverage > 80%. Merge to main → build → deploy to staging → smoke tests → manual approval → deploy to prod. Pipeline time: ~5 минут.

## Частые ошибки

- Делать pipeline слишком длинным
- Не кешировать dependencies
- Игнорировать flaky tests
- Не использовать artifacts между stages

## Дополнительные вопросы

- Как ускорить CI/CD pipeline?
- Что такое flaky tests и как с ними бороться?
- Как настроить rollback strategy?
