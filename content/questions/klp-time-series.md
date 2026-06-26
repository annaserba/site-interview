---
id: klp-time-series
title: Как проектировать time series database?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Time Series", "Database Design"]
duration: 10 мин
difficulty: 4
secondaryCategory: Data Engineering
---

## Короткий ответ

Time series database — специализированная БД для данных, привязанных ко времени. Ключевые оптимизации: column storage, compression, retention policies, continuous queries. Примеры: InfluxDB, TimescaleDB, Prometheus.

## Контекст

Важный topic для monitoring, IoT, analytics. Проверяют понимание специализированных database designs.

## Как строить ответ

### Паттерны данных

Append-only, time-ordered, rarely updated. Данные стареют и могут агрегироваться.

### Оптимизации

Column storage: сжатие по. Time-based partitioning: partitions по дням/месяцам. Downsampling: reduce granularity для старых данных.

### Примеры

InfluxDB: measurement, tag keys, field keys. TimescaleDB: PostgreSQL extension, hypertables.

## Пример ответа

InfluxDB: данные — measurement "cpu", tags: host=server1, fields: usage=0.45. Compression: delta-of-delta для time, Gorilla для values. Retention: автоматическое удаление старых данных. Continuous queries: агрегация по часам. TimescaleDB: hypertable автоматически partitioned по time. Преимущество: SQL + time series optimizations.

## Частые ошибки

- Использовать общую БД для time series
- Не планировать retention policy
- Игнорировать compression
- Не оптимизировать для read patterns

## Дополнительные вопросы

- Как работает compression в time series DB?
- Что такое continuous queries?
- Как выбрать между InfluxDB и TimescaleDB?
