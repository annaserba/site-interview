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

## Частые ошибки

- Обещать строгую O(1) во всех случаях.
- Игнорировать стоимость hash и equality.
- Считать resize утечкой сложности.

## Дополнительные вопросы

- Какие требования к hashable key?
- Что произойдёт при изменении ключа?
- Чем dict отличается от tree map?
