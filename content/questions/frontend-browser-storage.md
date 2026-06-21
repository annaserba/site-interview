---
id: frontend-browser-storage
title: В чём разница между cookie, localStorage и sessionStorage?
category: Web Platform
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Cookies", "Storage", "Security"]
duration: 12 мин
difficulty: 4
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Cookie автоматически прикладывается к подходящим HTTP-запросам и управляется атрибутами Domain, Path, Expires, Secure, HttpOnly и SameSite; поэтому подходит для серверной сессии, но влияет на каждый request. `localStorage` хранится для origin до очистки, `sessionStorage` — отдельно для вкладки и её сессии. Оба Web Storage API синхронны, доступны JavaScript и не подходят для секретов или больших объёмов.

## Контекст

Нужно выбрать хранилище по модели угроз, времени жизни, объёму и необходимости доступа серверу.

## Как строить ответ

### Выбрать по потребителю

Серверной сессии нужен cookie; UI-настройкам может подойти localStorage; краткоживущему состоянию вкладки — sessionStorage.

### Разобрать безопасность

HttpOnly снижает риск кражи session token через XSS, SameSite и CSRF token защищают от CSRF. Доступный JS storage уязвим при XSS.

### Учесть производительность

Web Storage синхронно блокирует main thread; для больших структур и транзакций используйте IndexedDB.

## Частые ошибки

- Хранить долгоживущий access token в localStorage без анализа XSS.
- Считать HttpOnly cookie защитой от CSRF сам по себе.
- Использовать localStorage как реактивную базу данных.

## Дополнительные вопросы

- Когда выбрать IndexedDB?
- Как SameSite влияет на OAuth redirect?
- Как синхронизировать изменение между вкладками?
