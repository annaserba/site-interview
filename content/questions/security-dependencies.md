---
id: security-dependencies
title: Как проверять зависимости на уязвимости?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "Frontend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Dependencies", "Supply Chain"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Проверка зависимостей: npm audit, Snyk, Dependabot, OWASP Dependency-Check. Автоматическое обновление: Dependabot PRs, Renovate. Мониторинг: CVE databases, security advisories.

## Контекст

Supply chain security. Проверяют понимание dependency management.

## Как строить ответ

### Инструменты

npm audit: built-in. Snyk: comprehensive scanning. Dependabot: auto PRs. Renovate: auto updates.

### Процесс

npm audit → fix vulnerabilities → update dependencies → test → deploy.

### Практики

Lock файлы: package-lock.json. Pin versions. Regular updates. CI/CD integration.

## Пример ответа

`npm audit` → 2 vulnerabilities found. Fix: `npm audit fix`. Snyk: integrates в CI, blocks PR с vulnerabilities. Dependabot: автоматические PRs для updates. Lock file: guarantees consistent installs.

## Частые ошибки

- Игнорировать npm audit
- Не обновлять зависимости
- Использовать `latest` без проверки
- Не мониторить CVE

## Дополнительные вопросы

- Как настроить Dependabot?
- Что такое Snyk и как он работает?
- Как связана supply chain security и SBOM?
