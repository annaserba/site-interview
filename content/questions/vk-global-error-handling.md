---
id: vk-global-error-handling
title: Как перехватить все JS-ошибки на странице?
category: Browser
scope: universal
languages: ["JavaScript"]
roles: ["Frontend"]
companies: ["VK"]
level: Middle
stage: Техническое
tags: ["JavaScript", "Error Handling", "Monitoring", "Browser"]
duration: 7 мин
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

window.addEventListener('error') — синхронные ошибки и ошибки загрузки ресурсов (на capture-фазе), window.addEventListener('unhandledrejection') — необработанные reject-промисы. Дополнительно: обёртки для console.error, переопределение onerror/onunhandledrejection, а в бою — SDK мониторинга (Sentry), который делает это плюс source maps и контекст.

## Контекст

Практический вопрос про наблюдаемость фронтенда: как собирать ошибки продакшена.

## Как строить ответ

### error-событие

window.onerror или addEventListener('error') ловит необработанные исключения. Важно: ошибки загрузки ресурсов (script, img) не всплывают — ловим на capture-фазе с третьим аргументом true.

### unhandledrejection

Промисы без catch приходят отдельным событием unhandledrejection с reason. preventDefault скрывает вывод в консоль.

### Что не поймается

Ошибки внутри try/catch (их отдаёт сам catch), ошибки в воркерах — там свой onerror, ошибки самого обработчика. Кросс-доменные скрипты без CORS дают лишь «Script error.» — решается crossorigin + CORS-заголовками.

### Продакшн-конвейер

Собрать stack, url, userAgent, breadcrumbs → отправить beacon'ом в коллектор → группировка и алерты в Sentry; source maps для минифицированного кода.

## Пример ответа

Глобально ошибки ловятся двумя каналами. Первый — событие error на window: сюда приходят все необработанные синхронные исключения. Важный нюанс: ошибки загрузки ресурсов — упавший script или img — не всплывают, поэтому слушатель вешаю с флагом capture: true. Второй канал — unhandledrejection: сюда попадают промисы без обработчика catch, в event.reason лежит причина. Отдельно помню про «Script error.»: для кросс-доменных скриптов без CORS браузер скрывает детали, лечится атрибутом crossorigin и заголовками Access-Control-Allow-Origin. Чего эти механизмы не поймают: исключения, уже пойманные try/catch, и ошибки внутри веб-воркеров — там нужен свой onerror. В реальном проекте вместо велосипеда подключаю Sentry: тот же сбор плюс source maps, breadcrumbs, группировка и алерты.

## Частые ошибки

- Ждать ошибки ресурсов на bubble-фазе — нужен capture
- Забыть про unhandledrejection: промисы молча умирают
- Пытаться ловить ошибки воркеров из главного потока
- Слать каждую ошибку отдельным запросом без троттлинга

## Дополнительные вопросы

- Что такое «Script error.» и как получить стек?
- Как перехватить ошибки в service worker?
- Как отправить лог при закрытии вкладки (sendBeacon)?
- Чем Error Boundary в React дополняет глобальный перехват?
