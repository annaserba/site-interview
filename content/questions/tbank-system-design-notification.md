---
id: tbank-system-design-notification
title: Спроектируйте систему уведомлений для банка
category: System Design
scope: system-design
languages: ["Java", "Kotlin"]
roles: ["Backend-разработчик", "Tech Lead"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["System Design", "Notifications", "Distributed", "Reliability"]
duration: 25 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Используйте event-driven архитектуру: источник событий → Kafka → Notification Service → каналы (push, SMS, email). Гарантия доставки через outbox pattern + retry с exponential backoff. Приоритизация: критические (OTP) → важные (платежи) → маркетинг. Идемпотентность через message ID.

## Контекст

Системный дизайн для финтех-продукта: надёжность, масштабируемость, приоритизация.

## Как строить ответ

### Архитектура

Event Source → Kafka → Notification Service → Multi-channel delivery.

### Гарантии

Outbox pattern, retry, idempotency, dead letter queue.

### Приоритизация

Критические уведомления — отдельная очередь с гарантированной доставкой.

## Код из интервью

```java
// Outbox pattern —保证Delivery
@Entity
class OutboxEvent {
    String eventType;
    String payload;
    String status; // PENDING, SENT, FAILED
    int retryCount;
}

// Retry с exponential backoff
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

## Пример ответа

Event-driven: событие (платеж, OTP) попадает в Kafka. Notification Service потребляет, определяет канал и приоритет. Critical (OTP) — отдельная очередь, гарантированная доставка. Outbox pattern保证Exactly-Once. Retry с backoff до 5 попыток, затем dead letter queue. Идемпотентность через message ID. Мониторинг: latency, delivery rate, error rate.

## Частые ошибки

- Синхронная отправка (блокирует источник)
- Без retry — потеря уведомлений
- Без приоритизации — OTP ждут вместе с маркетингом
- Без мониторинга — незаметные сбои

## Дополнительные вопросы

- Как обрабатываете отказ канала (SMS недоступен)?
- Как масштабируете при 10M уведомлений в день?
- Как тестируете system design?
