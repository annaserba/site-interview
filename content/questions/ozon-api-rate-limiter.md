---
id: ozon-api-rate-limiter
title: Как ограничить конкурентный доступ к внешнему API без потери запросов?
category: Concurrency
scope: multi-language
languages: ["Go", "Java", "C#", "Python", "Node.js"]
roles: ["Backend"]
companies: ["Ozon"]
level: Senior
stage: Live coding
tags: ["Golang", "Rate limiter", "Channels"]
duration: 35 мин
difficulty: 3
sourceCompany: Ozon
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Разделите три механизма: rate limit ограничивает частоту, semaphore — число одновременных запросов, bounded queue — объём ожидающей работы. Для burst-нагрузки используйте token bucket, задайте лимиты по клиенту и общий лимит зависимости. В одном процессе достаточно монотонных часов и синхронизированного состояния; в кластере примените gateway или атомарный алгоритм в Redis. При заполнении очереди включайте admission control, возвращайте Retry-After и не допускайте бесконечного ожидания.

## Контекст

Нужно соблюдать квоту внешнего API при всплесках, нескольких инстансах и повторных попытках. Решение должно ограничивать память, обеспечивать справедливость и предсказуемо деградировать при недоступности зависимости.

## Как строить ответ

### Формализовать политику

Уточните единицу квоты, окно, допустимый burst, ключ лимита, приоритеты, максимальное ожидание и требования к справедливости. Отдельно выясните, учитываются ли неуспешные запросы и retries.

### Разделить частоту, конкурентность и очередь

Token bucket выдаёт право отправки, semaphore защищает connection pool и зависимость, bounded queue создаёт backpressure. Эти ограничения независимы; один канал в Go не заменяет все три.

### Выбрать область координации

Локальный лимитер быстрее, но каждый инстанс умножает общую квоту. Для строгого кластерного лимита используйте централизованный gateway либо Redis с Lua-скриптом и серверным временем. Обсудите поведение при отказе координатора: fail-open или fail-closed зависит от цены превышения квоты.

### Обработать жизненный цикл запроса

Передавайте deadline через context, удаляйте отменённые элементы из очереди, применяйте exponential backoff с jitter и ограничивайте общий retry budget. При shutdown остановите приём, дренируйте очередь до deadline и завершите воркеры без утечек.

### Сделать систему наблюдаемой

Измеряйте admitted, rejected, queue depth, wait time, utilization токенов, latency и ошибки внешнего API. Алерты должны отличать нехватку локальной ёмкости от деградации зависимости.


## Код из интервью

```javascript
// Пример реализации
function solve(input) {
  const result = {};
  for (const item of input) {
    const key = item.type || "default";
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

const test = [{ type: "a" }, { type: "b" }, { type: "a" }];
console.log(solve(test)); // { a: 2, b: 1 }
```

## Пример ответа

Для ограничения конкурентного доступа к внешнему API без потери запросов использую token bucket алгоритм в Go:

```go
type RateLimiter struct {
    tokens chan struct{}
    ticker *time.Ticker
}

func NewRateLimiter(rate int, burst int) *RateLimiter {
    rl := &RateLimiter{
        tokens: make(chan struct{}, burst),
        ticker: time.NewTicker(time.Second / time.Duration(rate)),
    }
    go func() {
        for range rl.ticker.C {
            select {
            case rl.tokens <- struct{}{}:
            default:
            }
        }
    }()
    return rl
}

func (rl *RateLimiter) Wait(ctx context.Context) error {
    select {
    case <-rl.tokens:
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}
```

Каждый goroutine перед вызовом API вызывает rl.Wait(ctx). Если токенов нет, запрос ждёт (не отбрасывается). Буфер tokens = burst позволяет обрабатывать всплески. Альтернатива: golang.org/x/time/rate — стандартная библиотека.

## Частые ошибки

- Запускать goroutine на каждый запрос и фактически переносить очередь в память.
- Смешивать rate limit и ограничение конкурентности.
- Повторять запросы без jitter и усиливать перегрузку зависимости.
- Забывать, что сумма локальных лимитов растёт вместе с числом инстансов.
- Не определять поведение при отказе Redis или gateway.

## Дополнительные вопросы

- Чем token bucket отличается от leaky bucket?
- Как обеспечить справедливость между крупным и мелкими клиентами?
- Когда допустим fail-open при отказе распределённого лимитера?
- Как избежать retry storm после восстановления внешнего API?
