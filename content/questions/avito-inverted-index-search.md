---
id: avito-inverted-index-search
title: Как устроен полнотекстовый поиск и зачем Avito использует Elasticsearch?
category: System Design
scope: universal
languages: []
roles: ["Backend-разработчик", "Frontend-разработчик"]
companies: ["Avito"]
level: Middle
stage: Архитектура
tags: ["Search", "Elasticsearch", "Inverted Index", "TF-IDF"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Inverted index — структура данных, которая отображает слова в документы (как индекс книги). PostgreSQL FTS использует inverted index, но Elasticsearch оптимизирован для масштабирования, аналитики и релевантности (BM25 vs TF-IDF). Avito ищет по миллионам объявлений с фильтрами, фасетами и ранжированием.

## Контекст

Интервьюер проверяет понимание принципа полнотекстового поиска, зачем нужен отдельный search engine вместо PostgreSQL FTS, как работает inverted index и что такое TF-IDF/BM25.

## Как строить ответ

### Объяснить inverted index

Вместо хранения "документ → слова" (forward index) хранится "слово → документы". Это позволяет находить все документы с словом за O(1) по слову.

### Показать ограничения PostgreSQL FTS

PostgreSQL поддерживает полнотекстовый поиск, но не масштабируется горизонтально, нет фасетного поиска, нет аналитики, сложная настройка релевантности.

### Разобрать TF-IDF и BM25

TF-IDF — частота слова в документе × обратная частота слова в корпусе. BM25 — улучшенная версия с настраиваемыми параметрами (k1, b).

### Описать архитектуру Elasticsearch

Кластер из нод, индексы разбиты на шарды, каждый шард — отдельный inverted index. Реплики для отказоустойчивости.

## Код из интервью

```sql
-- PostgreSQL FTS
SELECT * FROM ads
WHERE to_tsvector('russian', title || ' ' || description)
  @@ plainto_tsquery('russian', 'iPhone 13');

-- Индекс для ускорения
CREATE INDEX ads_search_idx ON ads
  USING GIN(to_tsvector('russian', title || ' ' || description));
```

```json
// Elasticsearch query
{
  "query": {
    "multi_match": {
      "query": "iPhone 13",
      "fields": ["title^3", "description"],
      "type": "best_fields",
      "fuzziness": "AUTO"
    }
  },
  "aggs": {
    "categories": { "terms": { "field": "category" } },
    "price_ranges": { "histogram": { "field": "price", "interval": 10000 } }
  }
}
```

## Пример ответа

Inverted index — структура, которая отображает каждое слово в список документов, содержащих это слово. Это как индекс в конце книги: слово → страницы. Поиск по слову — O(1), потом пересечение списков для multiple words.

PostgreSQL поддерживает FTS через GIN индексы, но у него нет масштабирования, фасетного поиска, аналитики. Elasticsearch построен на inverted index, оптимизирован для полнотекстового поиска и аналитики.

BM25 (в Elasticsearch) — улучшенная версия TF-IDF: учитывает длину документа и настраиваемые параметры. TF-IDF — базовая мера: частота слова в документе × логарифм обратной частоты в корпусе.

Avito использует Elasticsearch для: полнотекстового поиска по объявлениям, фасетной фильтрации (категории, цены, локации), аналитики (что ищут пользователи), autocomplete и typo-tolerance.

## Частые ошибки

- Считать, что PostgreSQL FTS полностью заменяет Elasticsearch — для масштабирования и аналитики нужен ES.
- Путать inverted index с B-tree индексом — B-tree для диапазонов, inverted index для текста.
- Игнорировать аналитику — Elasticsearch даёт фасеты и агрегации "из коробки".
- Не учитывать стоимость — Elasticsearch требует отдельной инфраструктуры и кластера.

## Дополнительные вопросы

- Как настроить релевантность в Elasticsearch?
- В чём разница между term и match запросами?
- Как Elasticsearch масштабируется горизонтально?
- Как обрабатывать дубликаты и конфликты данных в Elasticsearch?
