---
id: data-cleaning-importance
title: В чём важность очистки данных?
category: Data Quality
scope: multi-language
languages: ["SQL", "Python", "R"]
roles: ["Data Analyst", "Data Engineer", "Data Scientist"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Data quality", "Validation", "Lineage"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Очистка — не косметическое удаление null, а явное приведение данных к контракту, необходимому для решения. Ошибки типов, единиц, дублей, времени, join cardinality и selection bias меняют метрики и выводы. Senior-подход сохраняет raw layer, делает правила детерминированными и версионируемыми, измеряет долю отклонений и не подменяет пропуски без анализа механизма их возникновения.

## Контекст

Проверяется понимание качества, lineage и риска внести bias самой очисткой.

## Как строить ответ

### Определить контракт

Зафиксируйте schema, диапазоны, uniqueness, freshness, единицы и бизнес-инварианты.

### Профилировать причины

Разделяйте пропуски, дубли и выбросы по источнику; не применяйте одно правило ко всем сегментам.

### Сделать процесс наблюдаемым

Храните raw data, quarantine, метрики качества, lineage и алерты на изменение распределений.


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

Очистка данных — это 60-80% времени аналитика, и это критически важно. На прошлом проекте мы обнаружили, что 15% записей имели пропуски в поле user_id, что искажало метрики удержания. Примеры проблем: дубликаты, пропуски (NULL в ключевых полях), выбросы (отрицательные суммы), неконсистентные форматы дат. Я создаю пайплайн очистки: валидация через Great Expectations, дедупликация, импутация пропусков. Для пропусков в age используем медиану по когорте, а не глобальную. Результат — метрики стали воспроизводимыми, и мы доверяем дашбордам.

## Частые ошибки

- Удалять все строки с null.
- Считать выбросы ошибками без доменного анализа.
- Исправлять данные вручную без воспроизводимого правила.

## Дополнительные вопросы

- Как различать missing completely at random и informative missingness?
- Какие проверки выполнять до join и после него?
- Как версионировать правила очистки?
