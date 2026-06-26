---
id: tbank-angular-change-detection
title: Как работает Change Detection в Angular и чем отличается от React?
category: Frontend Architecture
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Middle
stage: Техническое
tags: ["Angular", "Change Detection", "Zone.js", "Signals"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Angular использует Zone.js для перехвата async операций (setTimeout, HTTP, events) и автоматического запуска change detection. По умолчанию проверяется весь дерево компонентов. OnPush стратегия проверяет только компоненты с изменёнными @Input ссылками. Angular 16+ вводит signals — реактивные примитивы, которые обновляют DOM без zone.js. React использует виртуальный DOM и reconciliation — сравнивает деревья и применяет минимальные патчи.

## Контекст

Проверяется понимание механизмов обновления UI в двух основных фреймворках и trade-offs между ними.

## Как строить ответ

### Назвать механизм Angular

Zone.js — monkey-patching всех async API. После каждого macro/micro task запускается change detection. Это "pull-based" — Angular проверяет шаблоны.

### Показать OnPush

OnPush — оптимизация: проверка только при изменении @Input ссылок (referential equality), @Output событиях, async pipe или手动.markForCheck().

### Показать React модель

Virtual DOM — компоненты ререндерятся при setState/props, React сравнивает дерево и применяет минимальные изменения. "Push-based" — компонент сообщает об изменениях.

### Сравнить trade-offs

Angular: автоматическое, но дорогое (zone.js overhead). React: ручное управление, но предсказуемое. Signals в Angular — гибрид.


## Код из интервью

```typescript
// Angular: OnPush + ChangeDetectionStrategy
@Component({
  selector: "app-user",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ user.name }}</div>`,
})
export class UserComponent {
  @Input() user!: { name: string; age: number };
}

// React: автоматический ререндер при пропсах
function User({ user }: { user: { name: string; age: number } }) {
  return <div>{user.name}</div>;
}

// Angular Signals (16+)
@Component({
  selector: "app-counter",
  template: `<div>{{ count() }}</div>`,
})
export class CounterComponent {
  count = signal(0);
  increment() {
    this.count.update(n => n + 1); // Автоматический update
  }
}
```

## Пример ответа

Angular: Zone.js перехватывает setTimeout, addEventListener, HTTP. После callback — digest cycle. По умолчанию: проверяется весь компонент с root. OnPush: только при изменении Input по ссылке.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ count }}`
})
export class Counter {
  @Input() count!: number;
}
```

React: Virtual DOM. setState/rerender → compare → patch. Нет автоматического отслеживания — компонент ререндерится, если изменились props или state.

```javascript
function Counter({ count }) {
  return <div>{count}</div>;
}
```

Angular 16+ signals: зональный подход, но без zone.js overhead.

## Частые ошибки

- Думать, что Angular change detection проверяет только изменённые компоненты — по умолчанию проверяется всё дерево от корня.
- Забывать markForCheck() при OnPush — изменения в сервисах не обнаруживаются без него.
- Мутировать объекты вместо создания новых ссылок в OnPush — Angular не видит изменений.
- Путать Angular change detection с React reconciliation — разные модели (pull vs push).


## Дополнительные вопросы

- Как Zone.js влияет на производительность и зачем Angular moving away от него?
- Что такое markForCheck() и когда он нужен?
- Как работает detach() иreattach() в change detection?
- Как Angular signals сравниваются с React signals (TC39 proposal)?
