---
id: data-airflow-use-cases
title: В каких ситуациях вы используете Airflow?
category: Data Engineering
scope: language-specific
languages: ["Python", "SQL"]
roles: ["Data Analyst", "Data Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Airflow", "Orchestration", "Pipelines"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Airflow нужен для оркестрации batch-workflow с зависимостями, расписанием, retries, backfill, SLA и наблюдаемостью. Он не должен быть основным compute engine, очередью real-time событий или хранилищем данных: task запускает идемпотентную работу во внешней системе и сохраняет маленькие метаданные. DAG проектируют с data interval, catchup, bounded retries и безопасным повторным запуском.

## Контекст

Проверяется понимание границ оркестратора и эксплуатации пайплайна.

## Как строить ответ

### Выбрать подходящий workload

Регулярный ETL, отчёты, обучение моделей и quality checks подходят; low-latency streaming — нет.

### Сделать task идемпотентной

Повтор не должен создавать дубли; используйте partition overwrite, merge или staging с атомарной публикацией.

### Обеспечить эксплуатацию

Настройте timeout, retry policy, pools, alerts, lineage и backfill без перегрузки downstream.


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

Я использую Airflow для оркестрации ETL-пайплайнов. Например, у нас был пайплайн загрузки данных из PostgreSQL в ClickHouse: DAG состоял из задач извлечения, трансформации и загрузки. Используем PythonOperator для трансформаций и PostgresOperator для запросов. Ключевые фичи — catchup для догрузки исторических данных, retry для отказоустойчивости и SLA для контроля времени. Также настраиваем Sensor для ожидания появления файлов в S3. Airflow удобен тем, что DAG визуализируется в UI, и мы можем видеть, где застрял пайплайн. Для мониторинга интегрируем с Slack для алертов.

## Частые ошибки

- Передавать большие DataFrame через XCom.
- Полагаться на execution date как текущее время.
- Создавать одну огромную task без наблюдаемости.

## Дополнительные вопросы

- Как безопасно сделать backfill?
- Для чего нужны pools?
- Когда выбрать streaming-платформу вместо Airflow?
