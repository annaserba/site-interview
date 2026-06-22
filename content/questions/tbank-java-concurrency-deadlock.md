---
id: tbank-java-concurrency-deadlock
title: "Найдите deadlock в коде и предложите исправление"
category: Concurrency
scope: language-specific
languages: ["Java", "Kotlin"]
roles: ["Backend-разработчик"]
companies: ["Т-Банк"]
level: Middle
stage: Live coding
tags: ["Java", "Concurrency", "Deadlock", "Multithreading"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
---

## Короткий ответ

Deadlock возникает когда два потока захватывают мониторы в разном порядке (A→B и B→A). Решения:一致 lock ordering (всегда захватывать в одном порядке), `tryLock` с таймаутом, `CompletableFuture` для асинхронных транзакций, `ConcurrentHashMap` вместо synchronized maps. Проверяйте `jstack` или ThreadMXBean для диагностики.

## Контекст

Проверяется понимание многопоточности в Java: мониторы, условия deadlock, инструменты диагностики и паттерны предотвращения. Классический банковский кейс — transfer между счетами.

## Как строить ответ

### Показать классический deadlock

Два потока захватывают два монитора в обратном порядке:

```java
// Поток 1: transfer(accountA, accountB)
synchronized (accountA) {       // захватил A
    synchronized (accountB) {   // ждёт B
        accountA.debit(amount);
        accountB.credit(amount);
    }
}

// Поток 2: transfer(accountB, accountA)
synchronized (accountB) {       // захватил B
    synchronized (accountA) {   // ждёт A
        accountB.debit(amount);
        accountA.credit(amount);
    }
}
```

### Объяснить условие deadlock (4 условия)

1. **Mutual Exclusion** — монитор захвачен одним потоком
2. **Hold and Wait** — поток держит монитор и ждёт другой
3. **No Preemption** — нельзя отобрать монитор
4. **Circular Wait** — A ждёт B, B ждёт A

### Решение 1: Lock Ordering

Всегда захватывать мониторы в порядке ID счёта:

```java
public void transfer(Account from, Account to, int amount) {
    Account first = from.getId() < to.getId() ? from : to;
    Account second = from.getId() < to.getId() ? to : from;

    synchronized (first) {
        synchronized (second) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}
```

### Решение 2: tryLock с таймаут

```java
public void transfer(Account from, Account to, int amount) {
    Lock lockA = from.getLock();
    Lock lockB = to.getLock();

    while (true) {
        try {
            if (lockA.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    if (lockB.tryLock(100, TimeUnit.MILLISECONDS)) {
                        try {
                            from.debit(amount);
                            to.credit(amount);
                            return;
                        } finally {
                            lockB.unlock();
                        }
                    }
                } finally {
                    lockA.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
    }
}
```

### Решение 3: Асинхронный подход с CompletableFuture

```java
public CompletableFuture<Void> transfer(Account from, Account to, int amount) {
    return CompletableFuture.runAsync(() -> from.debit(amount))
        .thenRunAsync(() -> to.credit(amount));
}
```

## Код из интервью

```java
public class Bank {
    // Deadlock: два потока захватывают в обратном порядке
    public synchronized void transferA(Bank other, int amount) {
        this.balance -= amount;
        other.deposit(amount);  // вызов synchronized метода другого объекта
    }

    // Поток 1: bank1.transferA(bank2, 100)
    // Поток 2: bank2.transferA(bank1, 50)
    // → DEADLOCK

    // Исправление: lock ordering по hashCode
    public void safeTransfer(Bank other, int amount) {
        Bank first = System.identityHashCode(this) < System.identityHashCode(other) ? this : other;
        Bank second = first == this ? other : this;

        synchronized (first) {
            synchronized (second) {
                first.balance -= amount;
                second.deposit(amount);
            }
        }
    }
}
```

## Пример ответа

Deadlock — ситуация когда два или более потока бесконечно ждут друг друга. В банковском контексте: transfer от A к B и от B к A одновременно.

Диагностика: `jstack <pid>`, `ThreadMXBean.findDeadlockedThreads()`, или Arthas. В логах видно: "BLOCKED"��态 у потоков.

Решения по приоритету:

1. **Lock ordering** — проще всего, захватывать всегда в порядке ID/hashCode. Минус: нужно поддерживать порядок во всём коде.

2. **tryLock** — гибче, можно откатить и попробовать снова. Минус: spin-waiting, сложнее код.

3. **Асинхронность** — CompletableFuture или reactive подход. Нет мониторов — нет deadlock. Минус: сложнее reasoning.

4. **ConcurrentHashMap** — вместо `Collections.synchronizedMap`. ConcurrentHashMap использует striping (сегменты), минимизирует contention.

На практике: Lock Ordering для простых случаев, асинхронность для сложных транзакций.

## Частые ошибки

- Считать deadlock «когда поток завис» — это может быть livelock или starvation.
- Использовать `System.out.println` для диагностики — используйте jstack/Arthas.
- Решать deadlock добавлением `Thread.sleep()` — это не решение, а маскировка.

## Дополнительные вопросы

- Как диагностировать deadlock в production (без остановки)?
- В чём разница между deadlock и livelock?
- Как использовать Striped Lock из Guava для банковских операций?
