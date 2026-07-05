---
id: algorithm-interview
title: "Как пройти алгоритмическое интервью"
description: "Стратегия решения coding задач: от понимания условия до оптимизации решения."
tags: ["Algorithms", "Coding", "LeetCode"]
readTime: "12 мин"
---

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
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
```

### Sliding Window
Подстроки, подмассивы, max/min в окне.
```python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

### BFS/DFS
Графы, деревья, лабиринты, уровень узлов.
```python
def bfs(graph, start):
    visited = set([start])
    queue = [start]
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### Dynamic Programming
Задачи с оптимизацией, подпоследовательности, рюкзак.
```python
def fibonacci(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

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
