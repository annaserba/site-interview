---
id: klp-bloom-filter
title: Что такое Bloom filter и где он применяется?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Bloom Filter", "Probabilistic Data Structures"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Bloom filter — вероятностная структура данных для проверки принадлежности элемента к множеству. False positives возможны, false negatives невозможны. Экономит память: 10 элементов в бите вместо storage полного элемента.

## Контекст

Полезный инструмент для оптимизации distributed systems. Проверяют понимание probabilistic data structures.

## Как строить ответ

### Принцип

Каждый элемент хешируется k раз, устанавливает биты в bit array. Query: проверяем все k битов.

### Свойства

False positive: элемент может быть в множестве, хотя его нет. False negative: невозможно — если хотя бы один бит 0, элемента точно нет.

### Применение

Cassandra, HBase: проверка перед disk read. CDN: проверка existence. Network routers: blacklists.

## Пример ответа

Bloom filter в Cassandra: перед чтением SSTable проверяем bloom filter. Если filter говорит "нет" — пропускаем disk read. False positive: прочитаем SSTable, но элемента нет (extra I/O, но rare). False negative: невозможно — если элемент есть, мы его всегда найдём. Экономия: 10 элементов → ~10 бит вместо storage полного ключа. Для 10M элементов: ~10MB vs ~1GB.

## Частые ошибки

- Использовать bloom filter, где нужна точная проверка
- Не учитывать false positive rate
- Не оптимизировать size и number of hash functions
- Игнорировать deletion (нужен counting bloom filter)

## Дополнительные вопросы

- Как выбрать оптимальный size bloom filter?
- Что такое counting bloom filter?
- Какие альтернативы bloom filter существуют?
