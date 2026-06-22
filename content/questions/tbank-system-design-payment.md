---
id: tbank-system-design-payment
title: "Спроектируйте систему уведомлений для платёжной платформы на миллионы пользователей"
category: System Design
scope: universal
languages: []
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["System Design", "Notifications", "Kafka", "Scale"]
duration: 60 мин
difficulty: 5
sourceType: aggregated
---

## Короткий ответ

Используйте Kafka для обработки событий (платежи, статусы), шину уведомлений с приоритезацией (critical > transactional > marketing), отдельные воркеры для каналов (push, SMS, email, in-app). Cassandra для хранения истории уведомлений, Redis для rate limiting и deduplication. Retry с exponential backoff, dead letter queue для неудачных, observability через метрики и tracing.

## Контекст

Проверяется понимание системного дизайна: масштабируемость, отказоустойчивость, очереди сообщений, паттерны обработки ошибок. Платёжная платформа — критичная система, уведомления должны доставляться надёжно и вовремя.

## Как строить ответ

### Определить требования и каналы

- **Каналы**: push-уведомления (APNs/FCM), SMS (Twilio/SMS.ru), email (SendGrid), in-app (WebSocket)
- **Приоритеты**: critical (мошенничество) > transactional (платеж) > informational (статус) > marketing
- **SLA**: 99.9% доставки для critical, 99% для transactional

### Выбрать архитектуру очередей

Kafka как шина событий: Producer (платёжный сервис) → Kafka Topics (partitioned по userId) → Consumer Groups (отдельные воркеры по каналам). Преимущества: replay, ordering guarantee, horizontal scaling.

### Спроектировать хранение

**Cassandra** для истории уведомлений (write-heavy, time-series доступ). **Redis** для rate limiting (TTL-based) и deduplication (setnx). **PostgreSQL** для user preferences (какие каналы активны, язык, часовой пояс).

### Реализовать reliability

- **Retry**: exponential backoff с jitter для transient failures
- **Dead Letter Queue**: для permanent failures (невалидный email, заблокированный номер)
- **Idempotency**: deduplication по eventId в Redis (TTL = 24h)
- **Circuit Breaker**: для внешних сервисов (SMS-провайдер down)

### Observability и мониторинг

Метрики: delivery rate, latency per channel, error rate, retry count. Tracing: Jaeger для end-to-end трассировки. Alerting: SLA breach, error rate > 1%, queue depth растёт.

## Код из интервью

```python
# Consumer воркер для push-уведомлений
class PushNotificationWorker:
    def __init__(self, kafka_consumer, push_service, redis_client):
        self.consumer = kafka_consumer
        self.push = push_service
        self.redis = redis_client

    async def process(self, message: NotificationEvent):
        # Deduplication
        if await self.redis.setnx(f"dedup:{message.event_id}", 1, ex=86400):
            return

        # Rate limiting
        key = f"rate:{message.user_id}"
        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 3600)
        if count > 100:
            return  # rate limited

        try:
            await self.push.send(
                user_id=message.user_id,
                title=message.title,
                body=message.body,
            )
        except TransientError as e:
            raise RetryableError(e)  # Kafka will retry
        except PermanentError as e:
            await self.send_to_dlq(message, e)
```

## Пример ответа

Для платёжной платформы на миллионы пользователей нужна распределённая система с гарантиями доставки.

**Топология**: Платёжный сервис → Kafka (topic: payment-events) → Router (определяет каналы по user prefs) → Channel Workers (push, SMS, email) → External Providers.

**Приоритезация**: Kafka с несколькими topics: `notifications-critical`, `notifications-transactional`, `notifications-marketing`. Consumer groups с разными concurrency: critical — 50 воркеров, marketing — 5.

**Хранение**: Cassandra для audit trail (12+ месяцев), Redis для dedup и rate limiting, PostgreSQL для user preferences.

**Reliability**: Каждое уведомление проходит circuit breaker → rate limiter → dedup → send. При ошибке — retry с exponential backoff (1s → 2s → 4s → 30s), после 5 попыток — DLQ. DLQ обрабатывается отдельным воркером с ручным review.

**Масштабирование**: Kafka partitions по userId для ordering. Автоскейлинг воркеров по queue depth. Cross-region replication для DR.

**Мониторинг**: Grafana дашборды с delivery rate, P99 latency, error breakdown по причинам. PagerDuty алерты на SLA breach.

## Частые ошибки

- Использовать синхронные вызовы вместо очередей — система не выдержит нагрузку.
- Не делать dedup — при retry пользователь получит дублирующие уведомления.
- Игнорировать rate limiting — внешние провайдеры заблокируют аккаунт.
- Хранить всё в PostgreSQL — не масштабируется под millions записей в день.

## Дополнительные вопросы

- Как обеспечить exactly-once семантику в Kafka?
- Как спроектировать откат уведомления (revoke)?
- Как обрабатывать доставку в разных часовых поясах?
