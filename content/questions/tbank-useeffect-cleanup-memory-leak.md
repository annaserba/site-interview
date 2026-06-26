---
id: tbank-useeffect-cleanup-memory-leak
title: Как исправить утечку памяти в useEffect?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Middle
stage: Live coding
tags: ["React", "useEffect", "Cleanup", "Memory Leak"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Cleanup функция в useEffect вызывается при размонтировании компонента и перед каждым повторным вызовом эффекта — она должна отменять подписки, таймеры и запросы. Для fetch используйте AbortController, для event listeners — removeEventListener, для интервалов — clearInterval. React DevTools Profiler показывает утечки через увеличение количества нод при навигации.

## Контекст

Проверяется понимание жизненного цикла React компонентов и правильное управление ресурсами в асинхронных эффектах.

## Как строить ответ

### Назвать причину утечки

Утечка памяти возникает, когда не отменяются при размонтировании: open connections, running timers, event listeners на глобальных объектах.

### Показать Cleanup паттерн

```javascript
useEffect(() => {
  const abortController = new AbortController();
  fetchData({ signal: abortController.signal });
  return () => abortController.abort();
}, []);
```

### Разделить типы

Fetch — AbortController, event listeners — removeEventListener, timers — clearInterval/clearTimeout, subscriptions — unsubscribe.

### Показать stale closure

Замыкание захватывает устаревшее значение state из-за async операции — решается через ref или dependency array.


## Код из интервью

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const abortController = new AbortController();

    async function loadUser() {
      try {
        setStatus("loading");
        const response = await fetch(`/api/users/${userId}`, {
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        setUser(data);
        setStatus("idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return; // Expected cleanup, not an error
        }
        setStatus("error");
      }
    }

    loadUser();

    return () => {
      abortController.abort();
    };
  }, [userId]); // Re-run when userId changes

  return <div>{status === "loading" ? "Loading..." : user?.name}</div>;
}
```

## Пример ответа

useEffect с пустым dependency array [] вызывается один раз при mount. Cleanup функция, которую он возвращает, вызывается при unmount. Если cleanup не определён, продолжают выполняться: таймеры тикают, event listeners остаются, fetch запросы завершаются и пытаются вызвать setState на unmount-ном компоненте.

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("tick");
  }, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

Паттерн для fetch: AbortController. Паттерн для event listeners: функция-обработчик сохраняется в переменную и передаётся в addEventListener/removeEventListener.

## Частые ошибки

- Не возвращать cleanup функцию из useEffect при наличии.
- Использовать AbortController без проверки error.name === "AbortError" — abort выбрасывает ошибку, которую нужно отличать от реальных ошибок.
- Забывать добавить переменные из замыкания в dependency array — приводит к stale closure.
- Вызывать setState после размонтирования — отловить можно через флаг или AbortController.


## Дополнительные вопросы

- Как useEffect cleanup работает с StrictMode в dev режиме?
- Что такое stale closure и как он связан с async операциями в useEffect?
- Как проверить наличие утечки памяти в React приложении?
- Чем useEffect отличается от useLayoutEffect с точки зрения cleanup timing?
