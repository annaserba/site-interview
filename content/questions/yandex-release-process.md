---
id: yandex-release-process
title: Как осуществляется релиз на прод в вашем проекте?
aliases: []
category: Delivery
scope: universal
languages: []
roles: ["Frontend","Backend","DevOps"]
companies: ["Яндекс"]
level: Middle
stage: Техническое
tags: ["Release", "Deployment", "CI/CD", "Process"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Типичный релиз: feature flags → staging → canary (1-5% трафика) → full rollout → мониторинг. Ключевые элементы: rollback strategy, smoke tests после деплоя, мониторинг (Grafana, Sentry). Частота: continuous deployment (каждый коммит) или scheduled releases (раз в неделю/спринт).

## Контекст

Интервьюер хочет понять ваш реальный опыт с релизами, а не теорию. Ожидается конкретика: какие инструменты, какая политика, как происходит rollback, кто принимает решение о деплое.

## Как строить ответ

### Этапы релиза

Feature flags: новый функционал скрыт за флагом, включается постепенно. Staging: тестовое окружение, идентичное проду. Canary: деплой на 1-5% трафика для валидации. Full rollout: постепенное раскатывание на 100%. Smoke tests: проверка критических сценариев после деплоя.

### Rollback strategy

Instant rollback: откат на предыдущий коммит за минуты (blue-green, feature flags). Database migrations: как откатывать без потери данных (backward-compatible migrations). Alerting: алерты при аномалиях (рост ошибок, latency) → автоматический rollback. Runbook: документированные шаги для ручного отката.

### Инструменты и мониторинг

Grafana/Datadog: метрики (CPU, latency, error rate). Sentry: отслеживание ошибок в реальном времени. Feature flags: LaunchDarkly, Unleash, внутренние решения. Deploy dashboards: визуализация статуса деплоя, история релизов.

### Кто деплоит

Developer self-service: разработчик деплоит свой код (continuous deployment). DevOps/SRE: централизованный деплой (scheduled releases). Hybrid: разработчик триггерит деплой, CI/CD выполняет автоматически. Approval gates: code review → CI → staging → manual approval → prod.

## Код из интервью

```yaml
# Пример GitHub Actions workflow для деплоя
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to staging
        run: ./deploy.sh staging
      - name: Smoke tests
        run: npm run test:e2e -- --env=staging
      - name: Deploy to canary (5% traffic)
        run: ./deploy.sh canary
      - name: Monitor error rate (10 min)
        run: ./monitor-errors.sh --threshold=0.5% --duration=10m
      - name: Deploy to production
        run: ./deploy.sh production
        if: success()
```

## Пример ответа

В моём проекте релиз происходит так:

**Подготовка:** Разработчик мержит PR в main. CI запускает линт, тесты, билд. Если всё зелёное — артефакт готов к деплою.

**Staging:** Автоматический деплой на staging-окружение. Smoke tests проверяют критические сценарии (регистрация, оплата, основные API). Если тесты падают — деплой останавливается.

**Canary:** Деплой на 1-5% трафика. Мониторим error rate, latency, бизнес-метрики 10-30 минут. Если аномалии — автоматический rollback. Если всё ок — продолжаем.

**Full rollout:** Постепенное раскатывание на 100%. Feature flags позволяют включать новый функционал постепенно (1% → 10% → 50% → 100%).

**Rollback:** При проблемах — instant rollback через feature flags (выключаем флаг) или откат на предыдущий коммит. Database migrations делаются backward-compatible, чтобы откат не ломал данные.

**Мониторинг:** Grafana показывает метрики, Sentry ловит ошибки. Алерты при росте error rate > 0.5% или latency > 2x. Runbook с документированными шагами отката.

## Частые ошибки

- Деплой без staging или smoke tests — «на проде всё работает» заканчивается инцидентом.
- Нет rollback strategy — когда что-то ломается, все паникуют.
- Деплой в пятницу вечером — никто не дежурит для отката.
- Не мониторить после деплоя — ошибки копятся, пока пользователи не начнут жаловаться.

## Дополнительные вопросы

- Как вы обрабатываете database migrations при релизе?
- В чём разница между blue-green и canary deployment?
- Как настроить автоматический rollback при аномалиях?
- Как feature flags влияют на архитектуру приложения?
