---
id: klp-storage-engines
title: Как устроены storage engines в modern databases?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Storage Engine", "B-Tree", "LSM"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Storage engines: B-Tree (random reads, low latency) vs LSM Tree (sequential writes, high throughput). B-Tree: PostgreSQL, MySQL InnoDB. LSM: RocksDB, LevelDB, Cassandra. Trade-offs: read vs write performance.

## Контекст

Фундаментальный concept для проектирования databases. Проверяют понимание internals.

## Как строить ответ

### B-Tree

Sorted structure, random access. Read: O(log n). Write: page splits, fragmentation. Used: PostgreSQL, MySQL InnoDB.

### LSM Tree

Log-structured merge tree. Writes: append to memtable, flush to SSTable. Read: bloom filters, SSTable merging. Used: RocksDB, Cassandra.

### Trade-offs

B-Tree: better reads, worse writes. LSM: better writes, read amplification.

## Пример ответа

B-Tree: page-based, each node = page. Read: traverse tree, O(log n). Write: update page, maybe split. LSM: memtable (in-memory) → flush to SSTable (on disk). Compaction: merge SSTables. Read: check memtable → bloom filter → SSTables. Trade-off: LSM high write throughput, read amplification. B-Tree: low read latency, write amplification.

## Частые ошибки

- Не учитывать write amplification
- Игнорировать compaction strategy
- Не планировать memory usage
- Не мониторить SSTable count

## Дополнительные вопросы

- Как работает compaction в LSM Tree?
- Что такое write amplification?
- Как выбрать между B-Tree и LSM Tree?
