---
id: llm-function-calling
title: Что такое function calling в LLM и как его использовать?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["LLM", "Function Calling", "AI"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Function calling: LLM решает вызвать определённую функцию с параметрами. OpenAI, Anthropic, Google support. Use cases: API calls, database queries, calculations, external tools.

## Контекст

Ключевой capability для AI agents. Проверяют понимание LLM-tool integration.

## Как строить ответ

### Механизм

Определяете functions (name, description, parameters). LLM решает: вызвать function или ответить текстом. Парсите function call → execute → возвращаете result → LLM генерирует ответ.

### Примеры

get_weather(location) → погода. search_products(query) → товары. create_order(items) → заказ.

## Пример ответа

Function: `get_weather(location: string) → {temp, conditions}`. User: "Какая погода в Москве?" → LLM: `get_weather("Москва")` → execute → result: `{temp: 22, conditions: "sunny"}` → LLM: "В Москве 22°C, солнечно".

## Частые ошибки

- Не описывать functions clearly
- Не валидировать parameters
- Не обрабатывать errors
- Давать слишком много functions

## Дополнительные вопросы

- Как работать с streaming function calls?
- Что такое tool use в Anthropic?
- Как связать function calling и agents?
