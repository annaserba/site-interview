---
id: wildberries-critical-rendering-path
title: Как браузер превращает HTML и CSS в изображение на экране?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
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


## Код из интервью

```typescript
/* CSS Specificity — порядок приоритетов */
/* 1. inline (1000) > ID (100) > class (10) > element (1) */
.nav .item { color: gray; }    /* 0,0,2,0 */
#header .item { color: red; }  /* 0,1,1,0 */

/* SASS — избегайте глубокой вложенности */
/* Плохо */
.nav ul li a span.label { }
/* Хорошо — BEM */
.nav__link-label { }
```

## Пример ответа

Critical Rendering Path — это путь, который проходит HTML и CSS, чтобы стать пикселями на экране: 1) Browser получает HTML → строит DOM树; 2) Получает CSS → строит CSSOM; 3) DOM + CSSOM = Render Tree; 4) Layout (計算 positions) → Paint (рисует pixels) → Composite (слои). Оптимизация: 1) Critical CSS — inline CSS для above-the-fold контента; 2) Async loading для non-critical CSS; 3) Minimize render-blocking resources; 4) Использовать content-visibility: auto. На практике: я разделяю CSS на critical (inline) и non-critical (preload), что сокращает FCP на 40%.

## Частые ошибки

- Говорить, что DOM строится только после загрузки всех ресурсов.
- Смешивать paint и composite.
- Считать `z-index` прямой гарантией отдельного GPU-layer.

## Дополнительные вопросы

- Какие ресурсы блокируют parser и render?
- Когда строится CSSOM?
- Как диагностировать LCP?
