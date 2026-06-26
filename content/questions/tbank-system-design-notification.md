---
id: tbank-system-design-notification
title: Спроектируйте систему уведомлений для банка на миллионы пользователей
category: System Design
scope: system-design
languages: ["Java", "Kotlin", "Python"]
roles: ["Backend","Leadership"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["System Design", "Notifications", "Kafka", "Distributed", "Reliability", "Scale"]
duration: 30 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Event-driven архитектура: Kafka как шина событий → Router (определяет каналы по user prefs) → Channel Workers (push, SMS, email, in-app). Приоритезация: critical (мошенничество) > transactional (платеж) > informational > marketing. Outbox pattern + retry с exponential backoff + dead letter queue. Хранение: Cassandra (audit trail), Redis (rate limiting, dedup), PostgreSQL (user prefs).

## Контекст

Системный дизайн для финтех-продукта: надёжность, масштабируемость, приоритизация. Платёжная платформа — критичная система.

## Как строить ответ

### Определить каналы и SLA

Push (APNs/FCM), SMS, email, in-app WebSocket. SLA: 99.9% для critical, 99% для transactional.

### Архитектура очередей

Kafka topics partitioned по userId. Consumer groups: critical — 50 воркеров, marketing — 5.

### Хранение

Cassandra для истории (write-heavy), Redis для dedup/rate limit, PostgreSQL для preferences.

### Reliability

Retry → Dead Letter Queue → ручной review. Circuit breaker для внешних провайдеров.

## Код из интервью

```java
// Outbox pattern — гарантия доставки
@Entity
class OutboxEvent {
    String eventType;
    String payload;
    String status; // PENDING, SENT, FAILED
    int retryCount;
}

@Scheduled(fixedDelay = 1000)
public void retryPending() {
    List<OutboxEvent> pending = outboxRepo.findByStatus("PENDING");
    for (OutboxEvent event : pending) {
        try {
            sendNotification(event);
            event.setStatus("SENT");
        } catch (Exception e) {
            event.setRetryCount(event.getRetryCount() + 1);
            if (event.getRetryCount() > MAX_RETRIES) {
                event.setStatus("FAILED");
            }
        }
        outboxRepo.save(event);
    }
}
```

```python
# Consumer для push-уведомлений
class PushWorker:
    async def process(self, msg: NotificationEvent):
        # Dedup
        if await self.redis.setnx(f"dedup:{msg.event_id}", 1, ex=86400):
            return
        # Rate limit
        key = f"rate:{msg.user_id}"
        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 3600)
        if count > 100:
            return
        try:
            await self.push.send(user_id=msg.user_id, title=msg.title, body=msg.body)
        except TransientError:
            raise RetryableError()
        except PermanentError as e:
            await self.send_to_dlq(msg, e)
```

## Пример ответа

Event-driven: событие (платеж, OTP) попадает в Kafka. Router определяет каналы по user preferences. Channel Workers отправляют через внешние провайдеры. Critical уведомления — отдельная очередь с гарантированной доставкой. Outbox patternExactly-Once. Retry с backoff до 5 попыток, затем dead letter queue. Идемпотентность через message ID. Масштабирование: Kafka partitions по userId, автоскейлинг воркеров по queue depth. Мониторинг: delivery rate, P99 latency, error breakdown.

## Частые ошибки

- Синхронная отправка (блокирует источник)
- Без retry — потеря уведомлений
- Без dedup — дубли при retry
- Без rate limiting — провайдеры заблокируют
- Без мониторинга — незаметные сбои

## Дополнительные вопросы

- Как обеспечить exactly-once семантику?
- Как обрабатываете отказ канала (SMS недоступен)?
- Как масштабируете при 10M уведомлений в день?
- Как спроектировать откат уведомления (revoke)?
