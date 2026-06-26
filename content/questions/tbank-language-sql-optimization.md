---
id: tbank-language-sql-optimization
title: Как оптимизировать медленный SQL-запрос?
category: Algorithms
scope: language-specific
languages: ["SQL"]
roles: ["Backend-разработчик", "Data Engineer"]
companies: ["Т-Банк"]
level: Middle
stage: Язык
tags: ["SQL", "Performance", "Database", "Index"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

EXPLAIN ANALYZE → найти sequential scan → добавить индекс → переписать запрос (avoid N+1, use JOIN instead of subquery). Проверить plan: index scan, hash join, cost. Убрать SELECT * → выбирать нужные колонки. PARTITION для больших таблиц.

## Контекст

Языковой/инженерный вопрос: понимает ли кандидат работу СУБД и оптимизацию.

## Как строить ответ

### EXPLAIN ANALYZE

Первый шаг: посмотреть execution plan.

### Индексы

B-tree для equality/range, GIN для full-text, Partial для filtered queries.

### Переписывание

Subquery → JOIN, SELECT * → конкретные колонки, UNION → UNION ALL.

## Код из интервью

```sql
-- Медленный запрос
SELECT * FROM orders
WHERE user_id IN (SELECT id FROM users WHERE status = 'active')
AND created_at > NOW() - INTERVAL '30 days';

-- Оптимизированный
SELECT o.id, o.total, o.created_at
FROM orders o
INNER JOIN users u ON u.id = o.user_id
WHERE u.status = 'active'
AND o.created_at > NOW() - INTERVAL '30 days';

-- Индекс
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at)
WHERE created_at > NOW() - INTERVAL '90 days';
```

## Пример ответа

Начинаю с EXPLAIN ANALYZE: смотрю cost, rows, actual time. Часто проблема в sequential scan — добавляю индекс. Если subquery — переписываю на JOIN. SELECT * заменяю на конкретные колонки. Для больших таблиц — partitioning. Для частых фильтров — partial index.

## Частые ошибки

- Не использовать EXPLAIN ANALYZE
- Добавлять индексы без анализа
- SELECT * в production
- Не анализировать cardinality

## Дополнительные вопросы

- Что такое covering index?
- Как работает B-tree индекс?
- Чем отличается LIMIT от EXISTS?
