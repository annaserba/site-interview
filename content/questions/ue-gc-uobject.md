---
id: ue-gc-uobject
title: Как работает сборка мусора (GC) в Unreal Engine?
category: C++
scope: game-dev
languages: ["C++"]
roles: ["Game Dev","C++"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое интервью
tags: ["Unreal Engine", "GC", "Memory", "UObject"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

UE использует mark-and-sweep GC для UObject. Объекты создаются через NewObject/UObject::Create, автоматически регистрируются в GC. Сборка запускается по таймеру (по умолчанию ~60 сек или при нехватке памяти). Reachable-объекты (из корневых указателей GUObjectArray) остаются, остальные удаляются. Указатели хранятся как UObject* (сильные) и TWeakObjectPtr (слабые).

## Контекст

GC — ключевая тема для UE-разработчиков: неправильное управление памятью вызывает утечки и краши.

## Как строить ответ

### Механизм

UE GC — поколенческий mark-and-sweep. Корневые объекты (GWorld, GEngine, активоры в уровне) помечаются как reachable. Рекурсивно помечаются все объекты, на которые они ссылаются. Непомеченные удаляются.

### Тайминг

GC запускается каждые ~60 сек (настраивается через `gc.TimeBetweenPurgingPendingKillObjects`). Также принудительно при `ForceGarbageCollection()`.

### Типы указателей

- `UObject*` — сильная ссылка, объект не удаляется
- `TWeakObjectPtr` — слабая, обнуляется при удалении объекта
- `TSoftObjectPtr` — ленивая загрузка, не держит в памяти

## Код из интервью

```cpp
// Создание объекта через GC
UObject* Obj = NewObject<UMyClass>(GetOuter());

// Слабая ссылка
TWeakObjectPtr<UObject> WeakRef = Obj;

// Принудительная сборка мусора
GEngine->ForceGarbageCollection(true);

// Проверка валидности слабой ссылки
if (WeakRef.IsValid()) {
    // Объект жив
}
```

## Пример ответа

GC в UE работает через mark-and-sweep: есть корневые объекты (мир,, активоры), из них рекурсивно помечаются все достижимые UObject. Непомеченные удаляются. Сборка запускается примерно раз в 60 секунд или по требованию. Важно понимать разницу между UObject* (сильная), TWeakObjectPtr (слабая, обнуляется) и TSoftObjectPtr (ленивая загрузка). Для кастомных указателей нужно переопределять AddReferencedObjects.

## Частые ошибки

- Хранить UObject* в TSharedPtr — двойное управление памятью, крашит
- Забыть обнулить указатель после удаления объекта
- Не вызывать AddReferencedObjects для кастомных GC-корней
- Держать сильные ссылки в цикле (objA→objB→objA)

## Дополнительные вопросы

- Как работает предзагрузка (streaming) уровней?
- В чём разница между UPROPERTY и UPROPERTY()?
- Как измерить потребление памяти в UE?
