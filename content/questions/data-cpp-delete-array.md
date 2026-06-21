---
id: data-cpp-delete-array
title: В чём разница между delete и delete[] в C++?
category: C++
scope: language-specific
languages: ["C++"]
roles: ["Data Analyst", "C++-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["C++", "Memory", "RAII"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

`delete p` соответствует памяти, полученной одиночным `new T`; `delete[] p` — массиву из `new T[n]` и вызывает деструктор каждого элемента. Несовпадение формы allocation/deallocation даёт undefined behavior. В современном C++ ручная пара почти не нужна: используйте automatic storage, `std::vector`, `std::array` или smart pointer; для массива — `std::unique_ptr<T[]>`.

## Контекст

Вопрос проверяет ownership, деструкторы и знание RAII, а не только синтаксис.

## Как строить ответ

### Сопоставить операции

`new` ↔ `delete`, `new[]` ↔ `delete[]`; `malloc` освобождается только через `free`.

### Объяснить UB

Runtime может хранить служебную информацию о количестве элементов; неправильная форма ломает вызов деструкторов и allocator contract.

### Предложить RAII

Контейнер владеет памятью, корректно освобождается при исключении и явно выражает размер.

## Частые ошибки

- Смешивать `new` и `free`.
- Использовать `delete[]` для указателя на один объект.
- Рекомендовать raw ownership в новом коде.

## Дополнительные вопросы

- Когда нужен custom deleter?
- Чем `unique_ptr<T[]>` уступает vector?
- Что такое rule of zero?
