export interface BlogArticle {
  id: string
  title: string
  description: string
  tags: string[]
  readTime: string
  content: string
}

export const blogArticles: BlogArticle[] = [
  {
    id: 'system-design-interview',
    title: 'Как пройти System Design интервью',
    description: 'Полное руководство по подготовке к архитектурным собеседованиям: от базовых концепций до продвинутых паттернов.',
    tags: ['System Design', 'Архитектура', 'Senior'],
    readTime: '15 мин',
    content: `
## Что проверяют на System Design интервью

System Design интервью — это не про заучивание паттернов. Интервьюер проверяет вашу способность проектировать реальные системы под бизнес-требования. Ключевые навыки:

- **Requirements clarification** — уточнение Functional и Non-Functional требований
- **High-level design** — выбор архитектуры и компонентов
- **Deep dive** — детализация критичных частей
- **Trade-offs** — обоснование выбора между альтернативами

## Структура ответа (40-45 минут)

### 1. Requirements (5 мин)
Уточните:
- Какие функции должна выполнять система?
- Масштаб: сколько пользователей/запросов?
- Latency: real-time или batch?
- Consistency vs Availability?

### 2. High-Level Design (10 мин)
Нарисуйте основные компоненты:
- API Gateway / Load Balancer
- Application servers
- Database (SQL/NoSQL)
- Cache layer
- Message queues

### 3. Deep Dive (15 мин)
Детализируйте критичные компоненты:
- Database schema и sharding strategy
- Caching strategy (Redis, CDN)
- Message queues (Kafka, RabbitMQ)
- Consistency model

### 4. Trade-offs (5 мин)
Обоснуйте каждый выбор:
- Почему SQL, а не NoSQL?
- Почему cache-aside, а не write-through?
- Как обрабатываетеfailover?

## Частые вопросы

### «Спроектируйте Twitter/Instagram/WhatsApp»
Классический формат. Ключевые аспекты:
- **Feed**: fanout-on-write vs fanout-on-read
- **Media**: object storage + CDN
- **Notifications**: push via APNS/FCM
- **Search**: inverted index (Elasticsearch)

### «Спроектируйте URL shortener»
Простой старт для разминки:
- Hash/encode URL → короткий код
- Storage: key-value (Redis/DynamoDB)
- Analytics: click tracking через Kafka

### «Спроектируйте чат систему»
- WebSocket для real-time
- Message storage: append-only log
- Presence: heartbeat + Redis
- Group chat: fan-out

## Подготовка

1. **Практика**: 2-3 mock интервью в неделю
2. **Шаблоны**: выучите 5-7 базовых паттернов
3. **Масштаб**: всегда обсуждайте numbers (QPS, storage, bandwidth)
4. **Trade-offs**: никогда не говорите «это лучшее решение» — говорите «это подходит при X, потому что Y»
    `
  },
  {
    id: 'algorithm-interview',
    title: 'Как пройти алгоритмическое интервью',
    description: 'Стратегия решения coding задач: от понимания условия до оптимизации решения.',
    tags: ['Algorithms', 'Coding', 'LeetCode'],
    readTime: '12 мин',
    content: `
## Структура алгоритмического интервью

Алгоритмическое интервью длится 45-60 минут. Важно не только решить задачу, но и показать мышление.

### Фаза 1: Понимание задачи (5 мин)
- Прочитайте условие внимательно
- Задайте уточняющие вопросы
- Приведите 2-3 примера входных данных
- Уточните edge cases

### Фаза 2: Обсуждение подходов (10 мин)
- Назовите 2-3 возможных подхода
- Обсудите time/space complexity каждого
- Выберите оптимальный и объясните почему

### Фаза 3: Код (20 мин)
- Пишите чистый, читаемый код
- Комментируйте сложные участки
- Используйте осмысленные имена переменных

### Фаза 4: Тестирование (5 мин)
- Пройдитесь по примерам
- Проверьте edge cases (пустой ввод, один элемент, overflow)
- Сложный case: что если массив из 1M элементов?

## Топ паттернов

### Two Pointers
Задачи с отсортированным массивом, палиндромы, сумма двух.
\`\`\`python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
\`\`\`

### Sliding Window
Подстроки, подмассивы, max/min в окне.
\`\`\`python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum
\`\`\`

### BFS/DFS
Графы, деревья, лабиринты, уровень узлов.
\`\`\`python
def bfs(graph, start):
    visited = set([start])
    queue = [start]
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

### Dynamic Programming
Задачи с оптимизацией, подпоследовательности, рюкзак.
\`\`\`python
def fibonacci(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Частые ошибки

1. **Спешка с кодом** — не обсудив подходы
2. **Игнор edge cases** — пустой массив, null, overflow
3. **Сложность без обоснования** — «это O(n²)» без объяснения
4. **Нет оптимизации** — если интервьюер намекает

## Подготовка

- **LeetCode**: 150-200 задач (Medium hardness)
- **Паттерны**: выучите 14 базовых паттернов (Blind 75/NeetCode 150)
- **Тайминг**: решайте задачи за 25-30 минут
- **Mock**: практикуйтесь с напарником или на платформах
    `
  },
  {
    id: 'management-interview',
    title: 'Как пройти управленческую секцию',
    description: 'Подготовка к leadership и management вопросам: стратегия, конфликты, развитие команды.',
    tags: ['Management', 'Leadership', 'HR'],
    readTime: '10 мин',
    content: `
## Зачем нужна управленческая секция

Даже если вы IC (Individual Contributor), на Senior+ уровнях проверяют ability:
- Влиять на команду без прямых полномочий
- Принимать архитектурные решения с учётом бизнес-контекста
- Объяснять технические решения нетехническим стейкхолдерам
- Развивать других инженеров

## Формат: STAR метод

Отвечайте по структуре:

- **Situation** — контекст (проект, команда, проблема)
- **Task** — ваша роль и что требовалось
- **Action** — что конкретно сделали вы
- **Result** — измеримый результат

### Пример
**Вопрос**: «Расскажите о ситуации, когда вы улучшили процесс в команде.»

> **S**: В команде из 8 инженеров code review занимал в среднем 3 дня, что тормозило релизы.
> **T**: Меня попросили найти способ ускорить процесс без потери качества.
> **A**: Я провёл аудит: выяснил, что 40% PR ждали ревью больше 2 дней. Предложил систему rotating reviewers + автоматические checklints. Настроил Slack-бот для напоминаний.
> **R**: Среднее время ревью снизилось с 3 до 1.2 дня. Velocity команды выросла на 20%.

## Типичные вопросы и ответы

### «Как вы разрешаете конфликты в команде?»

Ключевые моменты:
- Слушайте обе стороны
- Фокусируйтесь на проблеме, не на личностях
- Ищите компромисс
- Документируйте решение

> «В прошлом проекте дваSenior-а спорили о выборе базы данных. Один за PostgreSQL, другой за MongoDB. Я организовал tech talk: каждый подготовил сравнение для нашего use case. Выбрали PostgreSQL для основных данных и MongoDB для логов — оба были довольны, потому что решение было data-driven.»

### «Как вы развиваете инженеров?»

- 1-on-1 встречи (еженедельно)
- Чёткие цели (OKR/SMART)
- Code review как learning tool
- Mentoring и pairing
- Конференции и обучение

### «Расскажите о неудаче»

Честность + выводы:
- Что пошло не так
- Что вы сделали
- Что изменили в подходе
- Какой результат после изменений

### «Как приоритизируете задачи?»

- Impact vs Effort матрица
- Business value + technical debt баланс
- Дедлайны и зависимости
- Прозрачность для команды

## Подготовка

1. **Подготовьте 5-7 историй** из опыта (успех, конфликт, неудача, инициатива, результат)
2. **Практикуйте STAR** — каждая история ≤ 3 минуты
3. **Изучите компанию** — какие ценности, какой стиль управления
4. **Будьте собой** — не заучивайте ответы, говорите от души
5. **Задавайте вопросы** — «Как у вас организован process?», «Какие challenges сейчас у команды?»
    `
  }
]
