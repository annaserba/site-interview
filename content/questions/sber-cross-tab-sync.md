---
id: sber-cross-tab-sync
title: Как можно отслеживать изменения между вкладками браузера?
category: Browser
scope: universal
languages: ["JavaScript"]
roles: ["Frontend"]
companies: ["Сбер"]
level: Middle
stage: Техническое
tags: ["Browser", "BroadcastChannel", "localStorage", "Web API"]
duration: 7 мин
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Основные способы: BroadcastChannel API — двусторонний канал сообщений между вкладками одного origin; событие storage при изменении localStorage в другой вкладке; SharedWorker — общий воркер-хаб; IndexedDB + Web Locks для данных; Service Worker как посредник. На практике чаще всего BroadcastChannel или storage-событие.

## Контекст

Проверяют знание Web API за пределами одной вкладки: синхронизация авторизации, корзины, состояния приложения.

## Как строить ответ

### BroadcastChannel

Современный способ: new BroadcastChannel('app'), postMessage/onmessage. Работает между вкладками, окнами и iframe одного origin. Поддержка отличная.

### Событие storage

При изменении localStorage в одной вкладке остальные получают событие storage с key/oldValue/newValue. Хак, но работает везде; вкладка-инициатор событие не получает.

### SharedWorker

Общий воркер для всех вкладок: порты, централизованное состояние. Мощно, но сложнее в отладке и нет в Safari до 16.

### Данные и блокировки

IndexedDB — общее хранилище; Web Locks API координирует эксклюзивный доступ. Для синхронизации логаута/токена — storage-событие или BroadcastChannel.

## Пример ответа

Основной инструмент — BroadcastChannel: создаём канал по имени, шлём postMessage, во всех остальных вкладках того же origin срабатывает onmessage — так синхронизируют выход из аккаунта или обновление корзины. Классический фолбэк — событие storage: при записи в localStorage в одной вкладке остальные получают событие с ключом и значениями; важно, что сама вкладка-писатель его не получает. Для сложных сценариев — SharedWorker как центральный хаб состояния, а для общих данных — IndexedDB с Web Locks для координации записи. Выбираю по задаче: сигналы — BroadcastChannel, данные — IndexedDB.

## Частые ошибки

- Ждать событие storage в той же вкладке, которая пишет
- Не закрывать BroadcastChannel (channel.close) при размонтировании
- Использовать polling localStorage по таймеру вместо событий
- Забыть, что каналы работают только в рамках одного origin

## Дополнительные вопросы

- Как синхронизировать logout во всех вкладках?
- Чем BroadcastChannel отличается от SharedWorker?
- Какие ограничения у события storage?
- Как передать большие данные между вкладками?
