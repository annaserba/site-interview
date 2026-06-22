---
id: data-dashboard-tab
title: Как должна выглядеть вкладка на главном дашборде?
category: BI
scope: multi-language
languages: ["SQL", "Python"]
roles: ["Data Analyst", "Product Analyst", "BI Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Dashboard", "Metrics", "Data visualization"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Начните с пользователя и решения, которое он принимает. Верх вкладки — 3–5 ключевых KPI с целью, периодом, сравнением и freshness; ниже — тренд, декомпозиция драйверов и сегменты, объясняющие изменение; затем диагностические детали и ссылка к raw definition. Цвет кодирует статус, а не украшает. У каждой метрики есть owner, формула, grain, timezone и единый semantic layer.

## Контекст

Проверяется продуктовая постановка, визуальная иерархия и доверие к данным.

## Как строить ответ

### Определить решение

Кто смотрит вкладку, с какой частотой и какое действие должен совершить.

### Построить иерархию

Сначала итог и отклонение, затем причины, потом детализация; исключите графики без вопроса.

### Обеспечить доверие

Покажите freshness, data quality, определения, фильтры и согласованные сравнения периодов.


## Код из интервью

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Важность признаков
import pandas as pd
fi = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)
print(fi.head(10))
```

## Пример ответа

Вкладка на главном дашборде должна содержать: 1) Северную звезду (North Star Metric) вверху — одну ключевую метрику; 2) Метрики-драйверы в виде карточек с дельтами за период; 3) Графики трендов с возможностью сравнения с прошлым периодом; 4) Сегментацию — возможность фильтровать по платформе, региону. Важно: метрики должны быть связаны в дерево (metric tree). Я использую Superset или Metabase, настраиваю кэширование запросов и автоматическое обновление каждые 15 минут. Цель — чтобы PM мог за 30 секунд понять, всё ли в порядке.

## Частые ошибки

- Размещать максимум графиков на одном экране.
- Показывать KPI без цели и сравнения.
- Смешивать разные grain и timezone.

## Дополнительные вопросы

- Как проверить полезность дашборда?
- Когда таблица лучше графика?
- Как предупредить неправильную интерпретацию?
