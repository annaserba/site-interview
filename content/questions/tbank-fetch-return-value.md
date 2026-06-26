---
id: tbank-fetch-return-value
title: Какой тип возвращает fetch и когда он отклоняет Promise?
category: Web Platform
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Fetch", "Promise", "HTTP"]
duration: 8 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

`fetch` сразу возвращает `Promise<Response>`. Promise отклоняется при сетевой ошибке, отмене через `AbortSignal` или сбое политики браузера, но HTTP 404/500 считаются успешно полученным ответом — их нужно проверять через `response.ok` или `status`. Тело читается отдельно и один раз: `json()`, `text()` и другие методы тоже асинхронны. В production добавьте timeout через abort, типизацию декодированного payload, проверку схемы и различайте retryable transport errors от бизнес-ошибок.

## Контекст

Проверяется понимание границы между транспортом, HTTP и данными ответа.

## Как строить ответ

### Назвать контракт

`Promise<Response>`, а не готовый JSON.

### Разделить ошибки

Network rejection, HTTP status и ошибка декодирования — разные ветки.

### Показать production-подход

Abort, schema validation, controlled retries и observability.


## Код из интервью

```typescript
// Promise.allSettled — все результаты
const urls = ["/api/users", "/api/posts", "/api/comments"];
const results = await Promise.allSettled(
  urls.map(url => fetch(url).then(r => r.json()))
);

results.forEach((result, i) => {
  if (result.status === "fulfilled") {
    console.log("URL " + i + ": OK", result.value);
  } else {
    console.error("URL " + i + ": FAILED", result.reason);
  }
});
```

## Пример ответа

fetch() возвращает Promise<Response>. Response содержит: status, ok (boolean), headers, body. Важно: fetch отклоняет Promise только при network errors. HTTP errors (404, 500) — это НЕ rejection, а успешный response с response.ok = false. Пример:

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

AbortController для отмены:

```javascript
const controller = new AbortController();
fetch('/api', { signal: controller.signal });
controller.abort();
```

На практике: всегда проверяю response.ok, использую AbortController для cleanup в React useEffect.

## Частые ошибки

- Ожидать rejection на 404 или 500.
- Вызывать чтение body несколько раз.
- Ретраить все запросы без учёта идемпотентности.

## Дополнительные вопросы

- Как отменить fetch при размонтировании компонента?
- Чем streaming response отличается от `response.json()`?

