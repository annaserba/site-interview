# Skill: loop-demo

## Назначение

`loop-demo` показывает, как вести разработку через нейросети короткими контролируемыми итерациями. Skill подходит для задач в этом проекте: Astro pages, React islands, Node API, RAG, markdown content и сборочные скрипты.

## Быстрый запуск цикла

```text
Use Maker to implement the smallest useful change.
Use Checker to review the diff and verification.
Fix only issues that affect correctness, safety, UX or maintainability.
Run the cheapest meaningful verification command.
Summarize the result.
```

## Контекст проекта

- Frontend: Astro 7 + React islands.
- Styling: CSS Modules and global `src/index.css`.
- API: vanilla Node.js in `server/`.
- Content source: `content/questions/*.md`.
- Generated data: `src/data/questions.json`, `public/data/questions.json`, `public/data/questions-index.json`.
- Main checks: `npm run test`, `npm run build`.

## Итерация

### 1. Frame

Запиши задачу в формате:

```text
User outcome: ...
Developer outcome: ...
Out of scope: ...
```

### 2. Make

Maker читает только нужные файлы, меняет минимальную поверхность и оставляет заметку:

```text
Changed files:
Verification command:
Known risks:
```

### 3. Check

Checker смотрит не на стиль ради стиля, а на риски:

- корректность поведения;
- совместимость с текущей архитектурой;
- тестовые пробелы;
- безопасность;
- пользовательский сценарий.

### 4. Fix

Исправляй только замечания `P0-P2`. `P3` оставляй в backlog, если оно не блокирует задачу.

### 5. Verify

Выбери самую дешевую достаточную проверку:

```bash
npm run test
npm run content
npm run index
npm run build
```

## Пример применения

```markdown
User outcome: кандидат видит новый вопрос про AI-driven development.
Developer outcome: markdown попадает в generated data.
Out of scope: менять дизайн страницы вопроса.

Maker:
- добавил `content/questions/universal-ai-driven-development.md`
- запустил `npm run content`

Checker:
- проверил frontmatter, tags, roles, stage;
- попросил добавить пример ответа и частые ошибки.

Fix:
- дополнил секции.

Verify:
- `npm run content`
- `npm run index`
```

## Анти-паттерны

- "Сделай идеально" без цели и проверки.
- Один агент одновременно пишет, ревьюит и принимает свое решение.
- Большой diff без промежуточной проверки.
- Генерация кода без чтения существующих паттернов.
- Обновление production-инфраструктуры без отдельного review.
