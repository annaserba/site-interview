---
id: data-metric-pyramid
title: Как сформулировать пирамиду метрик?
category: Product Analytics
scope: universal
languages: []
roles: ["Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Metric tree", "North star", "KPI"]
duration: 20 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Начните с ценности для пользователя и бизнес-результата, выберите north-star с частотой использования и качеством, затем разложите её математически или причинно на acquisition, activation, engagement, retention и monetization. Нижний слой — операционные драйверы, которыми управляют команды; рядом — guardrails. Для каждой метрики зафиксируйте формулу, grain, owner, источник, latency и направление влияния.

## Контекст

Нужно построить управляемую систему метрик, а не список показателей.

## Как строить ответ

### Выбрать верхний результат

Метрика должна отражать доставленную ценность и не расти от вредного поведения.

### Декомпозировать

Свяжите уровни формулой или гипотезой причинного влияния и избегайте двойного счёта.

### Назначить действия

Каждая leaf metric имеет команду, рычаг воздействия и guardrail.


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

Пирамида метрик строится по принципу «от цели к действию». Сверху — North Star Metric (например, «количество активных подписчиков»). Ниже — метрики-драйверы (конверсия в регистрацию, retention D7, средний чек). Ещё ниже — input metrics (количество регистраций, число completed onboarding). Пример для e-commerce: North Star = GMV, драйверы = конверсия × средний чек × количество заказов. Каждая метрика должна иметь владельца и пороговое значение (green/yellow/red). Я строю такие пирамиды в Notion или Miro, затем автоматизирую мониторинг через Looker.

## Частые ошибки

- Выбирать revenue единственной верхней метрикой.
- Смешивать метрики разного grain.
- Рисовать связи без проверяемой логики.

## Дополнительные вопросы

- Как проверить причинность между уровнями?
- Где разместить качество и риск?
- Как версионировать дерево метрик?
