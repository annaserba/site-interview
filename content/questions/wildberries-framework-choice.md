---
id: wildberries-framework-choice
title: Как выбрать frontend-фреймворк для нового долгоживущего проекта?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Leadership"]
companies: ["Wildberries"]
level: Senior
stage: Архитектура
tags: ["React", "Vue", "Angular", "Svelte"]
duration: 20 мин
difficulty: 5
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=1705s"
sourceVideos: [{"company":"Wildberries","url":"https://www.youtube.com/watch?v=HF7zkpSrByE&t=1705s"},{"company":"Гознак","url":"https://www.youtube.com/watch?v=Egvch4SA998&t=158s"}]
---

## Короткий ответ

Фреймворк выбирают по ограничениям продукта и организации: SSR/SEO, interactivity, bundle и runtime budget, размер и опыт команды, hiring, accessibility, design system, release horizon, ecosystem maturity и ownership. Проведите time-boxed spike на критическом сценарии и ADR с матрицей критериев. Производительность сравнивайте на собственном workload, а архитектурную свободу оценивайте вместе со стоимостью стандартов и governance.

## Контекст

Интервьюер проверяет способность принять долгосрочное техническое решение без холивара.

## Как строить ответ

### Зафиксировать требования

Тип rendering, устройства, latency budget, offline, интеграции, lifespan и организационные границы.

### Оценить total cost

Не только benchmark: обучение, миграции, библиотеки, security updates, observability и найм.

### Снизить необратимость

Изолируйте domain logic, API contracts и design tokens; зафиксируйте decision triggers для пересмотра.


## Код из интервью

```yaml
# Архитектурная конфигурация

# Docker Compose — базовая структура
version: "3.8"
services:
  api:
    build: ./api
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on: [db, redis]
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [api]
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```

## Пример ответа

Для нового долгоживущего проекта я бы выбирал между React, Vue и Svelte. Критерии: 1) Ecoystem — React самый большой (npm packages, решения); 2) Learning curve — Vue проще для junior'ов; 3) Performance — Svelte самый быстрый (no VDOM overhead); 4) SSR — Next.js (React) лучше всех; 5) Community — React наиболее популярен. Мой выбор: React + TypeScript + Next.js. Почему: 1) Largest talent pool — проще нанимать; 2) Best SSR/SSG; 3) Rich ecosystem (state management, forms, testing); 4) Long-term support от Meta. Для внутренних инструментов — Svelte (проще, быстрее). Angular — только если enterprise + long-term support от Google.

## Частые ошибки

- Выбирать по личному вкусу или GitHub stars.
- Сравнивать synthetic benchmark вместо продукта.
- Обещать переписать систему при первой проблеме.

## Дополнительные вопросы

- Когда React хуже Angular для организации?
- Как измерить стоимость свободы архитектуры?
- Как провести честный framework spike?
