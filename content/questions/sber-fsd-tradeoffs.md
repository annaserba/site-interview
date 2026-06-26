---
id: sber-fsd-tradeoffs
title: Какие проблемы и ограничения есть у Feature-Sliced Design?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Leadership"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["FSD", "Architecture", "Modularity"]
duration: 15 мин
difficulty: 4
sourceCompany: Сбер
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=C0xSErqNYeU&t=4000s"
---

## Короткий ответ

FSD полезен как соглашение о слоях и публичных API, но не решает доменное моделирование автоматически. Частые проблемы: механическая раскладка файлов, спорная гранулярность features/entities, cross-imports, дублирование shared-кода и дорогая миграция существующего продукта. Для небольшой команды схема может стоить дороже пользы. Используйте её как адаптируемые правила, проверяйте dependency linting и пересматривайте границы по изменениям продукта.

## Контекст

Проверяется способность обсуждать архитектуру без догматизма.

## Как строить ответ

### Назвать цель

Какие зависимости и зоны ответственности должны стать понятнее.

### Обсудить цену

Обучение, boilerplate, миграция и поддержка границ.

### Задать критерии

Когда вводить, упрощать или отказываться от FSD.


## Код из интервью

```yaml
# Feature-Sliced Design — структура

src/
  app/          # Инициализация, провайдеры
    routes/
    styles/
  pages/        # Маршруты (составные виджетов)
    Home/
  widgets/      # Составные блоки (Header, Sidebar)
  features/     # Пользовательские действия
    Auth/
      ui/
      model/
      api/
  entities/     # Бизнес-сущности (User, Product)
  shared/       # Переиспользование (UI-kit, API, utils)

# Правило импортов: только снизу вверх
# features → entities → shared (никогда обратно)
```

## Пример ответа

Feature-Sliced Design (FSD) — архитектурная методология с уровнями: app → pages → widgets → features → entities → shared. Преимущества: 1) Чёткая зона ответственности; 2) Импорт только снизу вверх; 3) Автоматический bound check. Проблемы: 1) Over-engineering для простых проектов; 2) Сложность рефакторинга; 3) Нет official tooling. Пример: на прошлом проекте FSD сократил time-to-market для новых feature, но усложнил shared UI kit (нужен был публичный API через index.ts). На практике: FSD хорош для продуктов с 5+ разработчиками, для маленьких команд — проще feature folder approach.

## Частые ошибки

- Называть FSD универсальной архитектурой.
- Делить код по шаблону без доменных границ.
- Прятать циклические зависимости через shared.

## Дополнительные вопросы

- Чем feature отличается от entity?
- Как мигрировать постепенно?

