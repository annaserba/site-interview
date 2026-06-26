---
id: data-cpp-delete-array
title: В чём разница между delete и delete[] в C++?
category: C++
scope: language-specific
languages: ["C++"]
roles: ["Data Science","C++"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["C++", "Memory", "RAII"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

`delete p` соответствует памяти, полученной одиночным `new T`; `delete[] p` — массиву из `new T[n]` и вызывает деструктор каждого элемента. Несовпадение формы allocation/deallocation даёт undefined behavior. В современном C++ ручная пара почти не нужна: используйте automatic storage, `std::vector`, `std::array` или smart pointer; для массива — `std::unique_ptr<T[]>`.

## Контекст

Вопрос проверяет ownership, деструкторы и знание RAII, а не только синтаксис.

## Как строить ответ

### Сопоставить операции

`new` ↔ `delete`, `new[]` ↔ `delete[]`; `malloc` освобождается только через `free`.

### Объяснить UB

Runtime может хранить служебную информацию о количестве элементов; неправильная форма ломает вызов деструкторов и allocator contract.

### Предложить RAII

Контейнер владеет памятью, корректно освобождается при исключении и явно выражает размер.


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

delete вызывает деструктор для одного объекта, а delete[] — для каждого элемента массива. Если использовать delete для массива, деструктор будет вызван только для первого элемента, остальные объекты утечь памятью. Пример:

```cpp
MyClass* arr = new MyClass[10];
delete arr;    // Ошибка — деструктор только для arr[0]
delete[] arr;  // Правильно — деструктор для каждого элемента
```

На практике в Modern C++ я использую std::vector или std::unique_ptr<MyClass[]> — это RAII-обёртки, которые автоматически вызывают delete[] при уничтожении. Это исключает ручное управление памятью и делает код безопаснее.

## Частые ошибки

- Смешивать `new` и `free`.
- Использовать `delete[]` для указателя на один объект.
- Рекомендовать raw ownership в новом коде.

## Дополнительные вопросы

- Когда нужен custom deleter?
- Чем `unique_ptr<T[]>` уступает vector?
- Что такое rule of zero?
