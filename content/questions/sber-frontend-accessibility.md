---
id: sber-frontend-accessibility
title: Как обеспечиваете accessibility в React-приложении?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Сбер"]
level: Senior
stage: Техническое
tags: ["React", "Accessibility", "A11y"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Semantic HTML, ARIA, keyboard navigation, screen readers. Важно: WCAG compliance, testing с screen readers.

## Контекст

Проверяют понимание accessibility.

## Как строить ответ

### Semantic HTML

Правильные теги: button, nav, main, article.

### ARIA

Labels, roles, live regions.

### Keyboard

Tab order, focus management, shortcuts.

### Testing

axe-core, screen readers.

## Пример ответа

Semantic: button вместо div, nav для навигации. ARIA: aria-label, aria-live. Keyboard: tab order, focus trap в модалках. Testing: axe-core, VoiceOver. Результат: WCAG 2.1 AA compliance.

## Частые ошибки

- Not using semantic HTML
- Missing ARIA labels
- Not keyboard accessible
- Not testing

## Дополнительные вопросы

- Кактестируете accessibility?
- Какhandling-аете focus в модалках?
- Каксоздаётеaccessible forms?
