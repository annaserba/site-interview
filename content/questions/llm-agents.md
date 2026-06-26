---
id: llm-agents
title: Что такое AI agents и как их построить?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["LLM", "Agents", "AI"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

AI agents: LLM + tools + memory + planning. Архитектура: ReAct (reasoning + acting), Plan-and-execute, multi-agent. Фреймворки: LangChain, LlamaIndex, AutoGen.

## Контекст

Продвинутый topic для AI applications. Проверяют понимание agent architectures.

## Как строить ответ

### Компоненты

LLM: brain. Tools: functions, APIs. Memory:/. Planning: goal.

### Архитектуры

ReAct: think → act → observe → repeat. Plan-and-execute: plan first, then execute. Multi-agent: несколько agents collaborate.

### Инструменты

LangChain: popular framework. LlamaIndex: RAG-focused. AutoGen: multi-agent.

## Пример ответа

Agent: "Найди информацию о CORS" → think: "нужно search" → act: web_search("CORS") → observe: found docs → think: "нужно summarize" → act: summarize(docs) → final answer.

## Частые ошибки

- Давать слишком много tools
- Не ограничивать loops
- Не обрабатывать errors
- Не делать human oversight

## Дополнительные вопросы

- Как работает ReAct pattern?
- Что такое multi-agent systems?
- Как связать agents и function calling?
