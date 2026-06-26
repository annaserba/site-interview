---
id: ds-dictionary-lookup-complexity
title: Какая сложность получения значения по ключу в словаре?
category: Algorithms
scope: multi-language
languages: ["Python"]
roles: ["Data Scientist", "Data Analyst", "Data Engineer", "Python-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Hash table", "Dictionary", "Complexity"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Для hash table lookup имеет ожидаемую амортизированную O(1), но worst case — O(n) при множестве коллизий или атакующем вводе. Стоимость включает вычисление hash ключа: для длинной строки первый hash не обязательно константен, хотя Python кеширует hash неизменяемой строки. Resize иногда стоит O(n), но амортизируется по операциям; память — O(n) с запасом capacity.

## Контекст

Проверяется точность Big O и понимание скрытой стоимости ключа.

## Как строить ответ

### Назвать expected и worst case

O(1) — средняя модель при хорошем распределении hash, не математическая гарантия каждой операции.

### Учесть equality

После совпадения hash runtime может сравнивать ключи; дорогой `__eq__` меняет реальную стоимость.

### Сравнить структуры

Balanced tree даёт O(log n) worst-case и упорядоченный обход, hash table — быстрый expected lookup.


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

Средняя сложность получения значения по ключу в словаре (хеш-таблице) — O(1). Это достигается за счёт хеш-функции: ключ хешируется в индекс массива, и значение извлекается напрямую. В худшем случае (все ключи попадают в один бакет) сложность O(n), но это маловероятно при хорошей хеш-функции. Python dict использует open addressing и resize при заполнении 2/3. Сложность операций: lookup, insert, delete, contains — все O(1). Важно: для работы с defaultdict или Counter из collections сложность такая же. Сравнение: поиск в отсортированном массиве — O(log n), в неотсортированном — O(n).

## Частые ошибки

- Обещать строгую O(1) во всех случаях.
- Игнорировать стоимость hash и equality.
- Считать resize утечкой сложности.

## Дополнительные вопросы

- Какие требования к hashable key?
- Что произойдёт при изменении ключа?
- Чем dict отличается от tree map?
