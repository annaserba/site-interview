---
id: data-supervised-unsupervised
title: В чём разница между supervised и unsupervised learning?
category: Machine Learning
scope: multi-language
languages: ["Python", "R"]
roles: ["Data Analyst", "Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Machine learning", "Supervised", "Unsupervised"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Supervised learning обучает отображение признаков в наблюдаемую target по размеченным примерам — классификацию, регрессию, ranking. Unsupervised learning ищет структуру без целевой разметки: кластеры, низкоразмерное представление, аномалии. Граница не равна «есть данные или нет»: self-supervised создаёт обучающий сигнал из самих данных, semi-supervised сочетает малую разметку и большой unlabeled corpus.

## Контекст

Нужно связать постановку, валидацию и бизнес-смысл результата.

## Как строить ответ

### Начать с сигнала

Есть ли target, как она получена и соответствует ли будущему решению.

### Сравнить оценку

Supervised-модель валидируют на holdout по целевой метрике; unsupervised требует proxy, stability и внешней интерпретации.

### Обсудить риски

Для supervised опасны leakage и label bias; для clustering — произвольность метрики расстояния и числа кластеров.

## Частые ошибки

- Считать clusters объективными классами реального мира.
- Оценивать clustering только по красивой визуализации.
- Допускать target leakage в supervised pipeline.

## Дополнительные вопросы

- Как валидировать кластеризацию?
- Что такое self-supervised learning?
- Когда anomaly detection является supervised?
