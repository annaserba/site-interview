---
id: data-funnel
title: Строили ли вы воронку?
category: Product Analytics
scope: multi-language
languages: ["SQL", "Python"]
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Funnel", "Product analytics", "SQL"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Сначала зафиксируйте entity и окно: пользователь, сессия или заказ; строгий ли порядок шагов, допускаются ли повторы и сколько времени даётся на конверсию. Стройте cohort funnel от общей точки входа, дедуплицируйте события и не смешивайте пользователей разных периодов наблюдения. Сегментируйте drop-off, но проверяйте статистическую устойчивость и качество instrumentation.

## Контекст

Нужно показать корректную семантику воронки, а не только `count(distinct user_id)`.

## Как строить ответ

### Определить шаги

Каждый шаг имеет событие, условия, порядок и максимальное время перехода.

### Выбрать знаменатель

Общая и step-to-step conversion отвечают на разные вопросы; фиксируйте cohort start.

### Диагностировать

Сравните сегменты, устройства, версии и каналы, затем сформулируйте проверяемую гипотезу.


## Код из интервью

```python
import pandas as pd

steps = ["page_view", "add_to_cart", "purchase"]
events = pd.read_sql("SELECT user_id, event, ts FROM events", conn)

funnel = (events[events.event.isin(steps)]
    .groupby("event")["user_id"].nunique()
    .reindex(steps))

print((funnel / funnel.iloc[0] * 100).round(1).astype(str) + "%")
```

## Пример ответа

Да, я строил воронки для e-commerce платформы. Пример SQL-запроса:

```sql
SELECT
  step,
  COUNT(DISTINCT user_id) AS users,
  ROUND(COUNT(DISTINCT user_id) * 100.0 / 
    FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (ORDER BY step), 2) AS conversion
FROM (
  SELECT user_id, 'view' AS step FROM events WHERE event = 'page_view'
  UNION ALL
  SELECT user_id, 'cart' AS step FROM events WHERE event = 'add_to_cart'
  UNION ALL
  SELECT user_id, 'purchase' AS step FROM events WHERE event = 'purchase'
) t
GROUP BY step
ORDER BY FIELD(step, 'view', 'cart', 'purchase');
```

Ключевой инсайт — добавлять time-to-convert между шагами: мы обнаружили, что 60% пользователей бросают корзину в первые 5 минут, и запустили reminder push-уведомление, что увеличило конверсию на 12%.

## Частые ошибки

- Считать события вместо уникальных сущностей.
- Игнорировать порядок и окно.
- Сравнивать незавершённые когорты с полными.

## Дополнительные вопросы

- Как построить воронку с возвратами на предыдущий шаг?
- Что делать с cross-device пользователями?
- Как отличить баг трекинга от реального drop-off?
