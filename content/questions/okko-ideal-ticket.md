---
id: okko-ideal-ticket
title: Как выглядит качественно подготовленная задача для разработки?
category: Delivery
scope: universal
languages: []
roles: ["Frontend-разработчик", "Backend-разработчик", "Data Engineer", "Data Scientist", "QA", "DevOps", "Mobile-разработчик", "Tech Lead"]
companies: ["Okko"]
level: Senior
stage: Командное интервью
tags: ["Ticket", "Acceptance criteria", "Delivery"]
duration: 10 мин
difficulty: 3
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=WZ-mX-tttuo&t=2317s"
---

## Короткий ответ

Хорошая задача описывает проблему и результат, а не диктует код. Минимум: контекст и пользователь, текущее/ожидаемое поведение, критерии приёмки и примеры, ограничения, зависимости, аналитика и способ rollout. Детали реализации добавляют только если уже принято архитектурное решение. Объём документации должен соответствовать риску и обратимости задачи.

## Контекст

Проверяется зрелость подготовки и передачи работы между ролями.

## Как строить ответ

### Outcome

Зачем изменение нужно и как понять, что оно успешно.

### Contract

Acceptance criteria, edge cases и явно исключённый scope.

### Delivery

Зависимости, тестирование, наблюдаемость и rollout.


## Код из интервью

```markdown
## Модель ответа (STAR/SAR)

| Шаг | Что говорить | Пример |
|-----|-------------|--------|
| **Situation** | Контекст и ограничения | "Команда из 5, дедлайн 2 недели" |
| **Task** | Ваша зона ответственности | "Вести архитектуру нового модуля" |
| **Action** | Конкретные шаги | "Спроектировал event-driven подход" |
| **Result** | Измеримый эффект | "Запустили в срок, 0 инцидентов" |

> Совет: Говорите о своём вкладе, а не команды. Называйте метрики.
```

## Пример ответа

Качественный тикет должен содержать: 1) Context — зачем это нужно; 2) Acceptance criteria — конкретные пункты «что должно работать»; 3) Technical requirements — ограничения (performance, compatibility); 4) Estimation — оценка в story points; 5) Dependencies — что блокирует задачу. Пример:

```markdown
## Add search autocomplete

### Context
Users spend 30s on average finding products.

### Acceptance Criteria
- Show suggestions after 300ms debounce
- Highlight matching text
- Keyboard navigation (up/down/enter)

### Technical
- Use existing /api/search endpoint
- Bundle size < 5KB gzipped

### Dependencies
- Backend: /api/search must be ready by Sprint 12
```

На практике: я пишу RFC перед началом работы, это экономит время на clarification во время спринта.

## Частые ошибки

- Считать длинное описание автоматически качественным.
- Подменять проблему готовой реализацией.
- Не фиксировать исключения и зависимости.

## Дополнительные вопросы

- Когда достаточно одного абзаца?
- Кто отвечает за критерии приёмки?

