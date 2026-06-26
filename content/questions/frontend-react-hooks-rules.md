---
id: frontend-react-hooks-rules
title: Какие правила использования React Hooks и зачем они нужны?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["React Hooks", "Purity", "Lint"]
duration: 15 мин
difficulty: 4
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2651s"
---

## Короткий ответ

Hooks вызываются только на верхнем уровне React function component или custom hook, не в условиях, циклах, event handlers и обычных функциях. React связывает hook state с порядком вызовов, поэтому порядок должен быть одинаковым на каждом render. Компонент и hooks обязаны быть чистыми во время render; effects синхронизируют внешние системы и корректно очищаются. `eslint-plugin-react-hooks` проверяет правила и dependencies.

## Контекст

Senior-ответ связывает правила с моделью render, а не просто перечисляет запреты.

## Код из интервью

```tsx
function Profile({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  const [name, setName] = useState('')
  useEffect(() => subscribe(name), [])

  return <input value={name} onChange={event => setName(event.target.value)} />
}

// Какие правила Hooks нарушены и как исправить код?
```

## Как строить ответ

### Порядок

Почему условный hook сдвигает последующие slots.

### Purity

Что нельзя делать во время render.

### Effects

Dependencies, cleanup и Strict Mode.

## Пример ответа

Правила React Hooks: 1) Вызывайте только на верхнем уровне (не в conditions, loops); 2) Только из React-компонентов или custom hooks. Причина: React хранит состояние в массиве по порядку вызовов. Если вызов изменится, state «сместится». Пример:

```javascript
// ❌ Неправильно
function Component({ show }) {
  if (show) {
    const [value, setValue] = useState(0);
  }
}

// ✅ Правильно
function Component({ show }) {
  const [value, setValue] = useState(0);
}
```

Custom hooks начинаются с use — это подсказка для линтера. ESLint plugin eslint-plugin-react-hooks проверяет правила. Я всегда проверяю, что hooks вызываются одинаково при каждом рендере.

## Частые ошибки

- Вызывать hook после early return.
- Подавлять exhaustive-deps без анализа.
- Использовать effect для вычисляемого состояния.

## Дополнительные вопросы

- Зачем Strict Mode повторяет effect?
- Когда custom hook допустим в callback?
