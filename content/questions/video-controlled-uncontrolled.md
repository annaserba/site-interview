---
id: video-controlled-uncontrolled
title: "Controlled и uncontrolled формы в React: в чём разница и когда что использовать?"
category: React
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["frontend", "fullstack"]
companies: []
level: junior-middle
stage: Техническое
tags: ["react", "forms", "controlled", "uncontrolled"]
duration: 7 мин
difficulty: 2
sourceType: candidate-report
sourceUrl: ""
sourceVideos: [{"company":"Frontend-интервью","url":"https://www.youtube.com/watch?v=a43a-SCCHLg&t=4119s","title":"React формы: controlled vs uncontrolled"}]
---

## Короткий ответ

В controlled-компоненте значение поля хранится в state: `<input value={value} onChange={...}>` — React является единственным источником правды, каждое изменение проходит через setState и рендер. В uncontrolled значение живёт в самом DOM, а читается по требованию через ref: `<input defaultValue={...} ref={ref}>`. Controlled — выбор по умолчанию: мгновенная валидация, маски, зависимые поля. Uncontrolled оправдан для простых форм, интеграций с не-React кодом и тяжёлых полей вроде file input.

## Контекст

Вопрос проверяет понимание того, кто владеет состоянием формы. Хороший ответ структурный: определение обоих подходов, плюсы/минусы, критерии выбора и пример из практики.

## Как строить ответ

### Controlled

- Источник правды — state; UI = f(state).
- Даёт: валидацию на каждый ввод, маски/форматирование, условную блокировку кнопки, связанные поля.
- Цена: рендер на каждое нажатие (в больших формах — продумать структуру или библиотеку).

### Uncontrolled

- Источник правды — DOM; значение забираем через ref при submit.
- Меньше рендеров, проще интегрировать сторонние DOM-библиотеки.
- `<input type="file">` — всегда uncontrolled.
- `defaultValue` вместо `value`, иначе поле станет read-only.

### Критерии выбора

- Нужна логика на живой ввод → controlled.
- Простая форма «заполнил — отправил» → uncontrolled допустим.
- Библиотеки: React Hook Form — управляемые формы с минимумом ре-рендеров (ref-based под капотом).

## Пример ответа

«Controlled — когда значение в state и каждое изменение идёт через onChange: это даёт мгновенную валидацию и контроль, поэтому беру его по умолчанию. Uncontrolled — значение в DOM, читаю через ref на submit: подходит для простых форм и file input. В больших формах, чтобы не платить рендером за каждый кейстрок, использую React Hook Form — он регистрирует поля через ref и ререндерит только нужное.»

## Частые ошибки

- Смешивать `value` и `defaultValue` на одном поле.
- Передавать `value` без `onChange` и удивляться read-only.
- Думать, что uncontrolled — «устаревший» подход, который нельзя использовать.
- Не упоминать библиотеки форм и цену ре-рендеров.

## Дополнительные вопросы

- Почему input с value без onChange становится read-only?
- Как React Hook Form избегает лишних рендеров?
- Как реализовать маску телефона в controlled-поле?
- Что такое defaultValue и когда он применяется?
