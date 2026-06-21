---
id: wildberries-critical-rendering-path
title: Как браузер превращает HTML и CSS в изображение на экране?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Critical Rendering Path", "DOM", "CSSOM"]
duration: 15 мин
difficulty: 4
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=487s"
---

## Короткий ответ

HTML парсится потоково в DOM, CSS — в CSSOM; CSS блокирует render, а обычный parser-blocking script может остановить HTML parser. DOM и CSSOM формируют render tree без невидимых узлов, затем браузер вычисляет styles, layout, paint records и compositing слоёв. GPU композитит tiles в кадр. Оптимизация измеряется через LCP, INP и CLS, а не количеством абстрактных «перерисовок».

## Контекст

Интервьюер ожидает полный critical rendering path и понимание блокирующих ресурсов.

## Как строить ответ

### Разделить деревья

DOM описывает структуру, CSSOM — правила, render tree — только участвующие в отображении элементы.

### Описать pipeline

Style calculation → layout → paint → raster → composite; не каждое изменение запускает все этапы.

### Связать с загрузкой

Критический CSS, preload, размеры изображений и правильная стратегия scripts сокращают путь до первого содержательного кадра.

## Частые ошибки

- Говорить, что DOM строится только после загрузки всех ресурсов.
- Смешивать paint и composite.
- Считать `z-index` прямой гарантией отдельного GPU-layer.

## Дополнительные вопросы

- Какие ресурсы блокируют parser и render?
- Когда строится CSSOM?
- Как диагностировать LCP?
