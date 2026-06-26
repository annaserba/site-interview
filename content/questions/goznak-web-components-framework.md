---
id: goznak-web-components-framework
title: Когда оправдан собственный frontend-фреймворк на Web Components?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Leadership"]
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


## Код из интервью

```yaml
// Web Components — нативные кастомные элементы
class MyCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>:host { display: block; padding: 16px; }</style>
      <h3><slot name="title"></slot></h3>
      <slot></slot>
    `;
  }
}
customElements.define("my-card", MyCard);
```

## Пример ответа

Собственный фреймворк на Web Components оправдан, когда: 1) Нужна максимальная совместимость — работают в любом фреймворке; 2) Внутренний UI kit для нескольких продуктов на разных стеках; 3) Контроль над runtime — без virtual DOM overhead, минимальный bundle. Реализация: customElements.define, Shadow DOM для изоляции стилей, <template> для шаблонов. Недостатки: нет реактивности (нужна своя или lit-html), SSR сложнее. На практике: lit (Google) — минималистичный фреймворк поверх Web Components. Использую для design system, а не для всего приложения.

## Частые ошибки

- Писать framework из-за недовольства API.
- Считать Shadow DOM полной изоляцией.
- Не планировать поддержку инструментов.

## Дополнительные вопросы

- Почему не Lit?
- Как тестировать совместимость компонентов?

