---
id: frontend-js-stack-heap
title: Что хранится в стеке и куче JavaScript-движка?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Call Stack", "Heap", "Memory"]
duration: 10 мин
difficulty: 3
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2623s"
---

## Короткий ответ

Call stack хранит активные execution frames: return address, локальное состояние и служебные данные; heap — динамические объекты и структуры с временем жизни вне одного вызова. Формула «примитивы в стеке, объекты в куче» учебная и не гарантируется спецификацией: JIT может unbox, scalar-replace и размещать данные иначе. В прикладном ответе важны LIFO вызовов, stack overflow, references и GC heap.

## Контекст

Проверяется корректная модель без выдуманных гарантий реализации.

## Как строить ответ

### Stack

Frames, рекурсия и ограниченный размер.

### Heap

Динамическое время жизни и управление GC.

### Оговорка

ECMAScript не закрепляет физическое размещение значений.

## Частые ошибки

- Выдавать оптимизацию движка за правило языка.
- Смешивать task queue и call stack.
- Считать closure копией всего stack frame.

## Дополнительные вопросы

- Откуда берётся stack overflow?
- Где живут данные closure?

