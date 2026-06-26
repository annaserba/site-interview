---
id: ue-blueprints-vs-cpp
title: Blueprints vs C++ — когда что использовать?
category: Game Development
scope: game-dev
languages: ["C++", "Blueprint"]
roles: ["Game Developer", "C++ Developer"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое интервью
tags: ["Unreal Engine", "Blueprints", "C++", "Architecture"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

C++ — для производительности, низкоуровневой логики, работы с памятью, сетевого кода, AI-систем. Blueprints — для быстрого прототипирования, визуальной логики, анимаций, UI-событий, настройки параметров дизайнерам. Оптимальный подход: C++ как базовый класс, Blueprints как наследники с визуальной доработкой.

## Контекст

Вопрос о архитектурном выборе: понимает ли кандидат компромиссы двух подходов.

## Как строить ответ

### Когда C++

Высокая производительность (Tick, физика), работа с памятью, нативные плагины, серверный код, криптография, complex algorithms.

### Когда Blueprints

Прототипирование, визуальные эффекты, UI-события, анимации, дизайн-параметры, быстрые итерации без перекомпиляции.

### Микс

C++ базовый класс + Blueprint наследник = лучшее из обоих миров.

## Код из интервью

```cpp
// Базовый класс в C++
UCLASS(Blueprintable)
class AMyCharacter : public ACharacter {
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintImplementableEvent)
    void OnDamageTaken(float Damage);
};

// Blueprint наследует и переопределяет OnDamageTaken
```

## Пример ответа

C++ используем для тяжёлой логики — физика, AI, сеть, память. Blueprints — для дизайн-логики, прототипов, UI. Лучшая практика: C++ базовый класс с UFUNCTION(BlueprintImplementableEvent), а Blueprint наследник переопределяет визуально. Это даёт производительность C++ и скорость итераций Blueprints. Нельзя вызывать C++ из Blueprint напрямую — только через UFUNCTION(BlueprintCallable).

## Частые ошибки

- Вся логика в Blueprints — медленно, сложно дебажить
- Вся логика в C++ — долго итерироваться, дизайнеры не могут настраивать
- Blueprint-спагетти: 50+ нод без структуры
- Не использовать C++ для частых вызовов (Tick каждый кадр)

## Дополнительные вопросы

- Как дебажить Blueprints?
- Как оптимизировать Blueprint-ноды?
- Что такое Blueprint Nativization?
