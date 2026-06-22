---
id: rutube-url-to-render
title: Что происходит после того, как пользователь ввёл URL в адресную строку?
category: Web Platform
scope: universal
languages: []
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Rutube"]
level: Middle
stage: Техническое
tags: ["Browser", "DNS", "HTTP", "Rendering", "Network"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

После ввода URL браузер проверяет кэш DNS, делает DNS-запрос для получения IP, устанавливает TCP-соединение (三次握手), при необходимости TLS-хендшейк, отправляет HTTP-запрос, получает ответ (HTML), парсит DOM и CSSOM, строит Render Tree, выполняет Layout, Paint и Composite, отображая страницу на экране.

## Контекст

Интервьюер проверяет фундаментальное понимание работы веб-платформы: от сетевого стека до рендеринга. Ожидается последовательное объяснение всех этапов с указанием оптимизаций на каждом шаге.

## Как строить ответ

### DNS и сетевое подключение

DNS-резолвинг: browser cache → OS cache → router → ISP DNS → recursive resolver. После получения IP — TCP三次握手 (SYN, SYN-ACK, ACK), затем TLS handshake для HTTPS. Механизм TCP Fast Open для повторных соединений.

### Загрузка ресурсов

HTTP-запрос с заголовками (cookies, cache, accept). Сервер отвечает HTML. Браузер парсит HTML, находит ссылки на CSS/JS/images и начинает загружать их параллельно. Preload scanner — ускоряет обнаружение критических ресурсов до завершения парсинга HTML.

### Парсинг и построение дерева

HTML → DOM Tree. CSS → CSSOM Tree. Оба дерева объединяются в Render Tree. В Render Tree нет скрытых элементов (display: none). JavaScript может блокировать парсинг через document.write или синхронные скрипты.

### Рендеринг на экране

Render Tree → Layout (вычисление позиций и размеров) → Paint (рисование пикселей) → Composite (слои и GPU-ускорение). Reflow = пересчёт Layout. Repaint = перерисовка без изменения геометрии.

## Код из интервью

```markdown
## Полная последовательность этапов

1. **URL Parse** — парсинг протокола, домена, пути, параметров
2. **HSTS Check** — проверка списка HSTS (принудительный HTTPS)
3. **DNS Lookup** — резолвинг домена в IP-адрес
4. **TCP Connection** —三次握手 (SYN → SYN-ACK → ACK)
5. **TLS Handshake** — обмен ключами, сертификат, шифрование
6. **HTTP Request** — отправка GET/POST с заголовками
7. **HTTP Response** — получение HTML (200, 301, 304...)
8. **HTML Parsing** — построение DOM-дерева
9. **CSSOM** — парсинг CSS в дерево стилей
10. **Render Tree** — объединение DOM + CSSOM
11. **Layout** — вычисление геометрии (reflow)
12. **Paint** — рисование пикселей (repaint)
13. **Composite** — наложение слоёв через GPU
```

## Пример ответа

Когда пользователь вводит URL, происходит цепочка из ~15 этапов. Сначала браузер проверяет HSTS-список и кэш DNS. Если IP не найден — идёт DNS-запрос через рекурсивный резолвер: browser cache → OS cache → роутер → DNS провайдера.

Получив IP, браузер устанавливает TCP-соединение (三次握手), затем TLS-хендшейк для шифрования. Далее отправляется HTTP-запрос с заголовками (cookies, cache directives, Accept-Encoding).

Сервер отвечает HTML. Браузер запускает preload scanner — он обнаруживает критические ресурсы (CSS, JS) до завершения парсинга HTML, что ускоряет загрузку. Параллельно с парсингом HTML строится CSSOM из CSS-файлов.

DOM и CSSOM объединяются в Render Tree. Затем Layout вычисляет позиции и размеры каждого элемента. Paint рисует пиксели в виртуальные слои. Composite объединяет слои через GPU и выводит на экран.

Ключевые оптимизации: DNS prefetch, TCP preconnect, HTTP/2 мультиплексирование, Brotli-сжатие, lazy loading для изображений, code splitting для JS.

## Частые ошибки

- Забывать про DNS-резолвинг и начинать сразу с HTTP.
- Не упоминать HSTS и TLS handshake.
- Путать Reflow (Layout) и Repaint.
- Забывать про preload scanner и его роль в ускорении загрузки.
- Не говорить про HTTP/2 мультиплексирование и его влияние на параллельную загрузку.

## Дополнительные вопросы

- Как HTTP/2 изменил способ загрузки ресурсов по сравнению с HTTP/1.1?
- Что такое Critical Rendering Path и как его оптимизировать?
- Как Service Worker влияет на этот процесс?
- Чем отличается CSR от SSR в контексте первого рендера?
