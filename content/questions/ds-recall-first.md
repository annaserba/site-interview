---
id: ds-recall-first
title: Когда recall важнее precision?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Scientist", "ML Engineer", "Data Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Recall", "Precision", "Threshold"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Recall приоритетен, когда false negative намного дороже false positive: первичный медицинский скрининг, поиск мошенничества для последующей проверки, обнаружение критических дефектов. Precision всё равно не становится «неважным»: поток ложных тревог ограничен стоимостью проверки, доверием пользователей и capacity. Поэтому оптимизируют recall при минимальном precision, максимальном FPR или фиксированном бюджете.

## Контекст

Проверяется перевод бизнес-стоимости ошибок в threshold policy.

## Как строить ответ

### Задать цену ошибок

Сравните вред пропуска и стоимость ложного срабатывания.

### Добавить capacity

Если ручная команда проверяет тысячу кейсов в день, threshold должен учитывать этот лимит.

### Проверить сегменты

Минимальный recall может быть обязателен отдельно для критичных групп.

## Частые ошибки

- Говорить, что precision совсем не имеет значения.
- Максимизировать recall выбором «всё positive».
- Игнорировать изменение prevalence.

## Дополнительные вопросы

- Как выбрать threshold при фиксированном бюджете?
- Когда precision важнее recall?
- Как построить cost-sensitive metric?
