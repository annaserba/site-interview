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

## Частые ошибки

- Вызывать декорируемую функцию при определении вместо runtime.
- Забывать вернуть результат wrapper.
- Терять signature и metadata.

## Дополнительные вопросы

- Как написать parametrized decorator?
- Как декорировать async function?
- В каком порядке применяются несколько декораторов?
