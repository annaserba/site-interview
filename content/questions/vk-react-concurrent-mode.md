---
id: vk-react-concurrent-mode
title: Что такое Concurrent Mode и как React планирует обновления?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["VK"]
level: Senior
stage: Архитектура
tags: ["React", "Concurrent Mode", "startTransition", "Priority"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Concurrent Mode (React 18+) позволяет React прерывать рендеринг для обработки более приоритетных обновлений. startTransition помечает обновления как неважные (поиск, фильтры), а обычные setState — как срочные (клики, навигация). Scheduler планирует задачи с учётом приоритетов и дедлайнов.

## Контекст

Интервьюер проверяет глубокое понимание архитектуры React: как scheduler планирует обновления, batching, startTransition vs useCallback, приоритеты рендеринга и microtask starvation в контексте React.

## Как строить ответ

### Объяснить scheduler

React использует внутренний scheduler (MessageChannel/channelPostMessage) для планирования обновлений. Каждое обновление получает приоритет — immediate, userBlocking, normal, low, idle.

### Описать batching

React 18 автоматически батчит все обновления (включая setTimeout, Promise, native events). Раньше batching был только в обработчиках событий.

### Разобрать startTransition

useTransition/useDeferredValue помечают обновления как неважные — React может прервать их для обработки срочных. Это снижает jank при вводе текста в фильтрах.

### Показать microtask starvation

Бесконечный setState в microtask блокирует scheduler — UI зависает. React ограничивает количество микро-задач.

## Код из интервью

```tsx
import { useState, useTransition, useDeferredValue } from "react";

function SearchResults() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      // Дорогой рендер — помечаем как неважный
      setResults(heavySearch(value));
    });
  };

  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        {results.map((r) => (
          <div key={r}>{r}</div>
        ))}
      </div>
    </div>
  );
}
```

## Пример ответа

Concurrent Mode — это архитектура React 18+, которая позволяет прерывать рендеринг. Scheduler планирует обновления по приоритетам: клик пользователя — срочный, ввод текста в фильтр — может подождать.

startTransition помечает обновление как неважное — React начнёт рендерить, но если придёт срочное обновление, прервёт и обработает его. useDeferredValue — обёртка над startTransition для значений.

Батчинг в React 18 автоматический — setState в setTimeout/Promise не вызывает лишних рендеров. Это отличие от React 17.

Microtask starvation: если бесконечно вызывать setState в Promise.then, React не сможет обработать пользовательский ввод. Scheduler имеет внутренний лимит.

## Частые ошибки

- Путать Concurrent Mode с SSR — это разные вещи, они дополняют друг друга.
- Считать, что startTransition делает код быстрее — он делает UI отзывчивым, не ускоряя вычисления.
- Забывать, что batching в React 18 автоматический — не нужно оборачивать в unstable_batchedUpdates.
- Не понимать, что useDeferredValue может показывать устаревшие данные — это осознанный tradeoff.

## Дополнительные вопросы

- Как scheduler определяет приоритет обновлений?
- В чём разница между useTransition и useDeferredValue?
- Как Concurrent Mode влияет на useEffect и cleanup?
- Можно ли отменить прерванное обновление?
