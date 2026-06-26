---
id: security-https
title: Зачем нужен HTTPS и как его настроить?
category: Backend
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Junior
stage: Техническое
tags: ["Security", "HTTPS", "TLS"]
duration: 5 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

HTTPS: HTTP + TLS encryption. Защита: шифрование данных, authentication сервера, integrity. Сертификаты: Let's Encrypt (free), Comodo, DigiCert. Настройка: nginx + certbot.

## Контекст

Обязательный для любого сайта. Проверяют понимание importance of HTTPS.

## Как строить ответ

### Зачем

Шифрование: данные не перехватываются. Authentication: сервер — тот, за кого себя выдаёт. Integrity: данные не изменяются.

### Сертификаты

Let's Encrypt: free, автоматическое обновление. Wildcard: для поддоменов.

### Настройка

Nginx: ssl_certificate, ssl_certificate_key. Certbot: автоматическое получение.

## Пример ответа

Setup: `certbot --nginx -d example.com`. Nginx: `listen 443 ssl; ssl_certificate /etc/letsencrypt/...`. Redirect: HTTP → HTTPS. HSTS: `Strict-Transport-Security: max-age=31536000`.

## Частые ошибки

- Не использовать HTTPS
- Не делать redirect HTTP → HTTPS
- Не обновлять сертификаты
- Не использовать HSTS

## Дополнительные вопросы

- Как работает Let's Encrypt?
- Что такое HSTS?
- Как настроить HTTPS в Docker?
