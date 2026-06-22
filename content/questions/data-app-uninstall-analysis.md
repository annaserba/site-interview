---
id: data-app-uninstall-analysis
title: Как анализировать удаление мобильного приложения?
category: Product Analytics
scope: multi-language
languages: ["SQL", "Python", "R"]
roles: ["Data Analyst", "Product Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Mobile analytics", "Retention", "Causal inference"]
duration: 20 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Сначала определите наблюдаемый proxy удаления: uninstall напрямую часто не логируется, поэтому используют push-token invalidation, store signals или длительное отсутствие активности — у каждого источника есть bias. Постройте cohort survival по версии, платформе, каналу и lifecycle, свяжите изменение с crash/ANR, latency, permission prompts и продуктовым поведением. Для причинного вывода используйте эксперимент или квазиэксперимент, а не корреляцию последней сессии.

## Контекст

Кейс проверяет формулировку метрики при неполной наблюдаемости и отделение диагностического анализа от причинного.

## Как строить ответ

### Определить событие

Опишите источник uninstall-сигнала, задержку, false positive и различие между удалением и churn.

### Локализовать сегмент

Сравните когорты по release, OS, device, acquisition и стадии onboarding; ищите change point вокруг релизов.

### Проверить причины

Свяжите рост с техническими и продуктовыми событиями, затем подтвердите гипотезу rollout-анализом или экспериментом.


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

Для анализа удалений использую когортный анализ и причинно-следственные методы. Сначала строю воронку: установка — активация — удержание — удаление. Ключевые метрики — retention D1, D7, D30. Для поиска причин применяю SQL-запросы для сегментации по устройству, версии ОС, источникам трафика. Например, выяснили, что удаления выросли после обновления приложения — это было связано с багом в push-уведомлениях. Также применяю CausalImpact для оценки влияния изменений. Важно отличать корреляцию от каузации — например, удаления после рекламной кампании могут быть связаны с привлечением некачественной аудитории.

## Частые ошибки

- Считать отсутствие сессии точным uninstall.
- Сравнивать абсолютные удаления без install cohort.
- Делать причинный вывод по корреляции.

## Дополнительные вопросы

- Как учесть задержку uninstall-сигнала?
- Чем uninstall rate отличается от retention?
- Как оценить влияние конкретного релиза?
