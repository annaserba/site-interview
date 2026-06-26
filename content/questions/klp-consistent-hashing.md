---
id: klp-consistent-hashing
title: Что такое consistent hashing и зачем он нужен?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Consistent Hashing", "Load Balancing"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Consistent hashing — алгоритм распределения данных между узлами, минимизирующий перемещение данных при добавлении/удалении узлов. Используется в: Cassandra, DynamoDB, CDN, load balancers. Виртуальные узлы для балансировки.

## Контекст

Фундаментальный algorithm для распределённых систем. Проверяют понимание как эффективно распределять данные.

## Как строить ответ

### Проблема

Simple hash: `hash(key) % N`. При добавлении узла (N → N+1) — почти все ключи перемещаются.

### Решение

Hash ring: узлы и ключи хешируются на ring. Ключ идёт к следующему узлу по часовой.

### Виртуальные узлы

Каждый физический узел имеет несколько virtual nodes для балансировки.

## Пример ответа

Consistent hashing: узлы A, B, C на ring. Ключ k1 хешируется между A и B → идёт к B. Добавляем D между B и C → перемещаются только ключи между B и D. Без consistent hashing: добавление узла → перемещение всех ключей. Виртуальные узлы: каждый физический узел имеет 100-200 virtual nodes для равномерного распределения.

## Частые ошибки

- Не использовать виртуальные узлы
- Игнорировать replication на ring
- Не учитывать load balancing
- Использовать простой hash % N

## Дополнительные вопросы

- Как выбрать количество виртуальных узлов?
- Как consistent hashing связан с replication?
- Что такое jump consistent hashing?
