---
id: klp-inverted-index
title: Как работает inverted index и почему он важен для поиска?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Inverted Index", "Search"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Inverted index — структура данных для быстрого поиска по содержимому. Мапит terms → documents. Каждый term указывает на список документов, где он встречается. Основа全文ового поиска (Elasticsearch, Lucene).

## Контекст

Фундаментальный concept для поисковых систем. Проверяют понимание как работает поиск.

## Как строить ответ

### Структура

Term dictionary: term → [doc1, doc2, doc3]. Posting list: для каждого term — список документов и позиций.

### Building

Tokenization → stemming/lemmatization → индексация. Batch vs real-time indexing.

### Оптимизация

Compression (VByte, PFOR), skipping, intersection algorithms.

## Пример ответа

Inverted index: "distributed" → [doc1 (pos 5), doc3 (pos 12)]. "systems" → [doc1 (pos 6), doc2 (pos 1)]. Query "distributed systems" → intersection [doc1]. Elasticsearch: Lucene inverted index. Posting lists compressed, intersections через AND/OR. Real-time: segment-based, refresh каждые 1 секунду. Для 10M документов: ~100MB index, query latency ~10ms.

## Частые ошибки

- Не учитывать stemming/lemmatization
- Игнорировать scoring (TF-IDF, BM25)
- Не оптимизировать posting lists
- Не планировать index updates

## Дополнительные вопросы

- Как работает TF-IDF scoring?
- Что такое segment-based indexing?
- Как обрабатывать multilingual search?
