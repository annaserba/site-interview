---
id: ds-python-decorator
title: Что такое декоратор в Python?
category: Python
scope: language-specific
languages: ["Python"]
roles: ["Data Scientist", "ML Engineer", "Data Analyst", "Data Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Python", "Decorators", "Closures"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Декоратор — callable, который принимает функцию или класс и возвращает замену; синтаксис `@decorator` применяет его в момент определения. Для функции wrapper обычно использует `*args, **kwargs` и `functools.wraps`, чтобы сохранить metadata. Декораторы подходят для logging, metrics, retry и access control, но должны сохранять контракт, корректно поддерживать async и не скрывать важный control flow.

## Контекст

Нужно объяснить модель объектов Python, closures и инженерные риски wrapper.

## Как строить ответ

### Развернуть синтаксис

`@d` над `f` эквивалентен `f = d(f)`; decorator factory добавляет ещё один уровень вызова.

### Сохранить metadata

`functools.wraps` копирует имя, docstring и `__wrapped__`, помогая introspection и tooling.

### Учесть async и state

Async function требует async wrapper; mutable state в closure должен быть потокобезопасным.


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

Декоратор в Python — это функция, которая принимает другую функцию и расширяет её поведение. Пример:

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} executed in {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
```

На практике декораторы используют для: логирования (@login_required), кэширования (@lru_cache), retry (@retry(max_attempts=3)), валидации. Важно: используйте functools.wraps для сохранения метаданных оригинальной функции.

## Частые ошибки

- Вызывать декорируемую функцию при определении вместо runtime.
- Забывать вернуть результат wrapper.
- Терять signature и metadata.

## Дополнительные вопросы

- Как написать parametrized decorator?
- Как декорировать async function?
- В каком порядке применяются несколько декораторов?
