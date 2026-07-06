---
id: yandex-cicd-setup
title: Как вы настраивали CI/CD в своих проектах?
aliases: []
category: Delivery
scope: universal
languages: []
roles: ["Frontend","Backend","DevOps"]
companies: ["Яндекс"]
level: Middle
stage: Техническое
tags: ["CI/CD", "GitHub Actions", "Jenkins", "Automation"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
sourceVideos: [{"company":"Avito","url":"https://www.youtube.com/watch?v=R23FjSp8Z-A","title":"Что такое релизы? Feature Flags, Canary и Rollback"}]
---

## Короткий ответ

Пайплайн: lint → test → build → deploy. Инструменты: GitHub Actions, GitLab CI, Jenkins, TeamCity. Ключевые практики: кэширование зависимостей, артефакты сборки, секреты в CI, environments (dev/staging/prod), auto-deploy vs manual trigger, rollback в CI/CD.

## Контекст

Интервьюер хочет понять ваш практический опыт настройки CI/CD, а не теорию. Ожидается конкретика: какой инструмент, как организован пайплайн, как хранятся секреты, как работает деплой.

## Как строить ответ

### Структура пайплайна

Lint: проверка стиля кода (ESLint, Prettier, Golint). Test: unit-тесты, интеграционные, e2e. Build: компиляция, бандлинг, оптимизация. Deploy: автоматический (auto-deploy) или ручной триггер (manual gate). Post-deploy: smoke tests, мониторинг, алерты.

### Инструменты

GitHub Actions: YAML-конфигурация, интеграция с GitHub, marketplace с действиями. GitLab CI: `.gitlab-ci.yml`, встроенные registry и runners. Jenkins: гибкий, но требует обслуживания, Groovy-скрипты. TeamCity: JetBrains, хорош для JVM-проектов. Выбор зависит от экосистемы и требований.

### Кэширование и артефакты

Кэширование зависимостей: `node_modules`, pip cache, Gradle cache — ускоряет пайплайн в 2-5 раз. Артефакты сборки: Docker-образы, zip-архивы, статика — хранятся в registry (Docker Hub, Nexus). Кэширование слоёв Docker: ускоряет сборку образов.

### Секреты и безопасность

GitHub Secrets, GitLab Variables: шифрованные переменные окружения. OIDC для cloud: временные.credentials без хранения ключей. Masking: скрытие секретов в логах. Rotation: регулярная смена ключей. Environment protection rules: approval для prod-деплоя.

### Environments и деплой

Dev: автоматический деплой при мерже в main. Staging: автоматический или ручной триггер. Prod: manual approval + automatic rollback при ошибках. Feature flags: отдельный механизм контроля функционала.

## Код из интервью

```yaml
# GitHub Actions: полный пайплайн
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - uses: actions/download-artifact@v3
      - run: ./deploy.sh staging
      - run: npm run test:e2e -- --env=staging

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/download-artifact@v3
      - run: ./deploy.sh production
```

## Пример ответа

В моём проекте CI/CD настроен так:

**Пайплайн:** При мерже PR запускаются: lint (ESLint + Prettier), unit-тесты (Jest), build (webpack/vite). Если всё зелёное — артефакт готов. При мерже в main — автоматический деплой на staging, затем manual approval для prod.

**Кэширование:** `node_modules` кэшируется через `actions/cache` — экономит 2-3 минуты на каждом шаге. Docker-образы кэшируют слои: сначала копируем `package.json`, потом `npm ci`, потом остальное — пересобираются только изменившиеся слои.

**Секреты:** GitHub Secrets для ключей API и токенов. OIDC для AWS/GCP — временные credentials без хранения. В логах секреты маскируются автоматически.

**Деплой:** Auto-deploy на dev при мерже в develop. Staging — автоматически при мерже в main. Production — manual approval в GitHub Environment. Rollback: откат на предыдущий Docker-образ через `kubectl rollout undo` или  -deploy предыдущего артефакта.

**Мониторинг:** После деплоя — smoke tests. Sentry ловит ошибки. Grafana показывает метрики. Алерт при error rate > 0.5% → автоматический rollback через CI/CD.

## Частые ошибки

- Не кэшировать зависимости — каждый запуск пайплайна устанавливает npm заново.
- Хранить секреты в коде или Dockerfile — утечка credentials.
- Нет environments — dev и prod смешаны, деплой на prod происходит случайно.
- Manual gate без альтернативы — разработники обходят пайплайн, деплоят напрямую.

## Дополнительные вопросы

- Как вы организовали кэширование Docker-образов в CI/CD?
- В чём разница между auto-deploy и manual trigger?
- Как настроить rollback через CI/CD при ошибках на проде?
- Как хранить и вращать секреты в CI/CD?
