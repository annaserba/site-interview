---
id: goznak-web-components-framework
title: Когда оправдан собственный frontend-фреймворк на Web Components?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Tech Lead"]
companies: ["Гознак"]
level: Senior
stage: Архитектура
tags: ["Web Components", "Framework", "Build vs buy"]
duration: 20 мин
difficulty: 5
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=467s"
---

## Короткий ответ

Свой framework оправдан только при устойчивых ограничениях, которые рынок не закрывает: многолетний lifecycle, встраивание без зависимости от host stack, стандартизированный runtime или узкая модель UI. Сравните total cost с React/Vue/Lit: команда core, документация, tooling, accessibility, security и миграции браузеров. Web Components дают инкапсуляцию и стандартный контракт, но не state management, routing, SSR и качественную архитектуру автоматически.

## Контекст

Гознак использует собственное решение поверх Web Components.

## Как строить ответ

### Доказать gap

Какие требования невозможно разумно закрыть готовым решением.

### Посчитать ownership

Core team, совместимость, DX, обучение и поддержка.

### Ограничить риск

Стандарты браузера, публичные API, benchmark и exit strategy.

## Частые ошибки

- Писать framework из-за недовольства API.
- Считать Shadow DOM полной изоляцией.
- Не планировать поддержку инструментов.

## Дополнительные вопросы

- Почему не Lit?
- Как тестировать совместимость компонентов?

