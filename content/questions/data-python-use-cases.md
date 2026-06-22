---
id: data-python-use-cases
title: В каких ситуациях аналитик использует Python?
category: Data Analytics
scope: language-specific
languages: ["Python", "SQL"]
roles: ["Data Analyst", "Data Scientist"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Python", "Analytics", "Automation"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Python выбирают для статистики, моделирования, автоматизации, API, нестандартных преобразований и воспроизводимых аналитических пакетов. SQL оставляют вычислениям, которые эффективнее выполнить рядом с данными. Для объёмов больше памяти используют pushdown, chunking, Polars, Spark или Dask. Senior-аналитик превращает notebook в тестируемый модуль с фиксированным окружением и мониторингом, если результат становится регулярным.

## Контекст

Нужно показать выбор инструмента и путь от исследования к production.

## Как строить ответ

### Сравнить с SQL

Учитывайте движение данных, оптимизатор БД, сложность алгоритма и навыки команды.

### Разделить exploration и production

Notebook удобен для исследования; регулярный расчёт требует модулей, тестов, логов и orchestration.

### Контролировать ресурсы

Не загружайте весь dataset в память без оценки размера и плана деградации.


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

Python использую для: 1) Анализа данных — pandas для манипуляций, matplotlib/seaborn для визуализации; 2) Автоматизации отчётов — скрипты на jinja2 генерируют PDF; 3) ETL-пайплайнов — sqlalchemy для работы с БД, requests для API; 4) ML-моделей — scikit-learn для простых моделей. Пример: я написал скрипт, который автоматически каждый понедельник скачивает данные из PostgreSQL, строит воронку и отправляет отчёт в Slack. Использую schedule для планирования и pandas для агрегации. Также Python удобен для прототипирования — быстро проверяю гипотезы в Jupyter перед тем, как перенести логику в production SQL.

## Частые ошибки

- Использовать pandas для любой задачи.
- Оставлять бизнес-логику только в notebook.
- Не фиксировать версии зависимостей и seed.

## Дополнительные вопросы

- Когда выбрать Polars или Spark?
- Как тестировать аналитический код?
- Как избежать расхождения SQL и Python-метрик?
