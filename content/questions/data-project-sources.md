---
id: data-project-sources
title: Откуда поступали данные на прошлом проекте?
category: Data Engineering
scope: multi-language
languages: ["SQL", "Python"]
roles: ["Data Science","Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Знакомство
tags: ["Data sources", "Lineage", "Data quality"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Опишите lineage: production DB, event stream, SDK, CRM, внешние API и файлы; как данные попадали в raw layer, нормализовались и становились витринами. Для каждого критичного источника назовите grain, ключи, задержку, владельца, delivery guarantee и quality checks. Отдельно отметьте late events, schema evolution, deduplication и расхождение operational и analytical truth.

## Контекст

Проверяется понимание происхождения данных и доверия к метрике.

## Как строить ответ

### Нарисовать поток

Источник → ingestion → raw → transformations → mart → dashboard или model.

### Назвать контракты

Schema, freshness, ownership, ключи и правила повторной доставки.

### Показать контроль

Как обнаруживали пропуски, дубли, late data и breaking schema changes.


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

На прошлом проекте данные поступали из трёх источников: 1) PostgreSQL — основная база данных с транзакциями; 2) Kafka — потоковые события от фронтенда; 3) S3 — выгрузки из внешних API (платёжные данные от банка). Для интеграции использовали Airflow: из PostgreSQL — через PostgresHook, из Kafka — через consumer, из S3 — через S3KeySensor с поллингом каждые 5 минут. Основные проблемы: нерегулярные выгрузки из S3 и смена схемы в Kafka. Решение — валидация схемы через Schema Registry и retry-логика с exponential backoff.

## Частые ошибки

- Отвечать только названием DWH.
- Не знать grain ключевой таблицы.
- Считать события и транзакционную БД одинаковой истиной.

## Дополнительные вопросы

- Как обрабатывали late events?
- Где хранили raw data?
- Кто отвечал за data contract?
