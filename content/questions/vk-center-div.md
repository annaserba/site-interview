---
id: vk-center-div
title: Как можно отцентрировать div?
category: CSS
scope: universal
languages: ["CSS"]
roles: ["Frontend"]
companies: ["VK"]
sourceVideos: [{"company":"Frontend-интервью","url":"https://www.youtube.com/watch?v=a43a-SCCHLg&t=3251s","title":"Топ-1 вопрос по вёрстке"}]
level: Junior
stage: Техническое
tags: ["CSS", "Flexbox", "Grid", "Centering"]
duration: 5 мин
difficulty: 1
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Современные способы: grid — place-items: center на родителе; flexbox — justify-content + align-items: center. По горизонтали — margin: 0 auto для блочного с шириной. Legacy: absolute + transform: translate(-50%, -50%), inline-block + text-align: center, table-cell. Выбор зависит от оси и контекста.

## Контекст

Классическая разминка: ждут несколько способов и понимание, когда какой применять.

## Как строить ответ

### Grid

Родителю display: grid; place-items: center — одна строка центрирует по обеим осям. Современный дефолт.

### Flexbox

display: flex; justify-content: center; align-items: center — то же самое, чуть многословнее; гибче при нескольких детях.

### Горизонтальное центрирование

Блок с заданной шириной: margin-inline: auto. Инлайн-контент: text-align: center у родителя.

### Legacy и абсолют

position: absolute; top/left: 50%; transform: translate(-50%, -50%) — центрирование без влияния родителя, для оверлеев и тултипов.

## Пример ответа

Самый короткий современный способ — grid на родителе: display: grid; place-items: center — центрирует по обеим осям одной строкой. Классика — flexbox: display: flex; justify-content: center по главной оси и align-items: center по поперечной. Если нужно центрировать только по горизонтали и у блока есть ширина — достаточно margin: 0 auto. Для инлайнового содержимого — text-align: center на контейнере. Из старых приёмов: абсолютное позиционирование — top: 50%; left: 50% и transform: translate(-50%, -50%), полезно для модалок и оверлеев, где элемент вырван из потока. Выбираю по контексту: в потоке — grid или flex, поверх потока — absolute с transform.

## Частые ошибки

- margin: auto без заданной ширины блока
- align-items без display: flex/grid
- Центрировать inline-элемент как block
- Забыть position: relative родителю при absolute-центрировании

## Дополнительные вопросы

- Как отцентрировать по вертикали без flex/grid?
- Чем margin: auto работает в flex-контейнере?
- Как центрировать при неизвестных размерах ребёнка?
- Что изменилось с появлением align-content в блочном layout?
