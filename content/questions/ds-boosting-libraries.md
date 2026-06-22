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


## Код из интервью

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Важность признаков
import pandas as pd
fi = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)
print(fi.head(10))
```

## Пример ответа

XGBoost, LightGBM и CatBoost — три основные реализации градиентного бустинга. XGBoost — классика, использует level-wise рост деревьев, хорошо оптимизирован, но медленнее на больших данных. LightGBM — использует leaf-wise рост, что быстрее, но может переобучаться. CatBoost — оптимизирован для категориальных признаков, использует ordered boosting. На практике: LightGBM — для больших данных (10M+ строк), XGBoost — для competitions, CatBoost — когда много категориальных фичей. Все три поддерживают GPU, но LightGBM лучше масштабируется на CPU.

## Частые ошибки

- Утверждать, что одна библиотека всегда точнее.
- Делать target encoding на всех данных.
- Сравнивать только training time.

## Дополнительные вопросы

- Почему leaf-wise может переобучаться?
- Как CatBoost избегает target leakage?
- Какие параметры нельзя переносить один к одному?
