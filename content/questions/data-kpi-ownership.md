---
id: data-kpi-ownership
title: Каким командам вы назначаете KPI?
category: Product Analytics
scope: universal
languages: []
roles: ["Data Analyst", "Product Analyst", "BI Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["KPI", "Metrics", "Ownership"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Аналитик не «назначает KPI» в одиночку: он помогает связать стратегическую цель с контролируемой зоной команды, проверяет измеримость и защищает от локальной оптимизации. KPI получает команда, способная существенно влиять на его драйверы; рядом нужны guardrails по качеству, риску и долгосрочному эффекту. Формулу, baseline, target, owner и cadence фиксируют совместно с продуктом и бизнесом.

## Контекст

Проверяется понимание ownership метрик и опасности конфликтующих стимулов.

## Как строить ответ

### Построить связь с целью

Разложите north-star на драйверы, которыми реально управляет конкретная команда.

### Проверить controllability

Не ставьте человеку KPI, на который в основном влияют внешние команды или сезонность.

### Добавить guardrails

Рост conversion не должен достигаться ценой возвратов, жалоб или retention.


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

Я назначаю KPI командам на основе их зоны влияния. Frontend-команда отвечает за Core Web Vitals, backend — за latency P99 и error rate, маркетинг — за CAC и LTV. Важно, чтобы KPI были SMART. На прошлом проекте мы ввели KPI «время от идеи до релиза» для delivery-команды, что сократило lead time с 3 недель до 1.5. KPI должны быть связаны с бизнес-целями — если цель компании увеличение retention, то KPI команды = удержание D30. Также важна регулярность review — каждые 2 недели анализируем, достигнуты ли KPI.

## Частые ошибки

- Назначать один KPI нескольким командам без разделения драйверов.
- Ставить activity metric вместо outcome.
- Не учитывать gaming и побочные эффекты.

## Дополнительные вопросы

- Как избежать конфликта KPI команд?
- Что делать с общей платформенной командой?
- Как пересматривать target при изменении рынка?
