---
id: ds-boosting-libraries
title: В чём разница между XGBoost, LightGBM и CatBoost?
category: Machine Learning
scope: language-specific
languages: ["Python"]
roles: ["Data Scientist", "ML Engineer"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["XGBoost", "LightGBM", "CatBoost"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Все три — production-библиотеки gradient boosted trees. XGBoost зрелый и универсальный, обычно растит level-wise деревья и имеет сильную регуляризацию. LightGBM использует histogram-based обучение и leaf-wise growth, часто быстрее на больших данных, но легче переобучается при малых выборках. CatBoost применяет ordered boosting и нативную обработку категорий, снижая target leakage. Выбор подтверждают time-aware benchmark по качеству, latency, памяти и удобству deployment.

## Контекст

Проверяется не бренд-предпочтение, а знание алгоритмических и эксплуатационных trade-offs.

## Как строить ответ

### Сравнить рост деревьев

Leaf-wise быстрее снижает loss, но требует ограничений `num_leaves` и `min_data_in_leaf`.

### Разобрать категории

CatBoost строит ordered target statistics; manual target encoding требует out-of-fold схемы.

### Учесть production

Сравните inference latency, размер модели, CPU/GPU, missing values и формат экспорта.

## Частые ошибки

- Утверждать, что одна библиотека всегда точнее.
- Делать target encoding на всех данных.
- Сравнивать только training time.

## Дополнительные вопросы

- Почему leaf-wise может переобучаться?
- Как CatBoost избегает target leakage?
- Какие параметры нельзя переносить один к одному?
