---
id: wildberries-script-loading
title: Чем отличаются обычный script, async, defer и module?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript", "HTML"]
roles: ["Frontend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Scripts", "Async", "Defer"]
duration: 12 мин
difficulty: 4
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=735s"
---

## Короткий ответ

Обычный external script блокирует parser на загрузку и выполнение. `async` загружается параллельно и выполняется сразу по готовности, не сохраняя document order — подходит независимым скриптам. `defer` загружается параллельно, выполняется после парсинга в порядке документа и до `DOMContentLoaded`. ES modules deferred по умолчанию, поддерживают dependency graph и single evaluation; `async` у module меняет порядок выполнения.

## Контекст

Проверяется управление parser blocking, зависимостями и моментом готовности DOM.

## Как строить ответ

### Сравнить download и execute

Параллельная загрузка не означает одинаковый момент выполнения.

### Объяснить порядок

Deferred scripts сохраняют порядок, async — нет; `DOMContentLoaded` ждёт defer и modules.

### Выбрать стратегию

Analytics без зависимостей — async, application bundle — module или defer, critical inline — только с CSP nonce/hash.


## Код из интервью

```typescript
// Пример использования
const example = () => {
  const state = { loading: false, data: null, error: null };

  return {
    async fetch(url) {
      state.loading = true;
      try {
        const res = await fetch(url);
        state.data = await res.json();
      } catch (err) {
        state.error = err.message;
      } finally {
        state.loading = false;
      }
      return state;
    },
  };
};
```

## Пример ответа

Обычный script — блокирует HTML парсинг до загрузки и выполнения. async — загружает параллельно, выполняется сразу после загрузки (блокирует HTML). defer — загружает параллельно, выполняется после парсинга HTML (в порядке объявления). module — как defer, но в strict mode, с own scope. Пример:

```html
<script src="app.js"></script>        <!-- блокирует -->
<script src="analytics.js" async></script>  <!-- не блокирует, порядок не гарантирован -->
<script src="app.js" defer></script>  <!-- не блокирует, порядок гарантирован -->
<script type="module" src="app.mjs"></script> <!-- как defer -->
```

На практике: third-party скрипты (analytics, chat) — async. Critical scripts — defer. Module scripts — для modern browsers с ES modules. Никогда не использую обычный script для критичного кода.

## Частые ошибки

- Говорить, что defer выполняется после `DOMContentLoaded`.
- Ожидать document order от async.
- Забывать о dependency graph modules.

## Дополнительные вопросы

- Когда срабатывает `DOMContentLoaded`?
- Чем preload отличается от modulepreload?
- Как CSP влияет на inline scripts?
