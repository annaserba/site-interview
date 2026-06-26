---
id: tbank-etl-degradation
title: Найдите причину деградации ETL-пайплайна после роста данных в 10 раз
category: Data Engineering
scope: multi-language
languages: ["Python", "Java", "Scala", "SQL"]
roles: ["Data Engineer", "Backend-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["SQL", "Kafka", "Data pipelines"]
duration: 40 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Сначала восстановите профиль потока до и после роста: records/s и bytes/s на каждом этапе, service time, queue time, lag, p95/p99, CPU, GC, сеть и storage IOPS. Bottleneck находится там, где растёт очередь. Затем проверьте skew партиций, планы запросов, spill на диск, compaction, batch size и downstream throttling. Исправление выбирайте по измеренному ограничению, сохраняя идемпотентность, replay и контроль качества данных.

## Контекст

После роста объёма в десять раз пайплайн нарушает SLA, но средняя загрузка части компонентов остаётся нормальной. Нужно найти ограничивающий ресурс, отделить throughput-проблему от skew и доказать эффект изменения без риска потери или дублирования данных.

## Как строить ответ

### Зафиксировать SLO и форму деградации

Уточните SLA по свежести и полноте, размер backlog, момент начала деградации и последние изменения. Сравните throughput входа и выхода, end-to-end age события и p99 по этапам, а не только средние значения.

### Локализовать очередь и ресурс

Протяните correlation id или batch id через pipeline. Растущая очередь перед этапом указывает на bottleneck; затем разделите CPU, GC, сеть, I/O, locks и ожидание downstream. Низкий средний CPU не исключает одну горячую партицию.

### Проверить данные и алгоритмы

Ищите skew ключей, small files, неудачный partition pruning, изменение плана SQL, O(n²) преобразование, сериализацию и spill. Сравните распределение размеров сообщений и cardinality ключей до и после роста.

### Масштабировать безопасно

Увеличение consumers помогает только при достаточном числе партиций и ёмкости sink. Изменение partition key требует плана миграции. Настройте batch и concurrency нагрузочным тестом, добавьте backpressure и защитите downstream от thundering herd.

### Сохранить корректность и управляемость

Определите idempotency key, checkpoint, правила replay, DLQ и сверку количества или контрольных сумм. Выпускайте изменение canary-режимом, сравнивайте старый и новый результаты и держите план отката без повторной обработки побочных эффектов.


## Код из интервью

```sql
-- Monitor pipeline throughput at each stage
SELECT
  stage,
  COUNT(*) AS records_processed,
  AVG(duration_ms) AS avg_duration,
  MAX(queue_size) AS max_queue_depth
FROM pipeline_metrics
WHERE run_date = CURRENT_DATE
GROUP BY stage;

-- Find slow queries after 10x data growth
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Partitioning strategy for large tables
CREATE TABLE events (
  id BIGSERIAL,
  event_time TIMESTAMPTZ NOT NULL,
  payload JSONB
) PARTITION BY RANGE (event_time);

CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## Пример ответа

При росте данных в 10 раз ETL-пайплайн деградировал с 1 часа до 8 часов. Причины: 1) Один гигантский SQL без партиционирования; 2) Последовательная обработка; 3) Отсутствие индексов. Диагностика: EXPLAIN ANALYZE показал Seq Scan, pg_stat_statements — топ-1 slow queries. Решения: 1) Partitioning по дате; 2) Parallel processing — Airflow tasks с пулом воркеров; 3) Индексы на foreign keys; 4) Materialized views для предагрегации. Результат: 8 часов → 45 минут. Также добавил monitoring: alert на duration > 1 hour, dashboard в Grafana.

## Частые ошибки

- Масштабировать consumers, когда ограничение находится в sink или числе партиций.
- Смотреть на средние метрики и пропустить одну горячую партицию.
- Увеличивать batch до роста throughput, не контролируя latency, память и replay cost.
- Менять partition key без миграции состояния и порядка событий.
- Восстанавливать SLA ценой дублей или незаметной потери данных.

## Дополнительные вопросы

- Как найти skew по ключам партиционирования?
- Как доказать, что bottleneck — sink, а не consumer?
- Как выполнить repartitioning без нарушения порядка событий?
- Как оценить время ликвидации backlog после исправления?
- Какие инварианты проверять при replay?
