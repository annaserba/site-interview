---
id: security-secrets
title: Как хранить секреты в приложении?
category: Backend
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Secrets", "DevOps"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Секреты: пароли, API keys, tokens. Хранение: environment variables, vault (HashiCorp Vault), cloud secrets (AWS Secrets Manager). Никогда: в коде, в git, в логах.

## Контекст

Критически важный security practice. Проверяют понимание secrets management.

## Как строить ответ

### Правила

Never в коде. Never в git. Never в логах. Rotate regularly. Use最小权限 principle.

### Инструменты

Environment variables: simplest. HashiCorp Vault: central management. AWS Secrets Manager: cloud-native. Doppler, 1Password.

### Практики

.gitignore: .env files. CI/CD: secrets in pipeline. Docker: secrets, not env vars.

## Пример ответа

.env file: `DATABASE_URL=postgres://...`. Git: .env в .gitignore. Production: AWS Secrets Manager, rotate every 90 days. CI/CD: GitHub Actions secrets. Never: `const DB_PASS = "secret123"` в коде.

## Частые ошибки

- Хранить секреты в коде
- Коммитить .env файлы
- Не ротировать секреты
- Логировать секреты

## Дополнительные вопросы

- Как работает HashiCorp Vault?
- Как ротировать secrets без downtime?
- Как связаны secrets management и zero trust?
