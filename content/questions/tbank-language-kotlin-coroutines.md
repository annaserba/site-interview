---
id: tbank-language-kotlin-coroutines
title: Как работают корутины в Kotlin? Чем отличаются от потоков?
category: C++
scope: language-specific
languages: ["Kotlin"]
roles: ["Backend","Mobile"]
companies: ["Т-Банк"]
level: Middle
stage: Язык
tags: ["Kotlin", "Coroutines", "Concurrency", "Language"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Корутины — lightweight concurrency: не блокируют поток, работают через state machine. Диспетчеры (Dispatchers) определяют, на каком потоке выполняется: Default (CPU), IO (disk/network), Main (UI). Suspension — сохранение контекста без блокировки потока. Structured concurrency — запуск корутин в scope, автоматическая отмена.

## Контекст

Языковой вопрос: понимает ли кандидат model concurrency в Kotlin.

## Как строить ответ

### Корутины vs потоки

Корутины — cooperative, lightweight (10K+ на одном потоке), suspension points. Потоки — OS-level, ~1K.

### Диспетчеры

Default (CPU-bound), IO (network/disk), Main (UI), Unconfined.

### Structured concurrency

launch/async в scope → автоматическая отмена при выходе из scope.

## Код из интервью

```kotlin
// Запуск корутины
viewModelScope.launch(Dispatchers.IO) {
    val data = repository.fetchData() // suspend function
    withContext(Dispatchers.Main) {
        uiState.value = data
    }
}

// Structured concurrency
suspend fun loadUser() = coroutineScope {
    val profile = async { fetchProfile() }
    val settings = async { fetchSettings() }
    User(profile.await(), settings.await())
}
```

## Пример ответа

Корутины — cooperative concurrency: при遇到suspend-функции корутина приостанавливается, освобождая поток. Диспетчеры определяют контекст: IO для сети, Default для CPU. Structured concurrency через coroutineScope guarantee отмену при ошибке. Главное отличие от потоков: 10K+ корутин на одном потоке vs ~1000 потоков.

## Частые ошибки

- Думать, что корутины = потоки
- Не использовать structured concurrency
- Блокировать Main поток
- Не отменять корутины при уничтожении UI

## Дополнительные вопросы

- Что такое Flow в Kotlin?
- Как тестируете корутины?
- Чем отличается launch от async?
