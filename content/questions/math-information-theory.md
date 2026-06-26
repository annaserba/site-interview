---
id: math-information-theory
title: Какая information theory нужна для ML?
category: Machine Learning
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Math", "Information Theory", "ML"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Entropy, cross-entropy, KL divergence, mutual information. Применение: loss functions (cross-entropy), decision trees (information gain), feature selection (mutual information).

## Контекст

Фундаментальная math для ML metrics. Проверяют понимание information theory concepts.

## Как строить ответ

### Entropy

H(X) = -Σ p(x) log p(x). Мера uncertainty/randomness.

### Cross-entropy

H(p, q) = -Σ p(x) log q(x). Loss для classification.

### KL divergence

D_KL(p||q) = Σ p(x) log(p(x)/q(x)). Разница между distributions.

## Пример ответа

Entropy: fair coin H=1 bit, biased coin H<1 bit. Cross-entropy loss: -Σ y log(ŷ) для classification. KL divergence: quantifies how different predicted distribution is from true.

## Частые ошибки

- Путать entropy и cross-entropy
- Использовать wrong loss function
- Игнорировать class imbalance в loss
- Не понимать KL divergence meaning

## Дополнительные вопросы

- Как работает cross-entropy loss?
- Что такое information gain в decision trees?
- Как связаны mutual information и feature selection?
