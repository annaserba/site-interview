---
id: math-probability
title: Какая теория вероятностей нужна для Data Science?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Probability", "Statistics"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Вероятность, условная вероятность, Bayes theorem, распределения (normal, binomial, Poisson),, variance. Применение: classification, A/B testing, Bayesian inference.

## Контекст

Фундаментальная math для data science. Проверяют понимание probability theory.

## Как строить ответ

### Основы

P(A|B) = P(A∩B) / P(B). Bayes: P(A|B) = P(B|A) × P(A) / P(B).

### Распределения

Normal (Gaussian): bell curve. Binomial: binary outcomes. Poisson: rare events.

### Применение

Classification: P(class|features). A/B testing: statistical significance. Naive Bayes: text classification.

## Пример ответа

Bayes: P(spam|word="free") = P("free"|spam) × P(spam) / P("free"). Normal distribution: height, weight, test scores. Poisson: number of events per time unit.

## Частые ошибки

- Путать conditional и joint probability
- Не понимать Bayes theorem
- Использовать normal distribution для всего
- Игнорировать prior probability

## Дополнительные вопросы

- Как работает Naive Bayes classifier?
- Что такое central limit theorem?
- Как связаны probability и information theory?
