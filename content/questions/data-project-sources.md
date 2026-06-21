---
id: data-project-sources
title: Откуда поступали данные на прошлом проекте?
category: Data Engineering
scope: multi-language
languages: ["SQL", "Python"]
roles: ["Data Analyst", "Data Engineer", "Product Analyst"]
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

## Частые ошибки

- Отвечать только названием DWH.
- Не знать grain ключевой таблицы.
- Считать события и транзакционную БД одинаковой истиной.

## Дополнительные вопросы

- Как обрабатывали late events?
- Где хранили raw data?
- Кто отвечал за data contract?
